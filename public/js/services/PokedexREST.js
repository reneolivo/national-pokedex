angular.module('NationalPokedex')
.factory('PokedexREST', function($resource) {
	var PokedexREST = $resource('/api/pokedex/:id', {id: '@id'});

	return PokedexREST;
});