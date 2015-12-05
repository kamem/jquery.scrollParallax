(function (global, factory) {
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], function() {factory($, global)});
	} else if (typeof exports !== 'undefined') {
		module.exports = factory(require('jquery'), global);
	} else {
		factory($, global);
	}
} (this, function ($, global) {