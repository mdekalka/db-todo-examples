// consistent function run with nimble
var flow = require('nimble');

function start() {
    flow.series([
    function(callback) {
        setTimeout(() => {
        console.log('first');
        callback();
        }, 1000)
    },
    function(callback) {
        setTimeout(() => {
        console.log('second');
        callback();
        }, 500)  
    },
    function(callback) {
        setTimeout(() => {
        console.log('third');
        callback();
        }, 100)  
    }
    ])
}


module.exports  = start;