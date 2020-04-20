var express = require('express');
var router = express.Router();
var Parse = require('parse/node');

var resources = [
    'User','Installation', 'Annonce'
];


module.exports = function(app) {
   
    resources.forEach(function(r) {
        app.use('/api/' + r, require('../routes/' + r));
    });
};