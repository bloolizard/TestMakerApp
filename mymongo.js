var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

console.log('Connection to MongoDB');

var TestModel = mongoose.model('Test', {
    test_name: String,
    questions: []
});


router.get('/', function(req, res){

});

router.post('/', function(req, res){
    (new TestModel(req.body)).save(function(err, results){
        if (err){
            console.log(err);
            res.status(500).json({details: results});
        }
        else {
            console.log(results);
            res.status(200).json(results);
        }
    });
});

router.put('/:id', function(req, res){
    var question = req.body;
    TestModel.where({ _id: req.params.id }).update({
            $push: {questions: question}},
        function(err, results){
            if (err){
                console.log(err);
                res.status(500).json({details: results});
            }
            else {
                console.log(results);
                res.status(200).json({details: results});
            }
        });
});



module.exports = router;