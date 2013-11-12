angular.module('NationalPokedex')
.controller('ControladorPrincipal', function($scope, Pokemon, Pokedex) {
  //SECCION:
  $scope.seccionActual = '/';

  $scope.cambiarSeccion = function(seccion) {
    $scope.seccionActual = seccion;
  }

  //POKEDEX:
  $scope.pokedex = Pokedex;

  $scope.pokedex.filtrar();
});