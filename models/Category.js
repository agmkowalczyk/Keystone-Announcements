var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Category Model
 * ==========
 */
var Category = new keystone.List('Category', {
  autokey: { path: 'slug', from: 'name', unique: true }
});

Category.add({
	name: { type: String, required: true }
});

Category.relationship({ ref: 'Announcement', path: 'categories' });
/**
 * Registration
 */

Category.register();
