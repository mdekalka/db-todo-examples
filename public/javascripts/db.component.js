(function() {
    angular.module('app').component('db', {
        bindings: {
            key: '<'
        },
        template: `<div>
                    <div>
                        <h2>Add new user</h2>
                        <form ng-submit="$ctrl.submit($event);">
                            <label>Name</label>
                            <input type="text" id="name" ng-model="$ctrl.user.name" />
                            <label>Age</label>
                            <input type="number" id="age" ng-model="$ctrl.user.age"/>
                            <button type="submit">Add new user</button>
                        </form>
                    </div>
                    <div>
                        <h2>Users list</h2>
                        <div ng-repeat="user in $ctrl.users track by user._id">
                            <input type="text" ng-model="user.name" />
                            <button ng-click="$ctrl.updateUser(user);">update</button>
                            <button ng-click="$ctrl.removeUser(user);">remove</button>
                            <button ng-click="$ctrl.getInfo(user);">info</button>
                        </div>
                        <h2>User info</h2>
                        <div>
                            <div>_id: {{$ctrl.currentUser._id}}</div>
                            <div>name: {{$ctrl.currentUser.name}}</div>
                            <div>age: {{$ctrl.currentUser.age}}</div>
                        </div>
                    </div>
                  </div>`,
        controller: function(dbService) {
            this.$onInit = function() {
                this.user = {
                    name: '',
                    age: ''
                };
                this.currentUser = {};
                this.users = [];

                this.getUsers();
            };

            this.$onChanges = function(changes) {
                if (changes.key.isFirstChange()) {
                    return;
                }

                if (changes.key) {
                    // If the key changes, that means that we switched to diff. db, so
                    // reload the get users from selected db
                    this.getUsers();
                }
            };

            function errorHandler(error) {
                console.log(error);
                throw new Error(error);
            }

            this.submit = function(event) {
                event.preventDefault();

                this.addUser(this.user);
                this.user = {};
            };

            this.getUsers = function() {
                dbService.getUsers()
                    .then(users => {
                        this.users = users;
                    })
                    .catch(errorHandler);
            };

            this.addUser = function(user) {
                const newUser = {
                    name: user.name,
                    age: user.age
                };

                dbService.addUser(user)
                    .then(null)
                    .catch(errorHandler);

                this.user = {};
            };

            this.getInfo = function(user) {
                dbService.getUserById(user._id)
                    .then(user => {
                        this.currentUser = user;
                    })
                    .catch(errorHandler);
            };

            this.removeUser = function(user) {
                dbService.removeUserById(user._id)
                    .then(null)
                    .catch(errorHandler);
            };

            this.updateUser = function(user) {
                const updatedUser = {
                    name: user.name,
                    age: user.age
                };

                dbService.updateUserById(user._id, updatedUser)
                    .then(null)
                    .catch(errorHandler);
            };


        }
    })
})();