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
		nombre			: 'Bullbasour',
		imagen			: '',
		descripcion		: 'El Pokémon planta',
		tipos			: 'planta,veneno',
		ataque			: 10,
		defensa			: 10,
		ataqueSP		: 20,
		defensaSP		: 20
	}).then(this.insertar({
		nombre			: 'Charmander',
		imagen			: '',
		descripcion		: 'El Pokémon lagarto',
		tipos			: 'fuego',
		ataque			: 20,
		defensa			: 10,
		ataqueSP		: 20,
		defensaSP		: 10
	})).then(this.insertar({
		nombre			: 'Squirtle',
		imagen			: '',
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

	var insert = DB.prepare([
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
	].join(''));

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
					return def.reject( err );
				}

				//NOTE: lastID param not working on INSERT
				//this fixes the issue:
				DB.get('SELECT last_insert_rowid() AS lastID;', function(err, resultado) {
					if (err) {
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
			return def.reject( err );
		}

		return def.resolve();
	});

	return def.promise;
}

module.exports.filtrar = function(filtros) {
	var def = Q.defer();

	//QUERY STRING:
	//TODO: SQL Injection
	var queryString = 'SELECT * FROM pokedex WHERE 1';

	if (filtros.id) {
		queryString += ' AND id = "'+ filtros.id +'"';
	}

	if (filtros.tipos) {
		queryString += ' AND tipos LIKE "%' + filtros.tipos + '%"';
	}

	queryString += ' ORDER BY id DESC';


	//QUERY:
	DB.all(queryString, function(err, resultados) {
		if (err) {
			return def.reject( err );
		}

		_.map( resultados, function(resultado) {
			resultado.tipos = resultado.tipos.split(',');
		});

		return def.resolve( resultados );
	})

	return def.promise;
}
