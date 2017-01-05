var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Images = new Schema({
    kind: {
        type: String,
        // only this types
        enum: ['thumbnail', 'detail'],
        // required
        required: true
    },
    url: {
        type: String,
        required: true
    }
});

var Article = new Schema({
    title: {
        type: String,
        required: true
    },
    images: [Images],
    modified: {
        type: Date,
        default: Date.now
    }
});

// validation function over title property in article schema
Article.path('title').validate(function(title) {
    return title.length > 5 && title.length < 100;
})

module.exports = mongoose.model('Article', Article);