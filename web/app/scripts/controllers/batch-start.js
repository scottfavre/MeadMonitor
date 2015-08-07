angular.module('meadMonitorApp')
  .controller('BatchStartController', ['$scope', '$routeParams', '$location', 'Batches', 'Devices',
    function ($scope, $routeParams, $location, Batches, Devices) {
      $scope.batch = Batches.get({ id: $routeParams.id });
      $scope.batch.$promise.then(function (result) {
        $scope.batch = result;
      });

      $scope.devices = Devices.query();
      $scope.devices.$promise.then(function (result) {
        $scope.devices = result;
      });

      $scope.start = function (device) {
        $scope.batch.$start({ device_id: device.Id })
          .then(function (batch) {
            $scope.batch = batch;
            $location.path('batches/' + $scope.batch.Id);
          });
      };

      $scope.cancel = function () {
        if ($scope.batch.Id) {
          $location.path('batches/' + $scope.batch.Id);
        }
      };
    }]);