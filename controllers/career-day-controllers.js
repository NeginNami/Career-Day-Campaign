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
        
        console.log(dbsupervisors[2].dataValues.StoreId);
        //JSON.parse();
        for(i=0;i<totalHosts;i++){
            if(dbsupervisors[i].dataValues.StoreId)
                actives++;
        } 
        participation=(actives/totalHosts*100).toFixed(2);
    

        res.render("supervisors-report", {supervisors: dbsupervisors, totalHosts,participation});
        //res.json({supervisors: dbsupervisors, totalHosts,participation});
    });




});
router.get("/reports/all-stores", function(req, res) {
    res.send("All Stores Information");
});
router.get("/supervisors/:name&:lastName", function(req, res) {
    var name=req.params.name;
    var lastName=req.params.lastName;
    res.render("supervisor-form",{name,lastName});
});
router.post("/supervisors/:name", function(req, res) {
    res.send("Post Route for registering a store as a host");
});












// Export routes for server.js to use.
module.exports = router;