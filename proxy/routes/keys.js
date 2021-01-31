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

/* GET keys listing. */
router.get('/', function(req, res, next) {
  const userId = req.cookies.user_id;

  if (!userId) {
    return res.status(401).send();
  }

  const data = {
    keys: null,
    requests: {}
  };

  pool.query('SELECT * FROM keys WHERE user_id = $1', [req.cookies.user_id], (err, results) => {
    if (err) {
      throw err;
    }

    data.keys = results.rows;

    data.keys.forEach((row) => {
      data.requests[row.id] = [];
    });

    pool.query('SELECT * FROM requests', [], (errTwo, resultsTwo) => {
      if (errTwo) {
        throw errTwo;
      }

      resultsTwo.rows.forEach(function(row) {
        if (data.requests[row.key_id]) {
          data.requests[row.key_id].push(row);
        }
      });

      res.status(200).send(data);
    });
  });
});

/* POST create key */
router.post('/', function(req, res, next) {
  const userId = req.cookies.user_id;

  if (!userId) {
    return res.status(401).send();
  }

  pool.query('INSERT INTO keys (value, user_id) VALUES ($1, $2)', [req.body.apiKey, req.cookies.user_id], (err, results) => {
    if (err) {
      throw err;
    }
    
    res.status(200).send(results.rows[0]);
  });
});

/* PUT disable key */
router.put('/disable', function(req, res, next) {
  const userId = req.cookies.user_id;

  if (!userId) {
    return res.status(401).send();
  }

  pool.query('UPDATE keys SET enabled = $1 WHERE value = $2', [false, req.body.apiKey], (err, results) => {
    if (err) {
      throw err;
    }

    res.status(200).send();
  });
});

/* POST validate key */
router.post('/validate', function(req, res, next) {
  const key = req.get('API-KEY');

  pool.query('SELECT * FROM keys WHERE value = $1 AND enabled = $2', [key, true], (err, results) => {
    if (err || results.rows.length < 1) {
      return res.send(401);
    }

    const { id } = results.rows[0];
    const requestUri = req.get('X-Original-URI');

    pool.query('INSERT INTO requests (key_id, location) VALUES ($1, $2)', [id, requestUri], (errTwo, resultsTwo) => {
      if (errTwo) {
        return res.send(401);
      }

      res.send(200);
    });
  });
});

module.exports = router;
