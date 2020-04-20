var express = require('express');
var router = express.Router();
var ParseUtils = require('../../utils/parse-util');
var _ = require('lodash');

router.get('/stats', function (req, res, next) {
    ParseUtils.getInstallationStats(req, res, next);
});

router.get('/:year', function (req, res, next) {
    ParseUtils.getChartData('_Installation', parseInt(req.params.year, 10), req, res, next);
});

module.exports = router;
