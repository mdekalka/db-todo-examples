const express = require('express');
const pg = require('pg');
const userQueries = require('../models/postgreUsers');

// db/name/surname/server/dbname
const conString = process.env.DATABASE_URL || "postgres://postgres@localhost:5432/test";
const client = new pg.Client(conString);
const router = express.Router();

// http://mherman.org/blog/2015/02/12/postgresql-and-nodejs/#.WG5O0fl96Uk
// http://mherman.org/blog/2016/03/13/designing-a-restful-api-with-node-and-postgres/#.WHNPafl96Uk
pg.connect(conString, (err, client, done) => {
    const query = client.query(
    'CREATE TABLE IF NOT EXISTS users(_id SERIAL PRIMARY KEY, name VARCHAR(40) not null, age INT not null)');

    query.on('end', () => {
        done();
    });
});

// Get all users
router.route('/users').get(function(req, res) {
    userQueries.getUsers((err, users) => {
        if (err) {
            res.status(500).json({ error: true, data: err });
        }

        res.json(users);
    });
});

// Get user by id
router.route('/users/:id').get(function(req, res) {
    const id = req.params.id;

    userQueries.getUserById(id, (err, user) => {
        if (err) {
            res.status(500).json({ error: true, data: err });
        }

        res.json(user);
    });
});

// Add new user
router.route('/users').post(function(req, res) {
    const user = req.body.user;

    userQueries.addUserById(user, (err, user) => {
        if (err) {
            res.status(500).json({ error: true, data: err });
        }

        res.json(user);
    });
});

// Delete user
router.route('/users/:id').delete(function(req, res) {
    const id = req.params.id;

    userQueries.deleteUserById(id, (err, id) => {
        if (err) {
            res.status(500).json({ error: true, data: err });
        }

        res.json(parseInt(id, 10));
    });
});

// Update existing user
router.route('/users/:id').put(function(req, res) {
    const user = req.body.user;
    const id = req.params.id;

    userQueries.updateUserById(id, user, (err, user) => {
        if (err) {
            res.status(500).json({ error: true, data: err });
        }

        res.json(user);
    });
});

module.exports = router;