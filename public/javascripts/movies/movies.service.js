(function() {
    'use strict';

    angular.module('app').service('moviesService', function($http, $q) {
        var _this = this;
        var movieConfig = Object.freeze({
            routes: {
                movies: '/api/movies'
            },
            states: {
                OK: 'OK'
            }
        });

        this.movies = [];

        this.getMovies = function() {
            var movieUrl = movieConfig.routes.movies;

            return $http.get(movieUrl).then(function(response) {
                if (response.data) {
                    _this.movies = response.data;
                }
                
                return _this.movies;
            })
            .catch(function(err) {
                return $q.reject({error: true, message: 'FAILED'});
            });
        };

        this.getMovie = function(movieId) {
            var movieUrl = `${movieConfig.routes.movies}/${movieId}`;

            return $http.get(movieUrl).then(function(response) {
                if (response.data) {
                    return response.data;
                }
            })
            .catch(function(err) {
                return $q.reject({error: true, message: 'FAILED'});
            });
        };

        this.addMovie = function(movie) {
            var movieUrl = movieConfig.routes.movies;
            var movieStates = movieConfig.states;

            return $http.post(movieUrl, {movie: movie}).then(function(response) {
                if (response.data) {
                    if (response.data.state === movieStates.OK) {
                        _this.movies.push(response.data.movie);
                       
                        return { error: false, message: 'OK' };
                    }
                }
            })
            .catch(function(err) {
                return $q.reject({error: true, message: 'FAILED'});
            });
        }
    });

})();