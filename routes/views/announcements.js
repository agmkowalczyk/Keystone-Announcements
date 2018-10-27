var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = 'announcements';
	
		// Load the current category filter
	view.on('init', function (next) {

		if (req.params.category) {
			keystone.list('Category').model.findOne({ key: req.params.category }).exec(function (err, result) {
				locals.category = result;
				next(err);
			});
		} else {
			next();
		}
	});

	// Load the posts
	view.on('init', function (next) {

    var q = keystone.list('Announcement').model
      .find({
        state: 'published'
      })
			.populate('author categories');

		if (req.params.category) {
			q.where('categories').in([locals.category]);
		}

		q.exec(function (err, results) {
			locals.posts = results;
			next(err);
		});
	});

	// Render the view
	view.render('announcements');
};
