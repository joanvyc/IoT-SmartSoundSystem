var express = require('express');
var router = express.Router();
var path = require('path')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, "../views/index.html"));

});

router.post('/submit', function(req, res, next) {
  console.log("New post " + req.body.url);
  res.sendFile(path.join(__dirname, "../views/index.html"));
  
});

router.get('/viewer', function(req, res, next) {
  res.render('viewer.html');
});
module.exports = router;
