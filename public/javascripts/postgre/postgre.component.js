(function() {
    'use strict';

    angular.module('app').component('postgre', {
        template: `<div>
                    <div>
                        <h2>Add new user</h2>
                        <form ng-submit="$ctrl.addUser($event);">
                            <label>Name</label>
                            <input type="text" id="name" ng-model="$ctrl.state.user.name" />
                            <label>Age</label>
                            <input type="number" id="age" ng-model="$ctrl.state.user.age"/>
                            <button type="submit">Add new user</button>
                        </form>
                    </div>
                    <div>
                        <h2>Users list</h2>
                        <div ng-repeat="user in $ctrl.users track by user.id">
                            <input type="text" ng-model="user.name" />
                            <button ng-click="$ctrl.update(user);">update</button>
                            <button ng-click="$ctrl.remove(user);">remove</button>
                        </div>
                    </div>
                  </div>`,
        controller: function(postgreService) {
            var _this = this;

            this.loadUsers = function() {
                postgreService.loadUsers().then(function(users) {
                    _this.users = users;
                }).catch(function(err) {
                    console.log(err);
                });
            };

            this.remove = function(user) {
                postgreService.removeUser(user.id).then(function(id) {

                    var index = _this.users.map(item => {
                        return item.id;
                    }).indexOf(id);

                    _this.users.splice(index, 1);
                }).catch(function(err) {
                    console.log(err);
                });
            };

            this.update = function(user) {
                const updatedUser = {
                    name: user.name,
                    age: user.age,
                    completed: false
                };

                postgreService.updateUser(user.id, updatedUser).then(function(user) {
                    var update = _this.users.find(item => {
                        return item.id === user.id;
                    })

                    if (update) {
                        angular.extend(update, user);
                    }
                })
                .catch(function(err) {
                    console.log(err);
                });
            };

            this.addUser = function(event) {
                event.preventDefault();

                const user = {
                    name: this.state.user.name,
                    age: this.state.user.age,
                    completed: false
                };

                postgreService.addUser(user).then(function(user) {
                    _this.users.push(user);
                })
                .catch(function(err) {
                    console.log(err);
                });

                this.state.user = {};
            };

            this.$onInit = function() {
                this.state = {
                    user: {
                        name: '',
                        age: ''
                    }
                }
                this.users = [];

                this.loadUsers();

            };
        }
    }).service('postgreService', function($http, $q) {
        const url = '/postgre/users';

        this.loadUsers = function() {
            return $http.get(url).then(function(response) {
                return response.data
            })
            .catch(function(err) {
                return $q.reject(err);
            });
        };

        this.removeUser = function(id) {
            var removeUrl = `${url}/${id}`;

            return $http.delete(removeUrl).then(function(response) {
                return response.data;
            })
            .catch(function(err) {
                return $q.reject(err);
            });
        };

        this.updateUser = function(id, user) {
            var removeUrl = `${url}/${id}`;

            return $http.put(removeUrl, { user: user }).then(function(response) {
                return response.data;
            })
            .catch(function(err) {
                return $q.reject(err);
            });
        };

        this.addUser = function(user) {
            return $http.post(url, {user: user}).then(function(response) {
                return response.data;
            })
            .catch(function(err) {
                return $q.reject(err);
            });
        };
    })
})();