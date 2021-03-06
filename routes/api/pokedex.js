var Pokedex = require('../../models/pokedex');

function handlerErrorGenerico(res, err) {
	return res.send(500, err);
}

exports.filtrar = function(req, res) {
	Pokedex.filtrar( req.query ).then(function( resultados ) {
		res.json( resultados );
	}).fail(function(err) {
		handlerErrorGenerico( res, err );
	});
}

exports.uno = function(req, res) {
	req.query.id = req.params.id;

	Pokedex.filtrar( req.query ).then(function( resultados ) {
		res.json( resultados[ 0 ] );
	}).fail(function(err) {
		handlerErrorGenerico( res, err );
	});
}

exports.insertar = function(req, res) {
	Pokedex.insertar( req.body ).then(function( idPokemon ) {
		Pokedex.filtrar({ id : idPokemon }).then(function( resultados ) {
			res.json( resultados[ 0 ] );
		}).fail(function(err) {
			handlerErrorGenerico( res, err );
		});
	}).fail(function(err) {
		handlerErrorGenerico( res, err );
	});
}

exports.actualizar = function(req, res) {
	Pokedex.actualizar( req.params.id, req.body ).then(function() {
		Pokedex.filtrar({ id : req.params.id }).then(function( resultados ) {
			res.json( resultados[ 0 ] );
		}).fail(function(err) {
			handlerErrorGenerico( res, err );
		});
	}).fail(function(err) {
		handlerErrorGenerico( res, err );
	});
}

exports.eliminar = function(req, res) {
	Pokedex.eliminar( req.params.id ).then(function() {
		res.json({success: true});
	}).fail(function(err) {
		handlerErrorGenerico( res, err );
	});
}