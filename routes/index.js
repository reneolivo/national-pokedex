
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index');
};

exports.seccion = function(req, res) {
	var match		= req.params.seccion.match(/([\w-_\/]+)/);
	var seccion		= match[1];

	console.log(seccion);

	res.render( 'secciones/' + seccion );
}