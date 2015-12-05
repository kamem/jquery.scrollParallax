var dest = 'dist';
var watch = 'src';
var example = 'example';

var settings = {
	dest: {
		name: dest,
		css: {dir: dest + '/css/'},
		js: {dir: dest + '/js/'}
	},
	watch: {
		name: watch,
		css: {dir: watch + '/css/'},
		js: {dir: watch + '/js/'},
		es6: {dir: watch + '/js/'}
	},
	example: {
		name: example,
		css: {dir: example + '/css/'},
		js: {dir: example + '/js/'}
	}
};
settings.dest.css.files = settings.dest.css.dir + '**/*.css';
settings.dest.js.files = settings.dest.js.dir + '**/*.js';

settings.watch.css.files = settings.watch.css.dir + '**/*.css';
settings.watch.js.files =  settings.watch.js.dir + '**/*.js';
settings.watch.es6.files =  settings.watch.es6.dir + '**/*.jsx';

settings.example.css.files = settings.example.css.dir + '**/*.css';
settings.example.js.files =  settings.example.js.dir + '**/*.js';

module.exports = settings;