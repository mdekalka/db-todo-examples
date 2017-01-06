(function() {
    angular.module('app').service('dbService', function($http, $q) {
        function successHandler(response) {
            return response && response.data;
        }

        function errorHandler(error) {
            return $q.reject(error);
        }

        this.dbConfig = {
            current: {},
            db: {
                postgre: {
                    path: '/postgre/users'
                },
                mongo: {
                    path: '/mongo/users'
                },
                mysql: {
                    path: '/mysql/users'
                }
            }
        };

        this.changeConfig = function(key) {
            this.dbConfig.current = this.dbConfig.db[key];
        };
        this.users = [];

        // Load users from db
        this.getUsers = function() {
            const path = this.dbConfig.current.path;

            return $http.get(path)
                .then(successHandler)
                .then(users => {
                    return this.users = users;
                })
                .catch(errorHandler);
        };

        // Add new user to db
        this.addUser = function(user) {
            const path = this.dbConfig.current.path;

            return $http.post(path, { user: user })
                .then(successHandler)
                .then(user => {
                    this.users.push(user);
                })
                .catch(errorHandler);
        };

        // Get user by id from db
        this.getUserById = function(id) {
            const path = this.dbConfig.current.path;

            return $http.get(`${path}/${id}`)
                .then(successHandler)
                .catch(errorHandler);
        };

        // Remove user by id from db
        this.removeUserById = function(id) {
            const path = this.dbConfig.current.path;

            return $http.delete(`${path}/${id}`)
                .then(successHandler)
                .then(id => {
                    debugger
                    const index = this.users.map(user => {
                        return user.id;
                    }).indexOf(id);

                    this.users.splice(index, 1);
                })
                .catch(errorHandler);
        };

        // Update user in db
        this.updateUserById = function(id, user) {
            const path = this.dbConfig.current.path;

            return $http.put(`${path}/${id}`, { user: user })
                .then(successHandler)
                .then(updateUser => {
                    let userToUpdate = this.users.find(user => {
                        return user._id === updateUser._id;
                    });

                    if (updateUser) {
                        angular.extend(userToUpdate, updateUser);
                    }
                })
                .catch(errorHandler);
        };

    });
})();