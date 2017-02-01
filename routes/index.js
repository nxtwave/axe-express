var express = require('express');
var router = express.Router();

var tests = require('../data/tests.json');

/* GET home page. */
router.get('/', function(req, res, next) {

  tests = tests.filter(function(item) {
    return (item.runtime !== undefined);
  });

  res.render('index', { title: 'Home', tests: tests });
});

module.exports = router;
