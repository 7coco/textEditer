var express = require('express');
var connection = require('../mysqlConnection');

var router = express.Router();

router.get('/', (req, res) => {
  var selectMainData = 'SELECT * FROM `main`';
  connection.query(selectMainData).then((result) => {
    res.render('openFile', {
      mainData : result[0],
    });
  }, (err) => {
    res.render('ERROR', {
      err,
    });
  });
});

router.post('/', (req, res) => {
  
})

module.exports = router;
