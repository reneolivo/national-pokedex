angular
  .module('NationalPokedex', ['ngRoute','ngResource'])
  .config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '/seccion/pokedex.html',
        controller: 'ControladorPokedex'
      })
      .when('/agregar', {
        templateUrl: '/seccion/agregar.html',
        controller: 'ControladorAgregar'
      })
      .when('/detalles/:id', {
        templateUrl: '/seccion/detalles.html',
        controller: 'ControladorDetalles'
      })
      .otherwise({
        redirectTo: '/'
      })
    ;
  })
;
