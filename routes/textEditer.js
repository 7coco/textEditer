const express = require('express');
const connection = require('../mysqlConnection');
const fs = require('fs-promise');

const router = express.Router();

function doSelectMainData(req, res){
  const mainId = req.session.main_id;
  const promise = new Promise((resolve) => {
    const selectMainData = 'SELECT * FROM `main` WHERE `id` = ?';
    connection.query(selectMainData, [mainId]).then((result) => {
      const values = {
        req,
        res,
        mainId,
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
}

function doSelectSubData(values){
  const promise = new Promise((resolve) => {
    const selectSubData = 'SELECT * FROM `sub` WHERE `main_id` = ?';
    connection.query(selectSubData, [values.mainId]).then((result) => {
      values.subData = result[0];
      resolve(values);
    }, (err) => {
      values.res.render('ERROR', {
        err,
      });
    });
  });
  return promise;
}

function doSelectMemoData(values){
  const promise = new Promise((resolve) => {
    const selectMemoData = 'SELECT * FROM `memo` WHERE `main_id` = ?';
    connection.query(selectMemoData, [values.mainId]).then((result) => {
      values.memoData = result[0];
      resolve(values);
    }, (err) => {
      values.res.render('ERROR', { err });
    });
  });
  return promise;
}

router.post('/submitMainId', (req, res) => {
  if(req.session.main_id) delete req.session.main_id;
  req.session.main_id = req.body.result;
  res.redirect('/textEditer');
});

router.get('/', (req, res) => {
  doSelectMainData(req, res)
  .then(doSelectSubData)
  .then(doSelectMemoData)
  .then((values) => {
    res.render('textEditer', {
      mainData : values.mainData,
      subData : values.subData,
      memoData : values.memoData,
    });
  }).catch((err) => {
    res.render('ERROR', { err });
  });
});

router.post('/saveMainTitle', (req, res) => {
  const mainId = req.body.mainId;
  const mainTitle = req.body.mainTitle;
  const saveTitle = 'UPDATE `main` SET `title` = ? WHERE `id` = ?';
  connection.query(saveTitle, [mainTitle, mainId]).then(() => {
    res.redirect('/textEditer');
  });
});

router.post('/saveMain', (req, res) => {
  const text = req.body.mainText;
  const mainId = req.body.mainId;
  const saveText = 'UPDATE `main` SET `body` = ? WHERE `id` = ?';
  req.session.main_id = mainId;
  connection.query(saveText, [text, mainId]).then(() => {
    res.redirect('/textEditer');
  });
});

router.post('/writeFile', (req, res) => {
  const textFileName = req.body.textFileName;
  const filePath = req.body.filePath;
  const mainText = req.body.mainText;
  fs.writeFile('../../../../' + filePath + textFileName, mainText)
  .then(() => {
    doSelectMainData(req, res)
    .then(doSelectSubData)
    .then(doSelectMemoData)
    .then((values) => {
      res.render('textEditer', {
        mainData : values.mainData,
        subData : values.subData,
        memoData : values.memoData,
        successWriteFile : '本文を' + filePath + 'の' + textFileName + 'へ書き込みました！',
      });
    });
  }).catch((err) => {
    res.render('ERROR', { err });
  });
});

router.post('/appendFile', (req, res) => {
  const textFileName = req.body.textFileName;
  const filePath = req.body.filePath;
  const mainText = req.body.mainText;
  fs.appendFile('../../../../' + filePath + textFileName, mainText)
  .then(() => {
    doSelectMainData(req, res)
    .then(doSelectSubData)
    .then(doSelectMemoData)
    .then((values) => {
      res.render('textEditer', {
        mainData : values.mainData,
        memoData : values.memoData,
        subData : values.subData,
        successWriteFile : '本文を' + filePath + 'の' + textFileName + 'へ書き込みました！',
      });
    }).catch((err) => {
      res.render('textEditer', { err });
    });
  }).catch((err) => {
    res.render('textEditer', { err });
  });
});

router.post('/deleteFile', (req, res) => {
  const mainId = req.body.mainId;
  (() => new Promise((resolve) => {
    const deleteMainData = 'DELETE FROM `main` WHERE `id` = ?';
    connection.query(deleteMainData, [mainId]).then(() => {
      resolve();
    }, (err) => {
      res.render('ERROR', { err });
    });
  }))().then(() => {
    const deleteSubAndMemoData = 'DELETE FROM `sub`, `memo` WHERE `main_id` = ?';
    connection.query(deleteSubAndMemoData, [mainId]).then(() => {
      res.redirect('/openFile');
    }, () => {
      res.redirect('/openFile');
    });
  });
});

module.exports = router;
