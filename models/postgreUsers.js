const pg = require('pg');
const promise = require('bluebird');

const options = {
  // Initialization Options
  promiseLib: promise
};
const pgPromise = require('pg-promise')(options);
const conString = process.env.DATABASE_URL || "postgres://postgres@localhost:5432/test";
const db = pgPromise(conString);


// const userQueries = {
//     getUsers(callback) {
//         callback = callback || function() {};
//         const results = [];
//         // Get a Postgres client from the connection pool
//         pg.connect(conString, (err, client, done) => {
//            // Handle connection errors
//            if (err) {
//                 done();
//                 callback(err);
//                 return;
//             }
//             // SQL Query 
//             const query = client.query('SELECT * FROM users');
//             // Stream results back one row at a time
//             query.on('row', function(row, result) {
//                 // result.addRow(row);
//                 results.push(row);
//             });
//             // After all data is returned, close connection and return results
//             query.on('end', function(/*result*/) {
//                 done();
//                 // callback(null, result.rows);
//                 callback(null, results);
//             });
//         });
//     },

//     getUserById(id, callback) {
//         callback = callback || function() {};
//         const results = [];

//         pg.connect(conString, (err, client, done) => {
//             if (err) {
//                 done();
//                 callback(err);
//                 return;
//             }

//             const query = client.query('SELECT * FROM users WHERE _id=($1)', [id]);

//             query.on('row', function(row, result) {
//                 results.push(row);
//             });

//             query.on('end', function() {
//                 done();
//                 callback(null, results[0]);
//             });
//         });
//     },

//     addUserById(user, callback) {
//         callback = callback || function() {};
//         const userData = [user.name, user.age];

//         pg.connect(conString, (err, client, done) => {
//             if (err) {
//                 done();
//                 callback(err);
//                 return;
//             }

//             client.query("INSERT INTO users(name, age) values($1, $2) RETURNING *", userData, function(err, result) {
//                 if (err) {
//                     done();
//                     callback(err);
//                     return;
//                 }

//                 done();
//                 callback(null, result.rows[0]);
//             });
//         });
//     },

//     deleteUserById(id, callback) {
//         callback = callback || function() {};
//         const results = [];

//         pg.connect(conString, (err, client, done) => {
//              if (err) {
//                 done();
//                 callback(err);
//                 return;
//             }

//             client.query("DELETE FROM users WHERE _id=($1)", [id]);
        
//             const query = client.query("SELECT * FROM users WHERE _id=($1)", [id]);

//             query.on('row', (row) => {
//                 results.push(row);
//             });

//             query.on('end', () => {
//                 done();
//                 callback(null, id);
//             });
//         });
//     },

//     updateUserById(id, user, callback) {
//         callback = callback || function() {};
//         const results = [];
//         const userData = [user.name, user.age, id];

//         pg.connect(conString, (err, client, done) => {
//             client.query("UPDATE users SET name=($1), age=($2) WHERE _id=($3) RETURNING *", userData, function(err) {
//                 if (err) {
//                     done();
//                     callback(err);
//                     return;
//                 }

//                 const query = client.query("SELECT * FROM users WHERE _id=($1)", [id]);

//                 query.on('row', (row) => {
//                     results.push(row);
//                 });

//                 query.on('end', (result) => {
//                     done();
//                     callback(null, results[0]);
//                 });
//             });
//         });
//     }
// };

// Another version that uses pg-promise/bluebird
const userQueries = {
    getUsers(callback) {
        callback = callback || function() {};

        db.any('SELECT * FROM users')
            .then(users => {
                callback(null, users);
            })
            .catch(err => {
                callback(err);
            });
    },

    getUserById(id, callback) {
        callback = callback || function() {};

        db.one('SELECT * FROM users WHERE _id=($1)', id)
            .then(user => {
                callback(null, user);
            })
            .catch(err => {
                callback(err);
            });
    },

    addUserById(user, callback) {
        callback = callback || function() {};
        const userData = [user.name, user.age];

        db.one('INSERT INTO users(name, age) values($1, $2) RETURNING *', userData)
            .then(user => {
                callback(null, user);
            })
            .catch(err => {
                callback(err);
            });
    },

    deleteUserById(id, callback) {
        callback = callback || function() {};
        const results = [];

        db.none('DELETE FROM users WHERE _id=($1)', id)
            .then(() => {
                callback(null, id);
            })
            .catch(err => {
                callback(err);
            });
    },

    updateUserById(id, user, callback) {
        callback = callback || function() {};
        const results = [];
        const userData = [user.name, user.age, id];

        db.result('UPDATE users SET name=($1), age=($2) WHERE _id=($3) RETURNING *', userData)
            .then((data) => {
                callback(null, data.rows[0]);
            })
            .catch(err => {
                callback(err);
            });
    }
};

module.exports = userQueries;