var Pokedex = require('../../models/pokedex');

exports.filtrar = function(req, res) {
	Pokedex.filtrar( req.query ).then(function( resultados ) {
		res.json( resultados );
	});
}