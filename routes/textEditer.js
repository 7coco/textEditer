const express = require('express');
const connection = require('../mysqlConnection');
const fs = require('fs-promise');

const router = express.Router();

router.post('/submitMainId', (req, res) => {
  if(req.session.main_id) delete req.session.main_id;
  req.session.main_id = req.body.result;
  res.redirect('/textEditer');
});

router.get('/', (req, res) => {
  const mainId = req.session.main_id;
  (() => {
    const promise = new Promise((resolve) => {
      const selectMainData = 'SELECT * FROM `main` WHERE `id` = ?';
      connection.query(selectMainData, [mainId]).then((result) => {
        const values = {
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
    const promise = new Promise((resolve) => {
      const selectSubData = 'SELECT * FROM `sub` WHERE `main_id` = ?';
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
    const selectMemoData = 'SELECT * FROM `memo` WHERE `main_id` = ?';
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
  const mainId = req.session.main_id;
  const mainTitle = req.body.mainTitle;
  const saveTitle = 'UPDATE `main` SET `title` = ? WHERE `id` = ?';
  connection.query(saveTitle, [mainTitle, mainId]).then(() => {
    res.redirect('/textEditer');
  });
});

router.post('/saveMain', (req, res) => {
  const text = req.body.mainText;
  const mainId = req.session.main_id;
  const saveText = 'UPDATE `main` SET `body` = ? WHERE `id` = ?';
  connection.query(saveText, [text, mainId]).then(() => {
    res.redirect('/textEditer');
  });
});

router.post('/writeFile', (req, res) => {
  const text = req.body.result;
});

module.exports = router;
