var express = require('express');
var router = express.Router();
var Parse = require('parse/node');

router.delete('/:entity/:id', function (req, res, next) {
    var entityName = req.params.entity;
    if (entityName === 'media') {
        entityName = 'Imagye';
    }
    else if (entityName === 'region') {
        entityName = 'RegionName';
    }
    else if (entityName === 'region-type') {
        entityName = 'RegionType';
    }

    entityName = entityName[0].toUpperCase() + entityName.substring(1);

    var obj = new Parse.Object(entityName);
    obj.id = req.params.id;

    obj.destroy({
        success: function (myObject) {
            res.json({ success: true });
        },
        error: function (error) {
            res.json({ success: false, error: error.message });
        }
    });
});
module.exports = router;
