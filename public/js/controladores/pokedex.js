angular.module('NationalPokedex')
.controller('ControladorPokedex', function($scope) {
	$scope.cambiarSeccion( '/' );

	$scope.eliminar = function( pokemon ) {
		pokemon.$delete(function() {
			$scope.pokedex.eliminar( pokemon );
		});
	}
});