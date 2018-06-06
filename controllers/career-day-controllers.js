var express = require("express");

var router = express.Router();



// Create all our routes and set up logic within those routes where required.
router.get("/", function(req, res) {
    res.send("Home Page");
});
router.get("/reports/all-supervisors", function(req, res) {
    res.send("All Supervisor Information");
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