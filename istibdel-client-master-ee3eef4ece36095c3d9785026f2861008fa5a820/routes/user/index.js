var express = require('express');
var router = express.Router();
var ParseUtils = require('../../utils/parse-util');

router.get('/', function (req, res, next) {
    ParseUtils.pagedResponse('User', req, res, next);
});

router.get('/stats', function (req, res, next) {
    ParseUtils.getUserStats(req, res, next);
});

router.get('/most-active-dealers', function (req, res, next) {
    ParseUtils.getMostActiveDealer(req, res, next);
});

router.get('/:userId', function (req, res, next) {
    ParseUtils.getById('User', req.params.userId, req, res, next);
});

router.post('/:userId/activate/', function (req, res, next) {
    ParseUtils.activateUser(req, res, next);
});

module.exports = router;
