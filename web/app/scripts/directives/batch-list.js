angular.module('meadMonitorApp')
	.directive('mmBatchList', ['Batches', function (Batches) {
		return {
			templateUrl: 'scripts/directives/batch-list.html',
			restrict: "E",
			scope: true,
			controller: ['$scope', function ($scope) {
				$scope.batches = Batches.query();
				$scope.delete = function(batch) {
					batch.$delete();	
				};
			}]
		};
	}]);