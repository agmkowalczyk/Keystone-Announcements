var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Announcement Model
 * ==========
 */
var Announcement = new keystone.List('Announcement', {
  map: { name: 'title' },
  autokey: { path: 'slug', from: 'title', unique: true }
});

Announcement.add({
  title: { type: String, required: true, initial: true },
  author: { type: Types.Relationship, ref: 'User', index: true },
  state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
  publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
  province: { type: Types.Select, options: 'mazowieckie, małopolskie, pomorskie'},
  tel: { type: String },
	content: {
		brief: { type: Types.Html, wysiwyg: true, height: 150 },
		extended: { type: Types.Html, wysiwyg: true, height: 400 },
	},
	categories: { type: Types.Relationship, ref: 'Category' },
});

Announcement.defaultColumns = 'title, state|20%, author|20%, categories|10%, publishedDate|20%';
/**
 * Registration
 */

Announcement.register();
