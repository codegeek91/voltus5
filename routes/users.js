var express = require('express');
var router = express.Router();
var multer  = require('multer');
var upload = multer();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/test', upload.array(), function(req, res, next) {
  console.log(req.body);
  res.status(200);
  res.send('hi');
});


module.exports = router;
