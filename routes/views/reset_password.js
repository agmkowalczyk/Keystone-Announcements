var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	locals.form = req.body;
	
	view.on('post', function (next) {
		var data = req.body;
		
		if(!data.email) {
			req.flash('error', 'Podaj adres email.');
			return next();
		}
		
		// Znajdź użytkownika o adresie email.
		keystone.list('User').model.findOne({
			email: data.email,
		}, function(err, user) {
			
			if (err) {
				return next(err);
			}
			
			if (!user) {
				req.flash('error', 'Nie znaleziono użytkownika z takim adresem email.');
				return next();
			}
			
			// Wygeneruj losowy ciąg znaków
			user.resetPassword = keystone.utils.randomString(20);
			user.save(function(err, user) {
				
				if (err) {
					return next(err);
				}
				
				// Wyślij wiadomość do użytkownika z odpowiednim linkiem 
				console.log('Zresetuj hasło. Link http://localhost:3000/zmien-haslo?key=' + user.resetPassword);
				req.flash('success', 'Poprawnie zresetowane hasło. Wiadomość została wysłana na adres ' + user.email);
				next();
			});
		});
	});
	
	view.render('reset_password');
	};
