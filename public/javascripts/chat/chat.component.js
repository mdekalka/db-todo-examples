(function() {
    'use strict';

    angular.module('app').component('chat', {
        template: `<div>
                    <h2>Chat component</h2>
                    <form ng-submit="$ctrl.submit($event);">
                        <input type="text" ng-model="$ctrl.model">
                        <button>send</button>
                    </form>
                    {{messages}}
                    <div ng-repeat="msg in $ctrl.messages track by $index">
                        {{msg}}
                    </div>
                   </div> `,
        controller: function($rootScope, $http) {
            var _this = this;

            this.$onInit = function() {
                this.model = '';
                this.messages = ['poipoip'];

                this.socket = io.connect('http://localhost:8008');

                this.socket.on('connecting', function () {
                    console.log('Соединение...');
                });
    
                this.socket.on('connect', function () {
                    console.log('Соединение установлено!');
                });
        
                this.socket.on('message', function (data) {
                    $rootScope.$apply(function() {
                        _this.messages.push(data.message);
                    })
                });
            };

            this.submit = function(event) {
                event.preventDefault();

                

                this.sendMessage(this.model);
            };

            this.sendMessage = function(message) {
                this.socket.emit('message', {message: message});

                this.model = '';

            };
        }
    })
})();