var Pokedex = require('../../models/pokedex');

function handlerErrorGenerico(res, err, queryString) {
	return res.send(500, { error: err, queryString: queryString });
}

exports.filtrar = function(req, res) {
	Pokedex.filtrar( req.query ).then(function( resultados ) {
		res.json( resultados );
	}).fail(function(err, queryString) {
		console.log('queryString:', queryString);

		handlerErrorGenerico( res, err, queryString );
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
		}).fail(function(err, queryString) {
			handlerErrorGenerico( res, err, queryString );
		});
	}).fail(function(err, queryString) {
		handlerErrorGenerico( res, err, queryString );
	});
}

exports.actualizar = function(req, res) {
	Pokedex.actualizar( req.params.id, req.body ).then(function() {
		Pokedex.filtrar({ id : req.params.id }).then(function( resultados ) {
			res.json( resultados[ 0 ] );
		}).fail(function(err, queryString) {
			handlerErrorGenerico( res, err, queryString );
		});
	}).fail(function(err, queryString) {
		handlerErrorGenerico( res, err, queryString );
	});
}