var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.form = req.body;

	view.on('init', function (next) {

		if (!req.query.key) {
			req.flash('error', 'Podany klucz nie jest poprawny');
			return res.redirect('/zresetuj-haslo')
		}

		keystone.list('User').model.findOne({
			resetPassword: req.query.key,
		}, function (err, user) {

			if (err) {
				return next(err);
			}

			if (!user) {
				req.flash('error', 'Podany klucz nie jest poprawny');
				return res.redirect('/zresetuj-haslo')
			}

			locals.resetKey = req.query.key;
			next();
		});
	});

	view.on('post', function (next) {

		var data = req.body;

		if(!data.password) {
			req.flash('error', 'Podaj nowe hasło.');
			return next();
		}
		
		if (data.password && data.password !== data.passwordAgain) {
			req.flash('error', 'Podane hasła nie są takie same.');
			return next();
		}

		keystone.list('User').model.findOne({
			resetPassword: req.query.key,
		}, function (err, user) {

			if (err) {
				return next(err);
			}

			user.password = data.password;
			user.resetPassword = '';

			user.save(function (err, user) {

				if (err) {
					return next(err);
				}

				req.flash('success', 'Twoje hasło zostało zmienione.');
				res.redirect('/logowanie')
			});
		});
	});
	
	view.render('change_password');
};
