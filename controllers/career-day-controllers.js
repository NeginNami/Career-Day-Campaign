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
    db.Supervisor.findAll( {include: [db.Store], raw:true}).then(function(dbsupervisors) {
        //console.log(dbsupervisors);
        //res.json(dbsupervisors);
        //var allSuper={ supervisors: dbsupervisors };
        //console.log(dbsupervisors);
        var totalHosts=0;
        var participation=0;
        console.log(dbsupervisors[2]);
        //JSON.parse();
        


        res.render("supervisors-report", {supervisors: dbsupervisors, totalHosts,participation});
        //res.json({supervisors: dbsupervisors, totalHosts,participation});
    });




});
router.get("/reports/all-stores", function(req, res) {
    res.send("All Stores Information");
});
router.get("/supervisors/:name", function(req, res) {
 
    res.send("Form For A Supervisor");
});
router.post("/supervisors/:name", function(req, res) {
    res.send("Post Route for registering a store as a host");
});












// Export routes for server.js to use.
module.exports = router;