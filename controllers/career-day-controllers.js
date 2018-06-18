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
router.get("/reports/all-stores", function(req, res) {
    res.send("All Stores Information");
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
      }).then(
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
                ).then(function(dbsupervisors){
                    res.json(dbsupervisors);
            
                });
          })
      );

 /*   db.Supervisor.update(
        {StoreId:null},
        {
            where:{
                firstname: req.body.firstname,
                lastname: req.body.lastname
            }
        }
    ).then(function(dbsupervisors){
        res.json(dbsupervisors);

    });  */
});











// Export routes for server.js to use.
module.exports = router;