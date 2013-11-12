var Pokedex = require('../../models/pokedex');

exports.filtrar = function(req, res) {
	Pokedex.filtrar( req.query ).then(function( resultados ) {
		res.json( resultados );
	});
}

exports.uno = function(req, res) {
	req.query.id = req.params.id;

	exports.filtrar(req, res);
}

exports.insertar = function(req, res) {
	Pokedex.insertar( req.body ).then(function( idPokemon ) {
		Pokedex.filtrar({ id : idPokemon }).then(function( resultados ) {
			res.json( resultados[ 0 ] );
		});
	});
}

exports.actualizar = function(req, res) {
	Pokedex.actualizar( req.params.id, req.body ).then(function() {
		Pokedex.filtrar({ id : req.params.id }).then(function( resultados ) {
			res.json( resultados[ 0 ] );
		});
	});
}