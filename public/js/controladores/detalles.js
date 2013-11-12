angular.module('NationalPokedex')
.controller('ControladorDetalles', function($scope, $routeParams, PokedexREST) {
	$scope.cambiarSeccion( '/detalles' );

	$scope.pokemon = PokedexREST.get({ id: $routeParams.id });
});