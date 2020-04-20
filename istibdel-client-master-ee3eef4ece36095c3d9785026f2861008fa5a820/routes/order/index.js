var express = require('express');
var router = express.Router();
var ParseUtils = require('../../utils/parse-util');

router.get('/', function(req, res, next) {
    ParseUtils.pagedResponse('demande', req, res, next);
});

router.post(['/:id', '/'], function(req, res, next) {
    var obj = req.body;
    ParseUtils.save('demande', obj, req, res, next);
});

router.get('/stats', function(req, res, next) {
    var obj = req.body;
    ParseUtils.getOrderStats(req, res, next);
});

module.exports = router;