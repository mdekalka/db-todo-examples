const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const dbName = 'nodeTest';
const connectionConfig = `mongodb://localhost:27017/${dbName}`;

mongoose.connect(connectionConfig);
const db = mongoose.connection;

db.on('error', function() {
    console.log('mongo connection error');
});

db.once('open', function() {
    console.log('mongo connection established')
});

const User = require('../models/mongoModel');


router.route('/users').get(function(req, res) {
    User.find(function(err, users) {
        if (err) {
            return res.send(err);
        }

        return res.json(users);
    });
});

router.route('/users').post(function(req, res) {
    var user = new User(req.body.user);

    user.save(function(err, savedUser) {
        if (err) {
            return res.send(err);
        }

        res.send(savedUser);
    });
});

router.route('/users/:id').put(function(req, res) {
    // User.findOne({
    //     _id: req.params.id
    // }, function(err, user) {
    //     if (err) {
    //         return res.send(err);
    //     }

    //     for (const prop in req.body) {
    //         user[prop] = req.body.user[props];
    //     }

    //     user.save(function(err, savedUser) {
    //         if (err) {
    //             return res.send(err);
    //         }

    //         res.send(savedUser);
    //     });
    // });

    const id = req.params.id;
    
    User.update({ _id: id }, req.body.user, { multi: false }, (err) => {
        if (err)  {
            return res.send(err);
        }

        User.findOne({ _id: id }, (err, user) => {
            if (err) {
                return res.send(err);
            }

            res.json(user);
        });
    });
});


router.route('/users/:id').get(function(req, res) {
    User.findOne({
        _id: req.params.id
    }, function(err, user) {
        if (err) {
            return res.send(err);
        }

        res.json(user);
    });
});

router.route('/users/:id').delete(function(req, res) {
    const id = req.params.id;

    User.remove({
        _id: id
    }, function(err) {
        if (err) {
            return res.send(err);
        }

        res.json(id);
    });
});

module.exports = router;
