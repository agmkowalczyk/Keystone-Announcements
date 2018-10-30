var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.section = 'dodaj-ogloszenie';
	locals.form = req.body;

	view.on('init', function (next) {

		keystone.list('Category').model.find({}, function (err, categories) {

			if (err) {
				return next(err);
			}

			locals.categories = categories;
			next();
		});
	});

	view.on('post', function (next) {

		var data = req.body;
		var errors = [];

		if(!data.title) {
			errors.push('Nie podano tytułu ogłoszenia.');
		}

		if (!data.province) {
			errors.push('Nie wybrano województwa.');
		}

		if (!data.tel) {
			errors.push('Nie podano numeru telefonu.');
		}

		if (!data.content_brief) {
			errors.push('Nie podano krótkieo opisu.');
		}

		if (!data.content_extended) {
			errors.push('Nie podano długiego opisu.');
		}

		if (!data.category) {
			errors.push('Nie wybrano ketagorii.');
		}
		
		errors.forEach(function(err) {
			req.flash('error', err);
		})
		
		if (errors.length) {
			return next();
		}
		
		var annoucementData = {
			title: data.title,
			author: req.user,
			province: data.province,
			tel: data.tel,
			content: {
				brief: data.content_brief,
				extended: data.content_extended,
			},
			categories: data.category,
		};
		
		var Announcement = keystone.list('Announcement').model,
			announcement = new Announcement(annoucementData);
		
		announcement.save(function(err, announcement) {
			if (err) {
				req.flash('error', 'Wystąpił błąd przy dodawaniu ogłoszenia.');
				return next();
			}
			console.log('Ogłoszenie oczekuje na zatwierdzenie pod adresem: http://localhost:3000/keystone/announcements/' + announcement.id);
			req.flash('success', 'Ogłoszenie zostało dodane i czekuje na zatwierdzenie.');
			next();
		});

	});

	view.render('add_announcement');
};
