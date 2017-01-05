const express = require('express');
const router = express.Router();

const Movie = require('../models/movieModel');


router.route('/movies').get(function(req, res) {
    Movie.find(function(err, movies) {
        if (err) {
            return res.send(err);
        }

        return res.json(movies);
    });
});

router.route('/movies').post(function(req, res) {
    var movie = new Movie(req.body.movie);

    movie.save(function(err, movie) {
        if (err) {
            return req.send(err);
        }

        res.send({
            movie: movie,
            state: 'OK', 
            message: 'Movie Added',
            time: new Date()
        });
    });
});

router.route('/movies/:id').put(function(req, res) {
    Movie.findOne({
        _id: req.params.id
    }, function(err, movie) {
        if (err) {
            return req.send(err);
        }

        for (const prop in req.body) {
            movie[prop] = req.body[props];
        }

        movie.save(function(err) {
            if (err) {
                return res.send(err);
            }

            res.send({message: 'Movie updated'});
        });
    })
});


router.route('/movies/:id').get(function(req, res) {
    Movie.findOne({
        _id: req.params.id
    }, function(err, movie) {
        if (err) {
            return req.send(err);
        }

        res.json(movie);
    });
});

router.route('/movies/:id').delete(function(req, res) {
    Movie.remove({
        _id: req.params.id
    }, function(err, movie) {
        if (err) {
            return req.send(err);
        }

        res.json({message: 'Successfully deleted'});
    });
});

module.exports = router;
