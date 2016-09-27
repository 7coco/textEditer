var express = require('express');
var connection = require('../mysqlConnection');

var router = express.Router();

router.get('/', (req, res) => {
  res.render('newFile.ejs');
});

router.post('/', (req, res) => {
  var fileName = req.body.fileName;
  (() => {
    var promise = new Promise((resolve, reject) => {
      var createNewFile = 'INSERT INTO `main` (`name`, `title`) VALUES (?, ?)';
      connection.query(createNewFile, [fileName, 'NO TITLE']).then((result) => {
        req.session.main_id = result[0].insertId;
        resolve();
      }, (err) => {
        reject(err);
      });
    });
    return promise;
  })().then(() => {
    res.redirect('/textEditer');
  }).catch((err) => {
    res.render('newFile.ejs', {
      err,
    });
  });
});

module.exports = router;
