var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = 'announcement';
	
	// Load the posts
	view.on('init', function (next) {

    var q = keystone.list('Announcement').model
      .findOne({
        state: 'published',
        slug: req.params.slug
      })
			.populate('author categories');

		q.exec(function (err, results) {
			locals.posts = results;
			next(err);
		});
	});

	// Render the view
	view.render('announcement');
};
