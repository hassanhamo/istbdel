var express = require('express');
var router = express.Router();
var ParseUtils = require('../../utils/parse-util');

router.post('/', function (req, res, next) {
    ParseUtils.sendPush(req, res, next);
});

module.exports = router;
