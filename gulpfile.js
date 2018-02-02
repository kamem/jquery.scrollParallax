var gulp = require('gulp');
var plumber = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');
var postcss = require('gulp-postcss');
var concat = require('gulp-concat');
var minifyJs = require('gulp-uglify');
var consolidate = require('gulp-consolidate');
var connect = require('gulp-connect');
var babel = require('gulp-babel');
var amdclean = require('gulp-amdclean');
var rimraf = require('rimraf');
var requirejsOptimize = require('gulp-requirejs-optimize');

var watch = require('gulp-watch');

var settings = require('./gulpfile_settings');
var pkg = require('./package.json');
pkg.name = pkg.name.replace(/-./g, function(str) {
	return str.charAt(1).toUpperCase();
});

var Server = require('karma').Server;

gulp.task('postcss', function () {
	gulp.src([settings.watch.css.files])
	.pipe(plumber())
	.pipe(postcss([
		require('precss')
	]))
	.pipe(autoprefixer({
		browsers: ["> 0%"],
		cascade: false
	}))
	.pipe(gulp.dest(settings.example.css.dir));
});


var today = new Date();
pkg['date'] = {
	year: today.getFullYear(),
	month: (today.getMonth() + 1),
	date: today.getDate()
};
gulp.task('concat', ['amd-bundle'], function() {
	return gulp.src([
		settings.watch.js.dir + 'copyright.js',
		settings.watch.js.dir + 'start.js',
		settings.dest.name + '/temp/require/' + pkg.name + '.js',
		settings.watch.js.dir + 'end.js'
	])
	.pipe(plumber())
	.pipe(concat(pkg.name + '.js'))
	.pipe(gulp.dest(settings.dest.js.dir))
	.pipe(consolidate('lodash', pkg))
	.pipe(gulp.dest(settings.dest.js.dir))
});

gulp.task('jsMini', ['concat'], function() {
	return gulp.src([
		settings.watch.js.dir + 'copyright.min.js',
		settings.watch.js.dir + 'start.js',
		settings.dest.name + '/temp/require/' + pkg.name + '.js',
		settings.watch.js.dir + 'end.js'
	])
	.pipe(plumber())
	.pipe(concat(pkg.name + '.min.js'))
	.pipe(gulp.dest(settings.dest.js.dir))
	.pipe(consolidate('lodash', pkg))
	.pipe(gulp.dest(settings.dest.js.dir))
	.pipe(minifyJs({preserveComments: 'some'}))
	.pipe(gulp.dest(settings.dest.js.dir))
});

gulp.task('license', function() {
	gulp.src([settings.watch.name + '/LICENSE.txt'])
	.pipe(consolidate('lodash', pkg))
	.pipe(gulp.dest('./'))
});

gulp.task('babel', function() {
	return gulp.src(settings.watch.es6.files)
	.pipe(plumber())
	.pipe(babel({
		presets: ['es2015'],
		plugins: ["transform-es2015-modules-amd"]
	}))
	.pipe(gulp.dest(settings.dest.name + '/temp'))
});

gulp.task('amd-bundle', ['babel'], function(){
	return gulp.src(settings.dest.name + '/temp/'+ pkg.name + '.js')
			.pipe(plumber())
			.pipe(requirejsOptimize({
					optimize: 'none'
			}))
			.pipe(amdclean.gulp())
			.pipe(gulp.dest(settings.dest.name + '/temp/require/'))
});

gulp.task('clean-temp', ['jsMini'], function(cb) {
	return rimraf(settings.dest.name + '/temp', cb);
});

gulp.task('jsDist', ['clean-temp']);

gulp.task('watch', ['jsDist', 'postcss', 'license'], function(){
	gulp.watch(settings.watch.css.files, ['postcss']);
	gulp.watch(settings.watch.js.files, ['jsDist', 'license']);
	gulp.watch(settings.watch.es6.files, ['jsDist', 'license']);
});


gulp.task('test', function (done) {
	new Server({
		configFile: __dirname + '/karma.conf.js',
		singleRun: true
	}, done).start();
});

gulp.task('tdd', function (done) {
	new Server({
		configFile: __dirname + '/karma.conf.js'
	}, done).start();
});


gulp.task('webserver', function() {
	connect.server({
		root: './',
		livereload: true,
		port: 8888
	});
});

gulp.task('livereload', function() {
	gulp.src(settings.example.name + '/**/*.*')
			.pipe(watch(settings.example.name + '/**/*.*'))
			.pipe(connect.reload());
});

gulp.task('default', ['watch', 'webserver', 'livereload']);
gulp.task('build', ['postcss', 'concat', 'jsMini', 'license']);
