var keystone = require('keystone');

exports = module.exports = function (req, res) {

	if(req.user) {
		return res.redirect('/');
	}

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = 'logowanie';
	locals.form = req.body;

	view.on('post', function (next) {
		var data = req.body;
		
		if(!data.email || !data.password) {
			req.flash('error', 'Podaj adres email i hasło.');
			return next();
		}

		keystone.session.signin(
			{
				email: data.email,
				password: data.password,
			}, req, res, function() {
				res.redirect('/');
			}, function(err) {
				req.flash('error', 'Podałes nieprawidłowe dane. Spróbuj ponownie.');
				next();
			}
		);
	});

	// Render the view
	view.render('login');
};
