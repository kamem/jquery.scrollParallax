import {Status} from './scrollParallax/ScrollStatus';
import {ScrollTiming} from './scrollParallax/ScrollTiming';
import {ScrollFit} from './scrollParallax/ScrollFit';
import {StyleValue} from './scrollParallax/Util';
import {easing} from './scrollParallax/Util';
import {scrollPositionStringToNumber} from './scrollParallax/Util';

/* all parallax default options */
$.parallax = (ops) => {
	Status.setVal(ops);

	if(Status.debugMode) $('body').append('<p class="parallax-debug" style="border: 1px solid red;position: absolute;' + (Status.direction === 'y' ? 'width' : 'height') + ': 100%;' + (Status.direction === 'y' ? 'left' : 'top') + ': 0;' + '"></p>');
};

/* timing */
const Timing = new ScrollTiming();

/* timing default options */
$.parallaxTiming = (ops) => {
	Timing.setVal(ops);
};

$.fn.parallaxTiming = function(ops) {
	const $element = this;
	const toggle = ops.toggle || [];
	const fixScrollPosition = ops.fixScrollPosition || null;

	var isOver;
	Status.functions.push(() => {
		const fixLine = fixScrollPosition ? fixScrollPosition : $element.offset()[Status.directionPositionName.toLocaleLowerCase()];
		const timingLinePercent = ops.timingLinePercent || Timing.timingLinePercent;
		const timingLine = Status.scrollPosition + (Status.stageSize / (100 / timingLinePercent));

		if(timingLine >= fixLine ? !isOver : isOver) {
			isOver = timingLine >= fixLine;
			const name = isOver ? 'start' : 'end';

			if(ops[name]) {
				ops[name]({target: $element, isOver: isOver})
			} else if(toggle.length > 0) {
				ops.toggle[isOver ? 0 : 1]({target: $element, isOver: isOver});
			}
		}

		if(Status.debugMode) $('body > .parallax-debug').css(Status.directionPositionName.toLocaleLowerCase(), timingLine);
	});
};

/* speed */
$.fn.parallaxSpeed = function(ops) {
	const $element = this;

	const style = ops.style || 'top';
	const options = $.extend({
		speed: 2,
		min: -999999,
		max: 999999,
		fixStyleValue: String($element.css(style)),
		fixScrollPosition: 0
	}, ops);

	const styles = typeof style === 'object' ? style : [style];
	const speeds = typeof options.speed === 'object' ? options.speed : [options.speed];
	const mins = typeof options.min === 'object' ? options.min : [options.min];
	const maxs = typeof options.max === 'object' ? options.max : [options.max];
	let fixStyleValues = [];
	styles.forEach((name, i) => {
		fixStyleValues[i] = String($element.css(name));
	});

	Status.functions.push(() => {
		styles.forEach((style, i) => {
			const speed = speeds[i] || options.speed;
			const min = mins[i] || options.min;
			const max = maxs[i] || options.max;
			const fixScrollPosition = scrollPositionStringToNumber(options.fixScrollPosition);
			const fixStyleValue = fixStyleValues[i] ||options.fixStyleValue;

			const styleVal = new StyleValue(fixStyleValue);
			const styleValues = styleVal.getValueAry();

			let values = [];
			styleValues.forEach((value, j) => {
				const valuesMin = typeof min === 'object' ? min[j] : min;
				const valuesMax = typeof max === 'object' ? max[j] : max;
				const valuesSpeed = typeof speed === 'object' ? speed[j] : speed;

				values[j] = -Number(-Status.scrollPosition / valuesSpeed + fixScrollPosition / valuesSpeed) + value;
				values[j] = Number(values[j] < valuesMin ? valuesMin : values[j] > valuesMax ? valuesMax : values[j]);

				if(style.indexOf('background') >= 0 && fixStyleValue.indexOf('rgb') >= 0) values[j] = values[j] >= 1 ? parseInt(values[j]) : values[j] < 0 ? 0 : values[j];
			});

			$element.css(
					style,
					styleVal.setValue(values)
			);
		});
	});
};

/* fit */
$.fn.parallaxFit = function(ops) {
	const Fit = new ScrollFit(this);

	if(ops['end'] !== undefined) {
		Fit.setMotions({
			start: ops['start'],
			end: ops['end'],
			fromStyle: ops['fromStyle'],
			toStyle:  ops['toStyle'],
			easing: ops['easing']
		});
	}
	for(let i = 1; ops['motion' + i + 'End'] !== undefined; i++) {
		const motion = 'motion' + i;
		Fit.setMotions({
			start: ops[motion + 'Start'],
			end: ops[motion + 'End'],
			fromStyle: ops[motion + 'FromStyle'],
			toStyle:  ops[motion + 'ToStyle'],
			easing: ops[motion + 'Easing']
		});
	}
	Fit.setFromStyle();
	Fit.setStart();

	Status.functions.push(function () {
		Fit.setRangeMotions();
		Fit.setDefaultStyles();

		Fit.rangeMotions.forEach(function (motion, j) {
			const start = scrollPositionStringToNumber(motion.start);
			const end = scrollPositionStringToNumber(motion.end);
			const isInRange = start <  Status.scrollPosition && Status.scrollPosition < end;
			const range = end - start;
			const scrollPercent = isInRange ? (Status.scrollPosition - start) / range :
					(Status.scrollPosition > start) ? 1 :
					(Status.scrollPosition < end) ? 0 : '';

			for(let style in motion.fromStyle) {

				const from = new StyleValue(String(motion.fromStyle[style]));
				const to = new StyleValue(String(motion.toStyle[style]));
				const fromStyles = from.getValueAry();
				const toStyles = to.getValueAry();
				const values = [];

				for(let i = 0;i < fromStyles.length;i++) {
					const abs = Math.abs(fromStyles[i] - toStyles[i]);
					const fixAbs = fromStyles[i] < toStyles[i] ? abs : -abs;

					values[i] = easing[motion.easing](scrollPercent, fromStyles[i], fixAbs, 1);

					if(style.indexOf('background') >= 0) values[i] = values[i] >= 1 ? parseInt(values[i]) : values[i] < 0 ? 0 : values[i];
				}

				Fit.styleValues[style] = from.setValue(values);
			}
		});
		Fit.$element.css(Fit.styleValues);
	});
};

/* event */
Status.$stage.on('scroll resize load', () => {
	Status.update();

	Status.functions.forEach((func) => {
		func();
	});
});

const scrollStop = () => {Status.$stage.queue([]).stop();};
global.addEventListener('DOMMouseScroll', scrollStop, false);
global.onmousewheel = document.onmousewheel = scrollStop;