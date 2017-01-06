const express = require('express');
const pg = require('pg');

// db/name/surname/server/dbname
const conString = "postgres://postgres@localhost:5432/test";
const client = new pg.Client(conString);
const router = express.Router();

client.connect(function(err, connection) {
    if (err) {
        return console.error('error fetching client from pool', err)
    }
    console.log('postgre connected')
});

// Get all users
router.route('/users').get(function(req, res) {
    const query = client.query('SELECT * FROM users');

    query.on('row', function(row, result) {
        result.addRow(row);
    });

    query.on('end', function(result) {

        res.json(result.rows)
    });
});

// Get user by id
router.route('/users/:id').get(function(req, res) {
    const id = req.params.id;
    const query = client.query('SELECT * FROM users WHERE _id=($1)', [id]);

    query.on('row', function(row, result) {
        result.addRow(row);
    });

    query.on('end', function(result) {
        res.json(result.rows[0])
    });
});

// Add new user
router.route('/users').post(function(req, res) {
    const user = req.body.user;

    const userData = [user.name, user.age];

    client.query("INSERT INTO users(name, age) values($1, $2) RETURNING *", userData, function(err, result) {
        if (err) {
            return res.send(err);
        }
        
        res.json(result.rows[0]);
    });
});

// Delete user
router.route('/users/:id').delete(function(req, res) {
    const id = req.params.id;

    client.query("DELETE FROM users WHERE _id=($1)", [id]);
    
    const query = client.query("SELECT * FROM users WHERE _id=($1)", [id]);

    query.on('row', (row, result) => {
        result.addRow(row);
    });

    query.on('end', (result) => {
        res.json(parseInt(id, 10));
    });
});

// Update existing user
router.route('/users/:id').put(function(req, res) {
    const user = req.body.user;
    const id = req.params.id;

    client.query("UPDATE users SET name=($1), age=($2) WHERE _id=($3) RETURNING *", [user.name, user.age, id], function(err, result) {
        if (err) {
            return res.send(err);
        }

        const query = client.query("SELECT * FROM users WHERE _id=($1)", [id]);

        query.on('row', (row, result) => {
            result.addRow(row);
        });

        query.on('end', (result) => {
            res.json(result.rows[0]);
        });
    });
});

module.exports = router;