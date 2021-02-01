const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Pool = require('pg').Pool;

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT
});

/* POST login. */
router.post('/login', function(req, res, next) {
  pool.query('SELECT * FROM users WHERE email = $1', [req.body.email], (err, results) => {
    if (err) {
      return res.status(500).send();
    }

    if (results.rows.length === 0) {
      return res.status(404).send();
    }

    bcrypt.compare(req.body.password, results.rows[0].password_digest)
    .then((response) => {
      if (response) {
        res.cookie('user_id', results.rows[0].id, { httpOnly: false, path: '/' });
        return res.status(200).send();
      }
        
      return res.status(401).send();
    })
    .catch((error) => {
      return res.json(error);
    });
  }); 
});

/* POST register */
router.post('/register', function(req, res, next) {
  pool.query('SELECT * FROM users WHERE email = $1', [req.body.email], (err, results) => {
    if (err) {
      return res.status(500).send();
    }

    if (results.rows.length > 0) {
      return res.status(401).send();
    }

    bcrypt.hash(req.body.password, 10).then((hash) => {
      pool.query('INSERT INTO users(email, password_digest) VALUES ($1, $2)', [req.body.email, hash], (error, resultsTwo) => {
        if (err) {
          return res.status(500).send();
        }

        pool.query('SELECT * FROM users WHERE email = $1', [req.body.email], (errThree, resultsThree) => {
          if (errThree) {
            return res.status(500).send();
          }

          res.cookie('user_id', resultsThree.rows[0].id, { httpOnly: false, path: '/' });
          return res.status(200).send();
        });
      });
    });
  });
});

/* DELETE logout */
router.delete('/logout', function(req, res, next) {
  res.cookie('user_id', '', { expires: new Date(0) });
  return res.status(200).send();
});

module.exports = router;
