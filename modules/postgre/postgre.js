const pg = require('pg');

// db/name/surname/server/dbname
const conString = "postgres://postgres@localhost:5432/test";
const client = new pg.Client(conString);

client.connect(function(err, connection) {
    if (err) {
        return console.error('error fetching client from pool', err)
    }
    console.log('POSTGRE CONNECTED')
});


const queries = {
    get(callback) {
        const query = client.query('SELECT * FROM users');

        query.on('row', function(row, result) {
            result.addRow(row);
        });

        query.on('end', function(result) {
            // client.end();

            callback(null, result.rows);
        });
    },

    add(user, callback) {
        const userData = [user.name, user.age, user.completed];

        client.query("INSERT INTO users(name, age, completed) values($1, $2, $3) RETURNING *", userData, function(err, result) {
            if (err) {
                callback(err);
                return;
            }
            callback(err, result.rows[0])
        });
    },

    delete(id, callback) {
       client.query("DELETE FROM users WHERE id=($1)", [id]);
       
       const query = client.query("SELECT * FROM users WHERE id=($1)", [id]);

       query.on('row', (row, result) => {
            result.addRow(row);
       });

       query.on('end', (result) => {
            callback(null, result.rows[0]);
       });
    },

    update(id, data, callback) {
        client.query("UPDATE users SET name=($1), age=($2), completed=($3) WHERE id=($4)", [data.name, data.age, data.completed, id], function(err) {
            if (err) {
                callback(null);
                return;
            }

            callback(null, id);
        });
    }

};

// const data = [
//     {name: 'Aleh', age: 26, completed: false},
//     {name: 'Pasha', age: 19, completed: false},
//     {name: 'Anna', age: 23, completed: false},
//     {name: 'CARL', age: 30, completed: false}
// ];

// CREATE
// client.query("CREATE TABLE IF NOT EXISTS emps(firstname varchar(64), lastname varchar(64))");

// INSERT
// client.query({
//     name: 'insert new user',
//     text: "INSERT INTO users(id, age, name) values($1, $2, $3)",
//     values: [0, 26, "Aleh"]
// });
// SELECT
// var query = client.query("SELECT * FROM users");

// ITERATION
// query.on('row', function(row) {
//     console.log(row);
// });

// //fired after last row is emitted
// query.on('end', function() {
//     client.end();
// });


// DELETE
// var query = client.query("DELETE FROM users");


// function insert(data) {
//     if (!data) {
//         return;
//     }

//     data.forEach(item => {
//         client.query({
//             name: 'insert new user',
//             text: "INSERT INTO users(name, age, completed) values($1, $2, $3)",
//             values: [item.name, item.age, item.completed]
//         });
//     })
// }
// insert(data)

// const query = client.query('SELECT * FROM users');
// query.on('row', function(row, result) {
//     result.addRow(row);
// });

// query.on('end', function(result) {
//     console.log(JSON.stringify(result.rows, null, "    "));
//     client.end();
// });





module.exports = queries;