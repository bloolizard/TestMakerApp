var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

console.log('Connection to MongoDB');

router.get('/', function(req, res){
    console.log('Testing');
});

module.exports = router;