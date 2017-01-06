const express = require('express');
const http = require('http');
const mysql = require('mysql');
const router = express.Router();

let connection;
    
connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '', // pass
    database: 'timetrack'
});

// connection.connect();

connection.query(
    "CREATE TABLE IF NOT EXISTS users ("
    + "_id INT(10) NOT NULL AUTO_INCREMENT, "
    + "name VARCHAR(50), "
    + "age INT(10), "
    + "PRIMARY KEY(_id))",
    function(err) {
        if (err) throw err;

        console.log('mysql server started')
    }
);

router.route('/users').get(function(req, res) {
    connection.query("SELECT * FROM users", (err, rows) => {
        if (err) {
            res.send(err);
        }

        res.json(rows);
    });
});

router.route('/users').post(function(req, res) {
    const user = req.body.user;

    connection.query(
        "INSERT INTO users (name, age) " +
        " VALUES (?, ?)",
        [user.name, user.age],
        (err) => {
            if (err)  {
                return res.send(err);
            }

            connection.query(
                "SELECT * FROM users WHERE _id=LAST_INSERT_ID()",
                (err, row) => {
                    if (err) {
                        res.send(err)
                    }

                    res.json(row[0]);
                }
            )
        }
    )
});

router.route('/users/:id').put(function(req, res) {
    const user = req.body.user;
    const id = req.params.id;
    
    connection.query(
        "UPDATE users SET name=? WHERE _id=?",
        [user.name, id],
        (err) => {
            console.log(err, 'ERROR')
            if (err)  {
                return res.send(err);
            }

            connection.query(
                "SELECT * FROM users WHERE _id=?",
                [id],
                (err, row) => {
                    if (err)  {
                        res.send(err);
                    }

                    res.json(row);
                }
            );
        }
    );
});


router.route('/users/:id').get(function(req, res) {
    const id = req.params.id;

    connection.query(
        "SELECT * FROM users WHERE _id=?",
        [id],
        (err, row) => {
            if (err)  {
                res.send(err);
            }

            res.json(row[0]);
        }
    );
});

router.route('/users/:id').delete(function(req, res) {
    const id = req.params.id;

    connection.query(
        "DELETE FROM users WHERE _id=?",
        [id],
        err => {
            if (err)  {
                res.send(err);
            }

            res.json(parseInt(id, 10));
        }
    );
});

module.exports = router;