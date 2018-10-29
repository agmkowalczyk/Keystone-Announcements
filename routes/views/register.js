var keystone = require('keystone');
var async = require('async');

exports = module.exports = function (req, res) {

	if(req.user) {
		return res.redirect('/');
	}
	
	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = 'rejestracja';
	locals.form = req.body;
	
	view.on('post', function (next) {
		var data = req.body;
		var errors = [];
		
		async.series([
			function(cb) {
				// Walidacja podanych danych
				if(!data.email) {
					errors.push('Nie podano adresu email.');
				}
				if(data.email && !keystone.utils.isEmail(data.email)) {
					errors.push('Adres email jest niepoprawny.');
				}
				if(!data.firstname) {
					errors.push('Nie podano imienia.');
				}
				if(!data.lastname) {
					errors.push('Nie podano nazwiska.');
				}
				if(!data.password) {
					errors.push('Nie podano hasła.');
				}
				if(data.password && data.password !== data.passwordAgain) {
					errors.push('Podane hasła różnią się.');
				}
				
				errors.forEach(function (err) {
					req.flash('error', err);
				});
				
				if(errors.length) {
					return cb(true);
				}
				
				cb();
			},
			function(cb) {
				// Sprawdzenie czy użytkownik istnieje
				keystone.list('User').model.findOne({
					email: data.email
				}, function(err, user) {
					if(err || user) {
						req.flash('error', 'Użytkownik z takim adresem email już istnieje.');
						return cb(true);
					}
					
					cb();
				});
			},
			function(cb) {
				// Zapisanie nowego użytkownika
				var userData = {
					email: data.email,
					name: {
						fist: data.firstname,
						last: data.lastname,
					},
					password: data.password,
					};
				
				var User = keystone.list('User').model,
					user = new User(userData);
				
				user.save(function(err) {
					cb(err);
				});
			},
		], function(err) {
			if(err) {
				return next();
			}
			
			keystone.session.signin(
				{
					email: data.email,
					password: data.password,
				}, req, res, function() {
					res.redirect('/');
				}, function() {
					req.flash('error', 'Zostałeś poprawnie zarejestrowany, ale wystąpił problem z zalogowaniem.');
					next();
				}
			);
		});
	});

	// Render the view
	view.render('register');
};
