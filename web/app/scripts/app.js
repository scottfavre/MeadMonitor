'use strict';

/**
 * @ngdoc overview
 * @name meadMonitorApp
 * @description
 * # meadMonitorApp
 *
 * Main module of the application.
 */
angular
  .module('meadMonitorApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/devices/edit/:id', { templateUrl: '/views/devices/edit.html', controller: 'DeviceController' })
      .when('/devices/:id', { templateUrl: '/views/devices/detail.html', controller: 'DeviceController' })
      .otherwise({
        redirectTo: '/'
      });
  })
  .factory('Devices', ['$resource', function ($resource) {
    return $resource('/devices/:id');
  }]);
