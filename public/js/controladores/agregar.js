angular.module('NationalPokedex')
.controller('ControladorAgregar', function($scope, $location, Pokemon, PokedexREST) {
	$scope.cambiarSeccion( '/agregar' );

	$scope.agregar = function agregar() {
		var pokemon = new PokedexREST( $scope.nuevo );

		pokemon.$save(function(resultado) {
			$scope.pokedex.pokemons.unshift( resultado );
			$scope.reiniciar();
			$location.path('/');
		})
	}

	$scope.reiniciar = function reiniciar() {
		$scope.nuevo            = new Pokemon();
		$scope.tipoSeleccionado = 'normal';
	}

	$scope.reiniciar();
});