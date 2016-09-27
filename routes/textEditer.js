var express = require('express');
var connection = require('../mysqlConnection');

var router = express.Router();

router.get('/', (req, res) => {
  var mainId = req.session.main_id;
  (() => {
    var promise = new Promise((resolve) => {
      var selectMainData = 'SELECT * FROM `main` WHERE `id` = ?';
      connection.query(selectMainData, [mainId]).then((result) => {
        var values = {
          mainData : result[0][0],
        };
        resolve(values);
      }, (err) => {
        res.render('ERROR', {
          err,
        });
      });
    });
    return promise;
  })().then((values) => {
    var promise = new Promise((resolve) => {
      var selectSubData = 'SELECT * FROM `sub` WHERE `main_id` = ?';
      connection.query(selectSubData, [mainId]).then((result) => {
        values.subData = result[0];
        resolve(values);
      }, (err) => {
        res.render('ERROR', {
          err,
        });
      });
    });
    return promise;
  }).then((values) => {
    var selectMemoData = 'SELECT * FROM `memo` WHERE `main_id` = ?';
    connection.query(selectMemoData, [mainId]).then((result) => {
      res.render('textEditer', {
        mainData : values.mainData,
        subData : values.subData,
        memoData : result[0],
      });
    });
  }).catch((err) => {
    res.render('ERROR', {
      err,
    });
  });
});

router.post('/saveMainTitle', (req, res) => {
  var fileId = req.session.file_id;
  var mainTitle = req.body.mainTitle;
  var saveTitle = 'UPDATE `main` SET `title` = ? WHERE `file_id` = ?';
  connection.query(saveTitle, [mainTitle, fileId]).then(() => {
    res.redirect('textEditer.ejs');
  });
});

router.post('/saveMain', (req, res) => {
  var title = req.body.title;
  var text = req.body.mainText;
  var saveText = 'INSERT INTO `main` (`title`, `body`) VALUES (?, ?)';
  connection.query(saveText, [title, text]).then(() => {
    res.render('textEditer.ejs', {
      isSaved : true,
    });
  });
});

module.exports = router;
