angular.module('NationalPokedex')
.controller('ControladorAgregar', function($scope, Pokemon) {
	$scope.cambiarSeccion( '/agregar' );

	$scope.agregar = function agregar() {
		$scope.pokedex.pokemons.push( $scope.nuevo );
		$scope.reiniciar();
	}

	$scope.reiniciar = function reiniciar() {
		$scope.nuevo            = new Pokemon();
		$scope.tipoSeleccionado = 'normal';
	}

	$scope.reiniciar();
});