var express = require("express");

var router = express.Router();
var db = require('../models');



// Create all our routes and set up logic within those routes where required.
router.get("/", function(req, res) {
    res.send("Home Page");
});
router.get("/reports/all-supervisors", function(req, res) {
    //res.send("All Supervisor Information");

  /*  db.Supervisor.findAll({ raw: true}).then(function(dbsupervisors) {
        //console.log(dbsupervisors);
        //res.json(dbsupervisors);
        //var allSuper={ supervisors: dbsupervisors };
        //console.log(allSuper);
        res.render("supervisors-report", {supervisors: dbsupervisors});
    }); */
    db.Supervisor.findAll( {include: [db.Store]}).then(function(dbsupervisors) {
        //console.log(dbsupervisors);
        //res.json(dbsupervisors);
        //var allSuper={ supervisors: dbsupervisors };
        //console.log(dbsupervisors);
        var totalHosts=dbsupervisors.length;;
        var participation=0;
        var actives=0;
        
        //console.log(dbsupervisors[2].dataValues.StoreId);
        //JSON.parse();
        for(i=0;i<totalHosts;i++){
            if(dbsupervisors[i].dataValues.StoreId)
                actives++;
        } 
        participation=(actives/totalHosts*100).toFixed(2);
    

        res.render("supervisors-report", {supervisors: dbsupervisors, actives,participation});
        //res.json({supervisors: dbsupervisors, totalHosts,participation});
    });




});


router.get("/all-stores", function(req, res) {
    db.Store.findAll().then(function(dbStore){
        //console.log(dbStore[1].dataValues);
        res.json(dbStore);
    });
});

router.get("/supervisors/:name&:lastName", function(req, res) {
    var name=req.params.name;
    var lastName=req.params.lastName;
    res.render("supervisor-form",{name,lastName});
});
router.post("/supervisors/:name", function(req, res) {
    res.send("Post Route for registering a store as a host");
});

router.put("/stores/update/:id", function(req, res) {

    db.Supervisor.update(
      {StoreId:req.params.id},
      {
        where: {
          firstname: req.body.firstname,
          lastname:  req.body.lastname
        }
      }
      ).then(function(dbsupervisors) {
        //console.log(dbsupervisors[0].dataValues);
        //res.json(dbsupervisors);
            db.Store.update(
                {selected:true},
                {
                    where:{
                        id:req.params.id
                    }
                }
            ).then(function(dbStore){
                res.json(dbStore);
            });
      });
  });

  router.put("/supervisors/remove-selected-store", function(req, res) {
      var storeid=0;
      var pplSelected=0
      db.Supervisor.findAll({
          where:{
            firstname: req.body.firstname,
            lastname: req.body.lastname
          }
      }).then(function(Super){
          
        //console.log(Super[0].dataValues);
        storeid=Super[0].dataValues.StoreId;
        db.Supervisor.findAll().then(function (allSuper){
            //console.log(allSuper[3].dataValues);
            for(i=0;i<allSuper.length;i++)
                if(allSuper[i].dataValues.StoreId==storeid)
                    pplSelected++;
            
            if(pplSelected==1)
                db.Store.update(
                    {selected:false},
                    {
                        where:{
                            id: storeid
                        }
                    }
                );
          })
      })

      .then( (
        db.Supervisor.update(
            {StoreId:null},
            {
                where:{
                    firstname: req.body.firstname,
                    lastname: req.body.lastname
                }
            }
        ))
        .then(function(dbsupervisors){
            res.json(dbsupervisors);
            console.log(dbsupervisors);
    
        })
    );
      

});

router.get("/reports/all-stores", function(req, res) {
    updateStatus();
     //res.render("stores-report",{stores:[{id:"123",name:"bahbh", type:"General", region:"empty"}]});
     db.Store.findAll().then(function(dbstores) {
      
         var totalHosts=0;
         var totalGenerals=0;
         var totalSurrounding=0;
         
         
         for(i=0;i<dbstores.length;i++){
             if(dbstores[i].dataValues.status=="Host")
                 totalHosts++;
             if(dbstores[i].dataValues.status=="General")
                 totalGenerals++;
             if(dbstores[i].dataValues.status=="Surrounding")
                 totalSurrounding++;
         } 
         
     
 
         res.render("stores-report", {stores: dbstores, totalHosts,totalGenerals,totalSurrounding});
         //res.json({supervisors: dbsupervisors, totalHosts,participation});
     });
 
     
 
 
 });

function updateStatus(){
    //console.log("function");
    var storesArray=[];
    db.Store.findAll().then(function(dbStore){
        //console.log(dbStore[0].dataValues);
        for(i=0;i<dbStore.length;i++){
            var storeEntry={
                id:dbStore[i].dataValues.id,
                status:dbStore[i].dataValues.status,
                lat:dbStore[i].dataValues.latitude,
                long:dbStore[i].dataValues.longitude    
            };
            storesArray.push(storeEntry);
            //console.log(storesArray);
        }
        for(i=0;i<dbStore.length;i++){
            if(dbStore[i].dataValues.selected)
                storesArray[i].status="Host"
        }
        console.log(storesArray);
        // mark all the stores with Host or Surrounding lables
        for(i=0;i<storesArray.length;i++)
            if(storesArray[i].status=="General")
                for(j=i+1;j<storesArray.length;j++){
                    //checking the distances
                    if(storesArray[j].status=="Host"){
                      /*  var xSub= storesArray[j].long - storesArray[i].long;
                        var Ysub= storesArray[j].lat - storesArray[i].lat;
                        var distance= Math.sqrt(Math.pow(xSub,2)+Math.pow(Ysub,2)); */
                        var dist= distance(storesArray[i].lat,storesArray[i].long,storesArray[j].lat,storesArray[j].long);
                        console.log(dist);
                        if(dist<15){
                            storesArray[i].status="Surrounding"; 
                            //console.log(storesArray);
                        }
                         
                        
                    }

                    

                }
                
                console.log(storesArray);

                    
    });
}

function distance(lat1, lon1, lat2, lon2, unit) {
        var radlat1 = Math.PI * lat1/180;
        var radlat2 = Math.PI * lat2/180;
        var radlon1 = Math.PI * lon1/180;
        var radlon2 = Math.PI * lon2/180;
        var theta = lon1-lon2;
        var radtheta = Math.PI * theta/180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit=="K") { dist = dist * 1.609344 }
        if (unit=="N") { dist = dist * 0.8684 }
        //console.log(dist);
        return dist;
}









// Export routes for server.js to use.
module.exports = router;