angular.module('meadMonitorApp')
	.directive('mmDeviceList', ['Devices', function (Devices) {
		return {
			templateUrl: 'scripts/directives/device-list.html',
			restrict: "E",
			scope: true,
			controller: ['$scope', function ($scope) {
				$scope.devices = Devices.query();
			}]
		};
	}]);