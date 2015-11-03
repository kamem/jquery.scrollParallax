var gulp = require('gulp');
var plumber = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');
var postcss = require('gulp-postcss');
var concat = require('gulp-concat');
var minifyJs = require('gulp-uglify');
var consolidate = require('gulp-consolidate');
var connect = require('gulp-connect');

var watch = require('gulp-watch');

var settings = require('./gulpfile_settings');
var pkg = require('./package.json');

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
gulp.task('concat', function() {
	gulp.src([
		settings.watch.js.dir + 'copyright.js',
		settings.watch.js.dir + pkg.name + '.js'
	])
	.pipe(plumber())
	.pipe(concat(pkg.name + '.js'))
	.pipe(gulp.dest(settings.dest.js.dir))
	.pipe(consolidate('lodash', pkg))
	.pipe(gulp.dest(settings.dest.js.dir))
});

gulp.task('jsMini', function() {
	gulp.src([
		settings.watch.js.dir + 'copyright.min.js',
		settings.watch.js.dir + pkg.name + '.js'
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

gulp.task('watch', ['postcss', 'concat', 'jsMini', 'license'], function(){
	gulp.watch(settings.watch.css.files, ['postcss']);
	gulp.watch(settings.watch.js.files, ['concat', 'jsMini', 'license']);
});

gulp.task('default', ['watch']);
gulp.task('build', ['postcss', 'concat', 'jsMini', 'license']);