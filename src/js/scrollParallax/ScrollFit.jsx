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
		let ops = $.extend({
			easing: 'linear'
		}, motion);
		this.motions.push(ops);
	};

	setRangeMotions() {
		let range = [];
		this.motions.forEach((motion) => {
			const start = scrollPositionStringToNumber(motion.start);
			const isMotion = start <= Status.scrollPosition;
			if(isMotion) range.push(motion);
		});

		this.rangeMotions = range;
	};

	setDefaultStyles() {
		let defaultStyles = {};
		this.motions.forEach((motion) => {
			for(let style in motion.fromStyle) {
				if(defaultStyles[style] === undefined) defaultStyles[style] = motion.fromStyle[style];
			}
		});

		this.styleValues = defaultStyles;
	};

	setFromStyle() {
		this.motions.forEach((motion, i) => {
			for(let style in motion.toStyle) {
				if(motion.fromStyle === undefined) motion.fromStyle = {};
				if(motion.fromStyle[style] === undefined) {
					motion.fromStyle[style] = this.getLastToStyle(style, i);
				}
			}
		});
	};
	getLastToStyle(style, i) {
		let fromStyle = '';
		const k = Math.max(i - 1, 0);
		for(let j = k; j >= 0; j--) {
			const motion = this.motions[j];
			if(motion.fromStyle[style] !== undefined) {
				fromStyle = motion.toStyle[style];
				break;
			}
		}
		if(fromStyle === '') fromStyle = this.$element.css(style);

		return fromStyle;
	};


	setStart() {
		this.motions.forEach((motion, i) => {
			if(motion.start === undefined) {
				motion.start = this.getLastStart(i);
			}
		});
	};
	getLastStart(i) {
		let start = '';
		const k = Math.max(i - 1, 0);
		for(let j = k; j >= 0; j--) {
			const motion = this.motions[j];
			if(motion.start !== undefined) {
				start = motion.end;
				break;
			}
		}

		return start;
	};
}