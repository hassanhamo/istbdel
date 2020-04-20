var express = require('express');
var router = express.Router();
var ParseUtils = require('../../utils/parse-util');

router.get('/', function (req, res, next) {
    ParseUtils.pagedResponse('Categories', req, res, next);
});

router.post(['/:id', '/'], function (req, res, next) {
    var obj = req.body;
    ParseUtils.save('Categories', obj, req, res, next);
});

module.exports = router;
