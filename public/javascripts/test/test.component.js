(function() {
    'use strict';

    angular.module('app').component('t', {
        template: `<div><rec col="$ctrl.data"></rec><test></test><test1></test1></div>`,
        controller: function() {
            this.data =    [
                    {    name: 'Europe',
                        children: [
                            {    name: 'Italy',
                                children: [
                                    {    name: 'Rome' },
                                    {    name: 'Milan'    }
                                ]},
                            {    name: 'Spain'}
                        ]
                    },
                    {    name: 'South America',
                        children: [
                            {    name: 'Brasil'   },
                            {    name: 'Peru' }
                        ]
                    }
                ];
        }
    })
    .directive('rec', function() {
        return {
            replace: true,
            scope: {
                col: '<'
            },
            template: `<ul>
                        <member ng-repeat="a in col" name="a"></member>
                        </ul>`,
            controller: angular.noop
        }
    })
    .directive('member',function($compile) {
        return {
            replace: true,
            scope: {
                name: '<'
            },
            template: "<li ng-click=\"piu($event);\">{{name.name}}</li>",
            link: function($scope, element, attrs) {
                $scope.piu = function(event) {
                    event.stopPropagation();
                    console.log($scope.name);
                };

                var collectionSt = '<rec col="name.children"></rec>';
                if (angular.isArray($scope.name.children)) {       
                // debugger

                    $compile(collectionSt)($scope, function(cloned, scope)   {
                        element.append(cloned); 
                    });
                }
            }
        }
    })
    .component('test', {
        template: `<div class="test">
                    {{$ctrl.title}}
                    <input ng-model="$ctrl.state.piu" />
                    <test-input title="{{$ctrl.title}}" ></test-input>
                    <span ng-repeat="v in $ctrl.service.arr">{{v}}</span>
                    <button ng-click="$ctrl.change();">change layout</button>
                    <div ng-switch="$ctrl.layout">
                        <div ng-switch-when="a">
                            <div>first</div>
                        </div>
                        <div ng-switch-when="b">
                            <div>second</div>
                        </div>
                    </div>
                  </div>`,
        controller: function(testService) {
            this.service = testService;

            this.change = function() {
                this.layout = 'b';
            };

            this.layout = 'a'

            this.getArr = function() {
                this.arr = testService.getArr();
            };

            this.$onInit = function() {
                this.title = 'OHOHOHO';
                

                this.getArr();
            };
        }
    })
    .component('test1', {
        template: `<div>
                    <h2>Test1 component</h2>
                    <span ng-repeat="v in $ctrl.service.extended">{{v.name}}</span>
                  </div>`,
        controller: function(testService) {
            this.service = testService;
        }
    })
    .component('testInput', {
        bindings: {
            title: '@'
        },
        template: `<div>{{$ctrl.title}}<input ng-model="$ctrl.model"/></div>`,
        controller: function() {
            this.model = ''
        }
    })
    .service('testService', function($interval) {
        var _this = this;
        var i = 1;

        this.arr = [0, 1];
        this.extended = [];

        // $interval(function() {
        //     i++;
            
        //     _this.arr = _this.arr.concat([i]);
        //     _this.extended = _this.arr.map(function(item) {
        //         return {
        //             name: item
        //         }
        //     });
        // }, 1000);

        this.getArr = function() {
            return this.arr;
        };

    })
})();