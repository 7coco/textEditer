const express = require('express');
const connection = require('../mysqlConnection');

const router = express.Router();

router.get('/', (req, res) => {
  const selectMainData = 'SELECT * FROM `main`';
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

module.exports = router;
