import {Status} from './scrollParallax/ScrollStatus';
import {ScrollTiming} from './scrollParallax/ScrollTiming';
import {ScrollFit} from './scrollParallax/ScrollFit';
import {StyleValue} from './scrollParallax/Util';
import {easing} from './scrollParallax/Util';
import {scrollPositionStringToNumber} from './scrollParallax/Util';

/* all parallax default options */
$.parallax = function(ops) {
	Status.setVal(ops);

	if(Status.debugMode) $('body').append('<p class="parallax-debug" style="border: 1px solid red;position: absolute;' + (Status.direction === 'y' ? 'width' : 'height') + ': 100%;' + (Status.direction === 'y' ? 'left' : 'top') + ': 0;' + '"></p>');
};

/* timing */
var Timing = new ScrollTiming();

/* timing default options */
$.parallaxTiming = function(ops) {
	Timing.setVal(ops);
};

$.fn.parallaxTiming = function(ops) {
	var $element = this;
	var toggle = ops.toggle || [];
	var fixScrollPosition = ops.fixScrollPosition || null;

	var isOver;
	Status.functions.push(function() {
		var fixLine = fixScrollPosition ? fixScrollPosition : $element.offset()[Status.directionPositionName.toLocaleLowerCase()];
		var timingLinePercent = ops.timingLinePercent || Timing.timingLinePercent;
		var timingLine = Status.scrollPosition + (Status.stageSize / (100 / timingLinePercent));

		if(timingLine >= fixLine ? !isOver : isOver) {
			isOver = timingLine >= fixLine;
			var name = [isOver ? 'start' : 'end'];
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
	var $element = this;

	var style = ops.style || 'top';
	var options = $.extend({
		speed: 2,
		min: -999999,
		max: 999999,
		fixStyleValue: String($element.css(style)),
		fixScrollPosition: 0
	}, ops);

	var styles = typeof style === 'object' ? style : [style];
	var speeds = typeof options.speed === 'object' ? options.speed : [options.speed];
	var mins = typeof options.min === 'object' ? options.min : [options.min];
	var maxs = typeof options.max === 'object' ? options.max : [options.max];
	var fixStyleValues = [];
	styles.forEach(function(name, i) {
		fixStyleValues[i] = String($element.css(name));
	});

	Status.functions.push(function () {
		styles.forEach(function(style, i) {
			var speed = speeds[i] || options.speed;
			var min = mins[i] || options.min;
			var max = maxs[i] || options.max;
			var fixScrollPosition = scrollPositionStringToNumber(options.fixScrollPosition);
			var fixStyleValue = fixStyleValues[i] ||options.fixStyleValue;

			var styleVal = new StyleValue(fixStyleValue);
			var styleValues = styleVal.getValueAry();

			var values = [];
			styleValues.forEach(function(value, j) {
				var valuesMin = typeof min === 'object' ? min[j] : min;
				var valuesMax = typeof max === 'object' ? max[j] : max;
				var valuesSpeed = typeof speed === 'object' ? speed[j] : speed;

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
	var Fit = new ScrollFit(this);

	if(ops['end'] !== undefined) {
		Fit.setMotions({
			start: ops['start'],
			end: ops['end'],
			fromStyle: ops['fromStyle'],
			toStyle:  ops['toStyle'],
			easing: ops['easing']
		});
	}
	for(var i = 1; ops['motion' + i + 'End'] !== undefined; i++) {
		var motion = 'motion' + i;
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
			var start = scrollPositionStringToNumber(motion.start);
			var end = scrollPositionStringToNumber(motion.end);
			var isInRange = start <  Status.scrollPosition && Status.scrollPosition < end;
			var range = end - start;
			var scrollPercent = isInRange ? (Status.scrollPosition - start) / range :
					(Status.scrollPosition > start) ? 1 :
					(Status.scrollPosition < end) ? 0 : '';

			for(var style in motion.fromStyle) {

				var from = new StyleValue(String(motion.fromStyle[style]));
				var to = new StyleValue(String(motion.toStyle[style]));
				var fromStyles = from.getValueAry();
				var toStyles = to.getValueAry();
				var values = [];

				for(var i = 0;i < fromStyles.length;i++) {
					var abs = Math.abs(fromStyles[i] - toStyles[i]);
					var fixAbs = fromStyles[i] < toStyles[i] ? abs : -abs;

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
Status.$stage.on('scroll resize load', function () {
	Status.update();

	Status.functions.forEach(function(func) {
		func();
	});
});

var scrollStop = function(){Status.$stage.queue([]).stop();};
global.addEventListener('DOMMouseScroll', scrollStop, false);
global.onmousewheel = document.onmousewheel = scrollStop;