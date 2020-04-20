var express = require('express');
var router = express.Router();
var Parse = require('parse/node');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
var _ = require('lodash');
var fs = require('fs');
var path = require('path');

router.post('/', upload.array('files'), function (req, res, next) {
    req.files
    _.each(req.files, function (uploadedFile) {

        var filePath = path.join(req.app.get('root-path'), uploadedFile.path);
        fs.readFile(filePath, function (err, data) {
            if (err) {
                res.status(500);
                res.json({ error: 'unknown error', code: err.code });
                return;
            }
            var file = new Parse.File("_file", Array.from(data));
            file.save().then(function (result) {
                
                try {
                    fs.unlinkSync(filePath);
                }
                catch (e) {  }
                res.json({ url: result._url });
            }, function (error) {
                try {
                    fs.unlinkSync(filePath);
                }
                catch (e) {  }
                res.status(500);
                res.json({ error: error.message, success: false });
            });
        });
    });
});

module.exports = router;
