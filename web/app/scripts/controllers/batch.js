angular.module('meadMonitorApp')
  .controller('BatchController', ['$scope', '$routeParams', '$location', 'Batches',
    function ($scope, $routeParams, $location, Batches) {
      if ($routeParams.id) {
        $scope.batch = Batches.get({ id: $routeParams.id });
        $scope.batch.$promise.then(function (result) {
          $scope.batch = result;
        });
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
        if ($scope.batch.id) {
          $location.path('batches/' + $scope.batch.Id);
        } else {
          $location.path('/');
        }
      };

      $scope.batch = function (batch) {
        batch.$delete().then(function () {
          $scope.batch = null;
          $location.path('/');
        });
      };
    }]);