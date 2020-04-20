var express = require('express');
var router = express.Router();
var Parse = require('parse/node');
var request = require('request');
var _ = require("lodash");



router.get('/', function(req, res, next) {
    console.log(req);
    res.json('ok');

});
router.post('/',  function(req, res, next) {
   

        var baseUrl = req.baseUrl;
        var body = JSON.parse(req.body)
        var method = body._method || 'POST';
        var data = {};
        _.each(body, function(v, k) {
            if (!k.startsWith("_")) {
                data[k] = v;
            }
        });


        request({
                method: method,
                url: Parse.serverURL+ baseUrl.substring(6),
                headers: {
                    'X-Parse-Application-Id': Parse.applicationId,
                    'X-Parse-Master-Key': Parse.masterKey
                },

                json: true,
                body: data
            }, function(error, response, body) {
                if (response) {
                    res.send(response.body);
                } else {
                    res.send(response);
                }
            
        })

/*  res.json(
     {"results":[{"objectId":"HJzSRxIiTp","name":"PS4","createdAt":"2017-10-15T12:16:48.241Z","updatedAt":"2017-11-22T16:12:48.409Z","isExchange":false,"images":["https://psmedia.playstation.com/is/image/psmedia/ps4-pro-two-column-buy-02-eu-06sep15?$TwoColumn_Image$","http://ksassets.timeincuk.net/wp/uploads/sites/54/2017/03/sony-ps4-pro-9-1.jpg"],"category":{"__type":"Pointer","className":"Category","objectId":"ScpNRgSvMP"},"author":{"__type":"Pointer","className":"_User","objectId":"eB5gHpEhZT"},"status":"جديد","viewCount":10,"categoryParent":{"__type":"Pointer","className":"Category","objectId":"qCbZAfzdFU"},"price":500,"location":{"__type":"GeoPoint","latitude":33.504104,"longitude":11.088149},"tags":["PS"]}]}
 ); */

});
module.exports = router;