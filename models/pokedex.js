var Q		= require('q');
var _		= require('lodash');
var sqlite3 = require('sqlite3');
var DB		= new sqlite3.Database( './pokedex.db' );

module.exports.init = function() {
	console.log('init');

	this.tieneRegistros()
	.then(function(tieneRegistros) {
		if (tieneRegistros === false) {
			return module.exports.llenarTablas();
		} else {
			return Q.defer().resolve();
		}
	})
	.done();
}

module.exports.tieneRegistros = function() {
	console.log('tieneRegistros?');

	var def  = Q.defer();
	var self = this;

	DB.get(
		'SELECT COUNT(*) as total FROM pokedex',
		function(err, resultado) {
			if (err && err.errno == 1) {
				return self.crearTablas().then(function() {
					def.resolve( false );
				});
			}

			def.resolve( resultado.total > 0 );
		}
	);

	return def.promise;
}

module.exports.crearTablas = function() {
	console.log('crearTablas!');

	var def = Q.defer();

	DB.run([
		'CREATE TABLE pokedex(',
			'id INTEGER PRIMARY KEY AUTOINCREMENT,',
			'nombre VARCHAR,',
			'imagen VARCHAR,',
			'descripcion TEXT,',
			'tipos VARCHAR,',
			'ataque INTEGER,',
			'defensa INTEGER,',
			'ataqueSP INTEGER,',
			'defensaSP INTEGER',
		');'
	].join(''), function() {
		def.resolve();
	});

	return def.promise;
}

module.exports.borrarTablas = function() {
	console.log('borrarTablas!');

	var def = Q.defer();
	
	DB.run('DROP TABLE pokedex', function(err, result) {
		def.resolve();
	});

	return def.promise;
}

module.exports.llenarTablas = function() {
	console.log('llenarTablas!');

	var def = Q.defer();

	this.insertar({
		nombre			: 'Bulbasaur',
		imagen			: 'http://cdn.bulbagarden.net/upload/2/21/001Bulbasaur.png',
		descripcion		: 'El Pokémon planta',
		tipos			: 'planta,veneno',
		ataque			: 10,
		defensa			: 10,
		ataqueSP		: 20,
		defensaSP		: 20
	}).then(this.insertar({
		nombre			: 'Charmander',
		imagen			: 'http://cdn.bulbagarden.net/upload/7/73/004Charmander.png',
		descripcion		: 'El Pokémon lagarto',
		tipos			: 'fuego',
		ataque			: 20,
		defensa			: 10,
		ataqueSP		: 20,
		defensaSP		: 10
	})).then(this.insertar({
		nombre			: 'Squirtle',
		imagen			: 'http://cdn.bulbagarden.net/upload/3/39/007Squirtle.png',
		descripcion		: 'El Pokémon tortuga',
		tipos			: 'agua',
		ataque			: 10,
		defensa			: 20,
		ataqueSP		: 10,
		defensaSP		: 20
	})).then(function() {
		def.resolve();
	});

	return def.promise;
}

module.exports.insertar = function(v) {
	console.log('insertar!');

	var def = Q.defer();

	var queryString = [
		'INSERT INTO pokedex (',
			'nombre,',
			'imagen,',
			'descripcion,',
			'tipos,',
			'ataque,',
			'defensa,', 
			'ataqueSP,', 
			'defensaSP',
		') VALUES (',
			'?,',
			'?,',
			'?,',
			'?,',
			'?,',
			'?,',
			'?,',
			'?',
		');'
	].join('');

	var insert = DB.prepare( queryString );

	if (Array.isArray(v.tipos)) {
		v.tipos = v.tipos.join(',');
	}

	DB.serialize(function() {
		insert.run( 
			v.nombre,
			v.imagen		|| '',
			v.descripcion 	|| '',
			v.tipos			|| '',
			v.ataque 		|| 0,
			v.defensa 		|| 0,
			v.ataqueSP 		|| 0,
			v.defensaSP		|| 0,
			function(err) {
				if (err) {
					err.queryString = queryString;
					return def.reject( err );
				}

				//NOTE: lastID param not working on INSERT
				//this fixes the issue:
				queryString = 'SELECT last_insert_rowid() AS lastID;';

				DB.get(queryString, function(err, resultado) {
					if (err) {
						err.queryString = queryString;
						return def.reject( err );
					}
					
					insert.finalize();

					def.resolve( resultado.lastID );
				})
			}
		);
	});

	

	return def.promise;
}

module.exports.actualizar = function(id, v) {
	var def = Q.defer();

	var queryString = 'UPDATE pokedex SET';
	var parametros	= [];

	_.map([
		'nombre',
		'imagen',
		'descripcion',
		'tipos',
		'ataque',
		'defensa',
		'ataqueSP',
		'defensaSP'
	], function(campo) {
		if ('undefined' !== typeof v[ campo ]) {
			queryString += ' ' + campo + ' = ?';
			parametros.push( v[ campo ] );
		}
	});

	queryString += ' WHERE id = ? ';
	parametros.push( id );

	DB.run( queryString, parametros, function(err) {
		if (err) {
			err.queryString = queryString;
			return def.reject( err );
		}

		return def.resolve();
	});

	return def.promise;
}

module.exports.eliminar = function(id) {
	var def = Q.defer();

	var queryString = 'DELETE FROM pokedex WHERE id = ?';

	DB.run(queryString, id, function(err) {
		if (err) {
			err.queryString = queryString;
			return def.reject( err );
		}

		def.resolve();
	});

	return def.promise;
}

module.exports.filtrar = function(filtros) {
	var def = Q.defer();

	//QUERY STRING:
	var queryString = 'SELECT * FROM pokedex WHERE 1';
	var params		= {};

	if (filtros.id) {
		queryString += ' AND id = $id';
		params.id = filtros.id;
	}

	if (filtros.tipos) {
		//TODO: SQL Injection:
		queryString += ' AND tipos LIKE "%'+ filtros.tipos +'%"';
	}

	queryString += ' ORDER BY id DESC';


	//QUERY:
	DB.all(queryString, params, function(err, resultados) {
		if (err) {
			err.queryString = queryString;
			return def.reject( err );
		}

		_.map( resultados, function(resultado) {
			resultado.tipos = resultado.tipos.split(',');
		});

		return def.resolve( resultados );
	})

	return def.promise;
}
