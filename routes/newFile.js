const express = require('express');
const connection = require('../mysqlConnection');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('newFile.ejs');
});

router.post('/', (req, res) => {
  const fileName = req.body.fileName;
  (() => {
    const promise = new Promise((resolve, reject) => {
      const createNewFile = 'INSERT INTO `main` (`name`, `title`) VALUES (?, ?)';
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
