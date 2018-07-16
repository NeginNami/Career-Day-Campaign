var express = require("express");
var router = express.Router();
var db = require('../models');

var bcrypt = require('bcrypt-nodejs');
var passport = require('passport');

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
      return next();
    req.flash('error', 'You have to be logged in to access the page.');
    res.redirect('/login');
};
var isAuthenticated2 = function (req, res, next) {
    if (req.isAuthenticated())
      return next();
    req.flash('error', 'You have to be logged in to access the page.');
    res.redirect('/home');
};


// Create all our routes and set up logic within those routes where required.
router.get("/",isAuthenticated2,function(req, res) {
    res.render("dashboard")
});
router.get("/home",function(req, res) {
    res.render("home-page")
});
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});
router.get("/login", function(req, res) {
    res.render("login");
});
router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/',
    failureFlash: true 
}));
router.get("/dashboard", isAuthenticated, function(req, res) {
    res.render("dashboard");
});
router.get("/reports/all-supervisors",isAuthenticated, function(req, res) {

    db.Supervisor.findAll( {include: [db.Store]}).then(function(dbsupervisors) {
   
        var totalHosts=dbsupervisors.length;;
        var participation=0;
        var actives=0;

        for(i=0;i<totalHosts;i++){
            if(dbsupervisors[i].dataValues.StoreId)
                actives++;
        } 
        participation=(actives/totalHosts*100).toFixed(2);
    

        res.render("supervisors-report", {supervisors: dbsupervisors, actives,participation});
        
    });
});


router.get("/all-stores", function(req, res) {
    db.Store.findAll().then(function(dbStore){
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
            db.Store.update(
                {selected:true},
                {
                    where:{
                        id:req.params.id
                    }
                }
            ).then(function(dbStore){
                updateStatus();
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
          
        storeid=Super[0].dataValues.StoreId;
        db.Supervisor.findAll().then(function (allSuper){
    
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
            updateStatus();
            res.json(dbsupervisors);
        })
    );
});

router.get("/reports/all-stores",isAuthenticated, function(req, res) {

    db.Store.findAll().then(function(dbStore) {
      
         var totalHosts=0;
         var totalGenerals=0;
         var totalSurrounding=0; 

         for(i=0;i<dbStore.length;i++){
             if(dbStore[i].dataValues.status=="Host")
                 totalHosts++;
             if(dbStore[i].dataValues.status=="General")
                 totalGenerals++;
             if(dbStore[i].dataValues.status=="Surrounding")
                 totalSurrounding++;
         } 

         var storesArray=[];
         for(i=0;i<dbStore.length;i++){
             var storeEntry={
                 id:dbStore[i].dataValues.id,
                 name:dbStore[i].dataValues.name,
                 region:dbStore[i].dataValues.region,
                 status:dbStore[i].dataValues.status,
                 lat:dbStore[i].dataValues.latitude,
                 long:dbStore[i].dataValues.longitude,
                 closestHostId: "----"  ,
                 distanceToClosestHost: "----"    
             };
             storesArray.push(storeEntry);
         }
 
         for(i=0;i<storesArray.length;i++){
 
             if(storesArray[i].status=="Surrounding"){
                 var minDist=1000000;
                 var closestId=0;
                 for(j=0;j<storesArray.length;j++)
                     if(storesArray[j].status=="Host"){
                         var dist= distance(storesArray[i].lat,storesArray[i].long,storesArray[j].lat,storesArray[j].long);
                         if(dist<minDist){
                             minDist=dist;
                             closestId=storesArray[j].id;
                         }
                             
                     }
                 storesArray[i].distanceToClosestHost=minDist.toFixed(2);
                 storesArray[i].closestHostId=closestId;
             }                
         }
         res.render("stores-report", {stores: storesArray, totalHosts,totalGenerals,totalSurrounding});
     });    
 });

 //Temporary route for signing up Admins
 router.post("/signup/:username&:password",function(req,res){
    var username =req.params.username;
    var password=req.params.password;
    var salt = bcrypt.genSaltSync(10);
    var hashedPassword = bcrypt.hashSync(password, salt);
    
    var newAdmin = {
      username: username,
      salt: salt,
      password: hashedPassword
    };
    
    db.Admin.create(newAdmin).then(function() {
      res.redirect('/')
    }).catch(function(error) {
      req.flash('error', "Please, choose a different username.");
      
    });

 });

function closestHost(){
    
    db.Store.findAll().then(function(dbStore){
        var storesArray=[];
        for(i=0;i<dbStore.length;i++){
            var storeEntry={
                id:dbStore[i].dataValues.id,
                name:dbStore[i].dataValues.name,
                region:dbStore[i].dataValues.region,
                status:dbStore[i].dataValues.status,
                lat:dbStore[i].dataValues.latitude,
                long:dbStore[i].dataValues.longitude,
                closestHostId: "----"  ,
                distanceToClosestHost: "----"    
            };
            storesArray.push(storeEntry);
        }

        for(i=0;i<storesArray.length;i++){

            if(storesArray[i].status=="Surrounding"){
                var minDist=1000000;
                var closestId=0;
                for(j=0;j<storesArray.length;j++)
                    if(storesArray[j].status=="Host"){
                        var dist= distance(storesArray[i].lat,storesArray[i].long,storesArray[j].lat,storesArray[j].long);
                        if(dist<minDist){
                            minDist=dist;
                            closestId=storesArray[j].id;
                        }
                            
                    }
                storesArray[i].distanceToClosestHost=minDist;
                storesArray[i].closestHostId=closestId;
            }               
        }

    });
    return storesArray1;
}

function updateStatus(){
    var storesArray=[];
    db.Store.findAll().then(function(dbStore){
       
        for(i=0;i<dbStore.length;i++){
            var storeEntry={
                id:dbStore[i].dataValues.id,
                status:"General",
                lat:dbStore[i].dataValues.latitude,
                long:dbStore[i].dataValues.longitude    
            };
            storesArray.push(storeEntry);
            
        }
        for(i=0;i<dbStore.length;i++){
            if(dbStore[i].dataValues.selected)
                storesArray[i].status="Host"
        }
        
        for(i=0;i<storesArray.length;i++)
            if(storesArray[i].status=="General")
                for(j=i+1;j<storesArray.length;j++){
                    //checking the distances
                    if(storesArray[j].status=="Host"){
                        var dist= distance(storesArray[i].lat,storesArray[i].long,storesArray[j].lat,storesArray[j].long);
                        if(dist<15){
                            storesArray[i].status="Surrounding"; 
                        }    
                    }   
                }
        // Now changing the status of our entries in database according to the evaluated array
        storesArray.forEach(function(store){
            db.Store.update({status:store.status},
            {
                where:{
                    id:store.id
                }
            });
        });          
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