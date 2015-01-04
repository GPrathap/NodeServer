var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/userlist', function(req, res) {
    
    req.db.collection('userlist').find().toArray(function (err, items) {
        res.json(items);
    });
});
router.get('/userlist/orderlist', function(req, res) {
    
    req.db.collection('userlist').find().toArray(function (err, items) {
        res.json(items);
    });
});
router.post('/adduser', function(req, res) {
   /* var db = req.db;
    db.collection('userlist').insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: 'User was added' } : { msg: err }
        );
    });*/

    console.log(req.body.action);
    res.send({ msg: 'User was added'});
});
router.delete('/deleteuser/:id', function(req, res) {
    var db = req.db;
    var userToDelete = req.params.id;
    console.log(userToDelete);
    db.collection('userlist').remove({_id : userToDelete}, function(err, result) {
        res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
