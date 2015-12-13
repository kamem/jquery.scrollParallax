module.exports = function(config) {
	config.set({
		basePath: '',
		frameworks: ['mocha', 'chai'],
		files: [
			'example/js/jquery.js',
			'example/js/jquery.dataExtend.js',
			'test/**/*.js'
		],
		exclude: [
		],
		preprocessors: {
			'dist/js/jquery.scrollParallax.js': ['webpack', 'sourcemap'],
			'test/**/*.js': ['webpack', 'sourcemap']
		},
		reporters: ['progress'],
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: true,
		browsers: ['PhantomJS'],
		singleRun: false,
		webpack: {
			devtool: 'inline-source-map',
			module: {
				loaders: [
					{
						test: /test\/\.js$/,
						exclude: /.*_modules/,
						loader: 'babel-loader'
					}
				]
			}
		},
		plugins: [
			'karma-webpack',
			'karma-mocha',
			'karma-phantomjs-launcher',
			'karma-chrome-launcher',
			'karma-sourcemap-loader',
			'karma-chai'
		]
	});
};