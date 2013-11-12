angular.module('NationalPokedex')
.factory('Pokedex', function Pokedex(PokedexREST) {
	var tipos = [
      'normal',
      'agua',
      'fuego',
      'grama',
      'dragon',
      'volador',
      'venenoso',
      'insecto'
    ];

    function filtrar() {
    	var self = this;

    	return this.pokemons = PokedexREST.query({}, function(resultados) {
    		//this.pokemons = resultados;
    	}, function(err) {
    		console.log('ERROR:', err);
    	});
    }

    function agregar(pokemon) {
      this.pokemons.unshift( pokemon );
    }

    function eliminar(pokemon) {
      var indice = this.pokemons.indexOf( pokemon );

      this.pokemons.splice( indice, 1 );
    }
    
    return {
      pokemons          : [],
      tipos             : tipos,
      filtrar			      : filtrar,
      agregar           : agregar,
      eliminar          : eliminar
    };
});