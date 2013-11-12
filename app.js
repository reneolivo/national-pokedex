
/**
 * Module dependencies.
 */

var express = require('express');

//ROUTES:
var routes 			= require('./routes');
var pokedexRouter	= require('./routes/api/pokedex');

//MODELS:
var pokedexModel = require('./models/pokedex').init();

//LIBS:
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//ROUTES DEFINITION:
app.get('/', routes.index);
app.get( '/api/pokedex', pokedexRouter.filtrar );
app.post( '/api/pokedex', pokedexRouter.insertar );
app.get( '/api/pokedex/:id', pokedexRouter.uno );
app.post( '/api/pokedex/:id', pokedexRouter.actualizar );
app.del( '/api/pokedex/:id', pokedexRouter.eliminar );


//RUN:
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
