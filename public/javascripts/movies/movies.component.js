(function() {
    'use strict';

    angular.module('app').component('movies', {
        template: `<div>
                    <movie-add
                        button-name="{{'Add movie'}}"
                        state="$ctrl.state"
                        on-add="$ctrl.addMovie($event);">
                    </movie-add>
                    <movie-list 
                        name="{{'All movies'}}"
                        movies="$ctrl.movies" >
                    </movie-list>
                    <div ui-view></div>
                  </div>`,
        controller: function(moviesService) {
            var _this = this;

            this.getMovies = function() {
                moviesService.getMovies().then(function(movies) {
                    _this.movies = movies;
                })
                .catch(function(err) {
                    console.log(err);
                });
            };

            this.addMovie = function(event) {
                var movie = event && event.movieModel;

                moviesService.addMovie(movie).then(function(movie) {
                })
                .catch(function(err) {
                    console.log(err);
                });
            };

            this.$onInit = function() {
                this.movies = [];
                this.state = {
                    movieName: '',
                    movieAuthor: '',
                    movieRating: null
                };
                this.getMovies();
            };
        }
    })
    .component('movieList', {
        bindings: {
            movies: '<',
            name: '@?'
        },
        template: `<div>
                    <div>{{::$ctrl.name}}</div>
                    <div ng-repeat="movie in $ctrl.movies track by movie._id">
                        <a ui-sref="movies({id: movie._id })">
                            <span>Movie name: {{::movie.name}}</span>
                            <span>Movie author: {{::movie.author}}</span>
                            <span>Movie rating: {{::movie.rating}}</span>
                        </a>
                    </div>
                  </div>`
    })
    .component('movieAdd', {
        bindings: {
            state: '<',
            onAdd: '&',
            buttonName: '@'
        },
        template: `<form ng-submit="$ctrl.submit($event);">
                    <div class="form-group">
                        <label>
                            <input type="text" ng-model="$ctrl.state.movieName" />
                            type movie name
                        </label>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="text" ng-model="$ctrl.state.movieAuthor" />
                            type author name
                        </label>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="number" ng-model="$ctrl.state.movieRating" />
                            type rating
                        </label>
                    </div>
                    <button type="submit">{{::$ctrl.buttonName}}</button>
                  </form>`,
        controller: function() {
            this.submit = function(event) {
                event.preventDefault();

                this.onAdd({
                    $event: {
                        movieModel: {
                            name: this.state.movieName,
                            author: this.state.movieAuthor,
                            rating: this.state.movieRating
                        }
                    }
                });
            }
        }
    })
    .component('movie', {
        template: `<div>
                    Current Movie:
                    <div>Name: {{::$ctrl.currentMovie.name}}</div>
                    <div>Author: {{::$ctrl.currentMovie.author}}</div>
                    <div>Rating: {{::$ctrl.currentMovie.rating}}</div>
                  </div>`,
        controller: function($state, moviesService) {
            var _this = this;
            
            this.getMovie = function(movieId) {
                moviesService.getMovie(movieId).then(function(movie) {
                    _this.currentMovie = movie;
                })
                .catch(function(error) {
                    console.log(error);
                })
            };

            this.$onInit = function() {
                var params = $state.params;

                this.currentMovie = {};

                this.getMovie(params.id);
            };
        }
    })
})();