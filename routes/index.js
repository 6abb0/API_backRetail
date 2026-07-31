const express = require('express');
const router = express.Router();

/* GET / - Health Check */
router.get('/', function(req, res, next) {
  res.json({
    status: 'online',
    message: 'API REST lista y respondiendo'
  });
});

module.exports = router;