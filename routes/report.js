var express = require('express');
var router = express.Router();

router.get('/:id', function(req, res, next) {
  var id = req.params.id;
  var results = require('../reports/results-' + id + '.json');
  res.render('report', {title: 'Report', results: results});
});

module.exports = router;

