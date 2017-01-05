const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MovieSchema = new Schema({
    name: String,
    author: String,
    rating: Number
});

module.exports = mongoose.model('Movie', MovieSchema);