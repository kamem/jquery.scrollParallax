import {Status} from './ScrollStatus';
import {scrollPositionStringToNumber} from './Util';

export class ScrollFit {
	constructor($element) {
		this.$element = $element;
		this.styleValues = {};
		this.motions = [];
		this.rangeMotions = [];
	}
	setMotions(motion) {
		var ops = $.extend({
			easing: 'linear'
		}, motion);
		this.motions.push(ops);
	};

	setRangeMotions() {
		var range = [];
		this.motions.forEach(function(motion) {
			var start = scrollPositionStringToNumber(motion.start);
			var isMotion = start <= Status.scrollPosition;
			if(isMotion) range.push(motion);
		});

		this.rangeMotions = range;
	};

	setDefaultStyles() {
		var defaultStyles = {};
		this.motions.forEach(function(motion) {
			for(var style in motion.fromStyle) {
				if(defaultStyles[style] === undefined) defaultStyles[style] = motion.fromStyle[style];
			}
		});

		this.styleValues = defaultStyles;
	};

	setFromStyle() {
		var _this = this;
		this.motions.forEach(function(motion, i) {
			for(var style in motion.toStyle) {
				if(motion.fromStyle === undefined) motion.fromStyle = {};
				if(motion.fromStyle[style] === undefined) {
					motion.fromStyle[style] = _this.getLastToStyle(style, i);
				}
			}
		});
	};
	getLastToStyle(style, i) {
		var fromStyle = '';
		var k = Math.max(i - 1, 0);
		for(var j = k; j >= 0; j--) {
			var motion = this.motions[j];
			if(motion.fromStyle[style] !== undefined) {
				fromStyle = motion.toStyle[style];
				break;
			}
		}
		if(fromStyle === '') fromStyle = this.$element.css(style);

		return fromStyle;
	};


	setStart() {
		var _this = this;
		this.motions.forEach(function(motion, i) {
			if(motion.start === undefined) {
				motion.start = _this.getLastStart(i);
			}
		});
	};
	getLastStart(i) {
		var start = '';
		var k = Math.max(i - 1, 0);
		for(var j = k; j >= 0; j--) {
			var motion = this.motions[j];
			if(motion.start !== undefined) {
				start = motion.end;
				break;
			}
		}

		return start;
	};
}