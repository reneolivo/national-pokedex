var Q		= require('q');
var sqlite3 = require('sqlite3');
var DB		= new sqlite3.Database( '../pokedex.db' );

module.exports.init = function() {
	console.log('init');

	this.tieneRegistros()
	.then(function(tieneRegistros) {
		if (tieneRegistros === false) {
			return this.llenarTablas();
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
		')'
	].join(''));

	if (Array.isArray(v.tipos)) {
		v.tipos = v.tipos.join(',');
	}

	insert.run( 
		v.nombre,
		v.imagen		|| '',
		v.descripcion 	|| '',
		v.tipos			|| '',
		v.ataque 		|| 0,
		v.defensa 		|| 0,
		v.ataqueSP 		|| 0,
		v.defensaSP		|| 0,
		function() {
			def.resolve();
		}
	);

	return def.promise;
}

module.exports.filtrar = function(filtros) {
	var def = Q.defer();

	var queryString = 'SELECT * FROM pokedex WHERE 1';

	if (filtros.tipos) {
		//TODO: SQL Injection
		queryString += ' AND tipos LIKE "%' + filtros.tipos + '%"';
	}

	queryString += ' ORDER BY id DESC';

	DB.all(queryString, function(err, resultados) {
		if (err) {
			return def.reject( err );
		}

		return def.resolve( resultados );
	})

	return def.promise;
}
