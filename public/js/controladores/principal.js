angular.module('NationalPokedex')
.controller('ControladorPrincipal', function($scope, Pokemon) {
  
  var bullbasour = new Pokemon({
    nombre      : "Bulbasaur",
    imagen      : 'http://cdn.bulbagarden.net/upload/2/21/001Bulbasaur.png',
    descripcion : "El Pokemon planta",
    tipos       : [ 'grama', 'veneno' ],
    ataque      : 10,
    defensa     : 10,
    ataqueSP    : 10,
    defensaSP   : 10
  });
  
  var charmander = new Pokemon({
    nombre      : "Charmander",
    imagen      : 'http://cdn.bulbagarden.net/upload/7/73/004Charmander.png',
    descripcion : "El pokemon lagarto",
    tipos       : [ 'fuego' ],
    ataque      : 10,
    defensa     : 10,
    ataqueSP    : 20,
    defensaSP   : 20
  });
  
  var squirtle = new Pokemon({
    nombre      : "Squirtle",
    imagen      : 'http://cdn.bulbagarden.net/upload/3/39/007Squirtle.png',
    descripcion : "El Pokemon tortuga",
    tipos       : [ 'agua' ],
    ataque      : 10,
    defensa     : 20,
    ataqueSP    : 10,
    defensaSP   : 20
  });
  
  
  $scope.pokedex = (function() {
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
    
    function eliminar(pokemon) {
      var indice = this.pokemons.indexOf(pokemon);
      
      this.pokemons.splice(indice, 1);
    }
    
    return {
      tipos             : tipos,
      eliminar          : eliminar,
      pokemons          : [ bullbasour, charmander, squirtle ]
    };
  })();
  
});