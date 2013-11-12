angular
  .module('NationalPokedex', ['ngRoute'])
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
      .when('/detalles/:indice', {
        templateUrl: '/seccion/detalles.html',
        controller: 'ControladorDetalles'
      })
      .otherwise({
        redirectTo: '/'
      })
    ;
  })
;
