angular.module("meadMonitorApp")
	.directive("mmInitialFocus", ["$timeout", function($timeout) {
		return {
			restrict: "A",
			scope: {
				setFocusWhen: "=mmInitialFocus"
			},
			link: function(scope, element) {
				if (typeof scope.setFocusWhen === "undefined" || scope.setFocusWhen) {
					$timeout(function() {
						element[0].focus();
					}, 100);
				}
			}
		};
	}]);