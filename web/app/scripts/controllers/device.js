angular.module('meadMonitorApp')
  .controller('DeviceController', ['$scope', '$routeParams', '$location', 'Devices', '$route',
    function ($scope, $routeParams, $location, Devices, $route) {
      if ($routeParams.id) {
        $scope.device = Devices.get({ id: $routeParams.id });
        $scope.device.$promise.then(function (result) {
          $scope.device = result;
        });

        $scope.save = function () {
          $scope.device.$save().then(function (dev) {
            $scope.device = dev;
            $location.path('devices/' + $scope.device.Id);
          });
        };

        $scope.cancel = function () {
          $location.path('devices/' + $scope.device.Id);
        };
      }
    }]);