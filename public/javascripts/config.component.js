(function() {
    angular.module('app').component('config', {
        template: `<div>
                    <ul class="menu">
                        <li ng-class="{'active': $ctrl.selectedKey === 'mongo'}">
                            <a ng-click="$ctrl.changeConfig('mongo');" href="#">mongo</a>
                        </li>
                        <li ng-class="{'active': $ctrl.selectedKey === 'postgre'}">
                            <a ng-click="$ctrl.changeConfig('postgre');" href="#">postgre</a>
                        </li>
                        <li ng-class="{'active': $ctrl.selectedKey === 'mysql'}">
                            <a ng-click="$ctrl.changeConfig('mysql');" href="#">mysql</a>
                        </li>
                    </ul>
                    <db ng-if="$ctrl.selectedKey" key="$ctrl.selectedKey"></db>
                    <div ng-if="!$ctrl.selectedKey">Please, select the db</div>
                  </div>`,
        controller: function(dbService) {
            this.changeConfig = function(key) {
                dbService.changeConfig(key);

                this.selectedKey = key;
            };

            this.selectedKey = '';
        }
    });
})();