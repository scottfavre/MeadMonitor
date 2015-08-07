
angular.module('meadMonitorApp')
	.directive('mmBatchList', ['Batches', function (Batches) {
		return {
			templateUrl: 'scripts/directives/batch-list.html',
			restrict: "E",
			scope: true,
			controller: ['$scope', function ($scope) {
				$scope.batches = Batches.query();
				$scope.delete = function (batch) {
					batch.$delete().then(function (result) {
						console.log(result);
						for (var idx; idx < $scope.batches.length; idx++) {
							if ($scope.batches[idx].Id === batch.Id) {
								$scope.batches.splice(idx, 1);
								return;
							}
						}
					});
				};
			}]
		};
	}]);