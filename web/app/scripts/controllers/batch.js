angular.module('meadMonitorApp')
  .controller('BatchController', ['$scope', '$routeParams', '$location', '$timeout', 'Batches',
    function ($scope, $routeParams, $location, $timeout, Batches) {
      if ($routeParams.id) {
        $scope.batch = Batches.get({ id: $routeParams.id });
        $scope.batch.$promise.then(function (result) {
          $scope.batch = result;
        });

        $scope.temperatures = [];

        function intervalFunction() {
          $timeout(function () {
            var temps = Batches.temperatures({ id: $routeParams.id });

            temps.$promise.then(function (result) {
              for (var idx = $scope.temperatures.length; idx < temps.length; idx++) {
                $scope.temperatures.push(temps[idx]);
              }
            });

            intervalFunction();
          }, 1000);
        }

        intervalFunction();
      } else {
        $scope.batch = new Batches();
      }

      $scope.save = function () {
        $scope.batch.$save().then(function (batch) {
          $scope.batch = batch;
          $location.path('batches/' + $scope.batch.Id);
        });
      };

      $scope.cancel = function () {
        if ($scope.batch.Id) {
          $location.path('batches/' + $scope.batch.Id);
        } else {
          $location.path('/');
        }
      };
    }]);