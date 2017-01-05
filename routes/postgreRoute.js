const express = require('express');

const postgreQueries = require('../modules/postgre/postgre');

const router = express.Router();

// Get all users
router.route('/users').get(function(req, res, next) {
    postgreQueries.get(function(err, data) {
        if (err) {
            res.send(err);
        }

        res.json(data);
    });
    
});

// Add new user
router.route('/users').post(function(req, res, next) {
    const user = req.body.user;

    postgreQueries.add(user, function(err, data) {
        if (err) {
            res.send(err);
        }

        res.json(data);
    });
});

// Delete user
router.route('/users/:id').delete(function(req, res) {
    const id = req.params.id;

    postgreQueries.delete(id,function(err, id) {
        if (err) {
            res.send(err);
        }

        res.json(id);
    });

});

// Update existing user
router.route('/users/:id').put(function(req, res) {
    const id = req.params.id;
    const user = req.body.user;

    postgreQueries.update(id, user, function(err, data) {
        if (err) {
            res.send(err);
        }

        res.json(data);
    });
});

module.exports = router;