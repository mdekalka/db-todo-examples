const fs = require('fs');
const htmlparser = require('htmlparser');
const request = require('request');
var path = require('path');

const configFileName = './rss.txt';
const filePath = path.join(__dirname, './rss.txt');

// Check if file exists
function checkForRSSFile() {
    fs.exists(filePath, function(exists) {
        if (!exists) {
            return next(new Error('Missing RSS File: ' + filePath ))
        }
        debugger
        next(null, filePath);
    });
}

// Read/syntax parsing
function readRSSFile(configFileName) {
    fs.readFile(configFileName, function(err, feedList) {
        if (err) {
            return next(err);
        }

        // transform to string and split in array
        feedList = feedList.toString()
                           .replace(/^\s+|\s+$/g, '')
                           .split('\n');

        var random = Math.random(Math.random() * feedList.length)
        next(null, feedList[random]);
    });
}

// HTTP request
function downloadRSSFeed(feedUrl) {
    request({uri: feedUrl}, function(err, res, body) {
        if (err) {
            return next(err);
        }

        if (res.statusCode !== 200) {
            return next(new Error('Abnormal response status code'))
        }

        next(null, body)
    })
}

function parseRSSFeed(rss) {
    var handler = new htmlparser.RssHandler();
    var parser = new htmlparser.Parser(handler);

    parser.parseComplete(rss);

    if (!handler.dom.items.length) {
        return next(new Error('NO RSS items found'))
    }

    var item = handler.dom.items.shift();

    console.log(item.title)
    console.log(item.link)
}

var tasks = [checkForRSSFile, readRSSFile, downloadRSSFeed, parseRSSFeed]

function next(err, result) {
    if (err) {
        throw err;
    }

    var currentTask = tasks.shift();

    if (currentTask) {
        currentTask(result);
    }
}

module.exports = next;