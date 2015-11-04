/*!
 * jquery.scrollParallax (2015-11-3)
 * Implementing parallax effect by utilizing various events of scroll.
 * https://github.com/kamem/jquery.scrollParallax.git
 * (c) 2015 kamem (@kamem)
 *
 * @version 0.1.0
 * @license Released under the MIT license
 * @author kamem
 */
(function (global, factory) {
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], function() {factory($, global)});
	} else if (typeof exports !== 'undefined') {
		module.exports = factory(require('jquery'), global);
	} else {
		factory($, global);
	}
} (this, function ($, global) {

	/* common status */
	var Status = function(ops) {
		this.$stage = $(global);
		this.direction = 'y';

		this.functions = [];

		this.debugMode = false;

		this.setDirectionInfo();
	};
	Status.prototype.setVal = function(ops) {
		this.$stage = ops.stage ? $(ops.stage) : $(global);
		this.direction = ops.direction || this.direction;
		this.debugMode = ops.debugMode || this.debugMode;
		this.setDirectionInfo();
	};
	Status.prototype.update = function() {
		var scroll = 'scroll' + this.directionPositionName;
		this.scrollPosition = this.$stage[scroll]();

		var innerWidth = global['inner' + this.stageSizeName];
		this.stageSize = innerWidth ? innerWidth : document.documentElement['client' + this.stageSizeName];
	};
	Status.prototype.setDirectionInfo = function(){
		this.directionPositionName = this.direction === 'y' ? 'Top' : 'Left';
		this.stageSizeName = this.direction === 'y' ? 'Height' : 'Width';
	};
	var status = new Status();

	/* all parallax default options */
	$.parallax = function(ops) {
		status.setVal(ops);

		if(status.debugMode) $('body').append('<p class="parallax-debug" style="border: 1px solid red;position: absolute;' + (status.direction === 'y' ? 'width' : 'height') + ': 100%;' + (status.direction === 'y' ? 'left' : 'top') + ': 0;' + '"></p>');
	};

	/* timing */
	var ScrollTiming = function(ops) {
		this.timingLinePercent = 50;
	};
	ScrollTiming.prototype.setVal = function(ops) {
		this.timingLinePercent = ops.timingLinePercent || this.timingLinePercent;
	};
	var timing = new ScrollTiming();

	/* timing default options */
	$.parallaxTiming = function(ops) {
		timing.setVal(ops);
	};

	$.fn.parallaxTiming = function(ops) {
		var $element = this;
		var toggle = ops.toggle || [];
		var fixScrollPosition = ops.fixScrollPosition || null;

		var isOver;
		status.functions.push(function() {
			var fixLine = fixScrollPosition ? fixScrollPosition : $element.offset()[status.directionPositionName.toLocaleLowerCase()];
			var timingLinePercent = ops.timingLinePercent || timing.timingLinePercent;
			var timingLine = status.scrollPosition + (status.stageSize / (100 / timingLinePercent));

			if(timingLine >= fixLine ? !isOver : isOver) {
				isOver = timingLine >= fixLine;
				var name = [isOver ? 'start' : 'end'];
				if(ops[name]) {
					ops[name]({target: $element, isOver: isOver})
				} else if(toggle.length > 0) {
					ops.toggle[isOver ? 0 : 1]({target: $element, isOver: isOver});
				}
			}

			if(status.debugMode) $('body > .parallax-debug').css(status.directionPositionName.toLocaleLowerCase(), timingLine);
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
			fixPosition: String($element.css(style)),
			fixScrollPosition: 0
		}, ops);

		var styles = typeof style === 'object' ? style : [style];
		var speeds = typeof options.speed === 'object' ? options.speed : [options.speed];
		var mins = typeof options.min === 'object' ? options.min : [options.min];
		var maxs = typeof options.max === 'object' ? options.max : [options.max];
		var fixPositions = [];
		styles.forEach(function(name, i) {
			fixPositions[i] = String($element.css(name));
		});

		status.functions.push(function () {
			styles.forEach(function(style, i) {
				var speed = speeds[i] || options.speed;
				var min = mins[i] || options.min;
				var max = maxs[i] || options.max;
				var fixScrollPosition = scrollPositionStringToNumber(options.fixScrollPosition);
				var fixPosition = fixPositions[i] ||options.fixPosition;

				var styleVal = new styleValue(fixPosition);
				var styleValues = styleVal.getValueAry();
				var values = [];
				styleValues.forEach(function(value, j) {
					var valuesMin = typeof min === 'object' ? min[j] : min;
					var valuesMax = typeof max === 'object' ? max[j] : max;
					var valuesSpeed = typeof speed === 'object' ? speed[j] : speed;

					values[j] = -Number(-status.scrollPosition / valuesSpeed + fixScrollPosition / valuesSpeed) + value;
					values[j] = Number(values[j] < valuesMin ? valuesMin : values[j] > valuesMax ? valuesMax : values[j]);

					if(style.indexOf('background') >= 0) values[j] = values[j] >= 1 ? parseInt(values[j]) : values[j] < 0 ? 0 : values[j];
				});

				$element.css(
						style,
						styleVal.setValue(values)
				);
			});
		});
	};

	/* fit */
	var ScrollFit = function($element) {
		this.$element = $element;
		this.styleValues = {};
		this.motions = [];
		this.rangeMotions = [];
	};

	ScrollFit.prototype.setMotions = function(motion) {
		var ops = $.extend({
			easing: 'linear'
		}, motion);
		this.motions.push(ops);
	};

	ScrollFit.prototype.setRangeMotions = function() {
		var range = [];
		this.motions.forEach(function (motion) {
			var start = scrollPositionStringToNumber(motion.start);
			var isMotion = start <= status.scrollPosition;
			if(isMotion) range.push(motion);
		});

		this.rangeMotions = range;
	};

	ScrollFit.prototype.setDefaultStyles = function () {
		var defaultStyles = {};
		this.motions.forEach(function (motion) {
			for(var style in motion.fromStyle) {
				if(defaultStyles[style] === undefined) defaultStyles[style] = motion.fromStyle[style];
			}
		});

		this.styleValues = defaultStyles;
	};

	ScrollFit.prototype.setFromStyle = function () {
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
	ScrollFit.prototype.getLastToStyle = function (style, i) {
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


	ScrollFit.prototype.setStart = function () {
		var _this = this;
		this.motions.forEach(function(motion, i) {
			if(motion.start === undefined) {
				motion.start = _this.getLastStart(i);
			}
		});
	};
	ScrollFit.prototype.getLastStart = function (i) {
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

	$.fn.parallaxFit = function(ops) {
		var scrollFit = new ScrollFit(this);

		if(ops['end'] !== undefined) {
			scrollFit.setMotions({
				start: ops['start'],
				end: ops['end'],
				fromStyle: ops['fromStyle'],
				toStyle:  ops['toStyle'],
				easing: ops['easing']
			});
		}
		for(var i = 1; ops['motion' + i + 'End'] !== undefined; i++) {
			var motion = 'motion' + i;
			scrollFit.setMotions({
				start: ops[motion + 'Start'],
				end: ops[motion + 'End'],
				fromStyle: ops[motion + 'FromStyle'],
				toStyle:  ops[motion + 'ToStyle'],
				easing: ops[motion + 'Easing']
			});
		}
		scrollFit.setFromStyle();
		scrollFit.setStart();

		status.functions.push(function () {
			scrollFit.setRangeMotions();
			scrollFit.setDefaultStyles();

			scrollFit.rangeMotions.forEach(function (motion, j) {
				var start = scrollPositionStringToNumber(motion.start);
				var end = scrollPositionStringToNumber(motion.end);
				var isInRange = start <  status.scrollPosition && status.scrollPosition < end;
				var range = end - start;
				var scrollPercent = isInRange ? (status.scrollPosition - start) / range :
						(status.scrollPosition > start) ? 1 :
						(status.scrollPosition < end) ? 0 : '';

				for(var style in motion.fromStyle) {

					var from = new styleValue(String(motion.fromStyle[style]));
					var to = new styleValue(String(motion.toStyle[style]));
					var fromStyles = from.getValueAry();
					var toStyles = to.getValueAry();
					var values = [];

					for(var i = 0;i < fromStyles.length;i++) {
						var abs = Math.abs(fromStyles[i] - toStyles[i]);
						var fixAbs = fromStyles[i] < toStyles[i] ? abs : -abs;

						values[i] = easing[motion.easing](scrollPercent, fromStyles[i], fixAbs, 1);

						if(style.indexOf('background') >= 0) values[i] = values[i] >= 1 ? parseInt(values[i]) : values[i] < 0 ? 0 : values[i];
					}

					scrollFit.styleValues[style] = from.setValue(values);
				}
			});
			scrollFit.$element.css(scrollFit.styleValues);
		});
	};

	/* event */
	status.$stage.on('scroll resize load', function () {
		status.update();

		status.functions.forEach(function(func) {
			func();
		});
	});

	var scrollStop = function(){status.$stage.queue([]).stop();};
	global.addEventListener('DOMMouseScroll', scrollStop, false);
	global.onmousewheel = document.onmousewheel = scrollStop;


	var scrollPositionStringToNumber = function(motionStart){
		if(typeof motionStart === 'string') {
			var i = motionStart.split(',');
			var value = $(i[0]).offset()[status.directionPositionName.toLocaleLowerCase()];
			if(i[1]) value += parseInt(i[1]);
		} else {
			var value = motionStart;
		}

		return value;
	};

	var styleValue = function(str) {
		this.myRegExp = /(\d+(\.\d+)?)(deg|\)|px|em|rem|%|$|\,)/g;
		this.colorStringRegExp = /red|blue|green|yellow/g;
		this.colorRegExp = /#[0-9a-fA-F]{3,6}/g;
		this.value = this.changeColor(str);
	};

	styleValue.prototype.changeColor = function(str) {
		var colors = {red: 'FF0000', blue: '0000FF', yellow: 'FFFF00', green: '008000'};
		var c = str.replace(this.colorStringRegExp, function(color) {
			return '#' + colors[color]
		});
		return c.replace(this.colorRegExp, function(color) {
			if(color.length === 4) {
				var firstNum  =  color.slice(1,2) + color.slice(1,2);
				var secondNum =  color.slice(2,3) + color.slice(2,3);
				var thirdNum  =  color.slice(3,4) + color.slice(3,4);
				color = firstNum + secondNum + thirdNum;
			}
			var r = parseInt((color.substring(1)).substring(0,2),16);
			var g = parseInt((color.substring(1)).substring(2,4),16);
			var b = parseInt((color.substring(1)).substring(4,6),16);
			return 'rgb(' + r + ',' + g + ',' + b + ')';
		});
	};
	styleValue.prototype.getValueAry = function() {
		var valueRegAry;
		var valueAry = [];
		while ((valueRegAry = this.myRegExp.exec(this.value)) !== null) {
			valueAry.push(Number(valueRegAry[1]));
		}
		return valueAry;
	};
	styleValue.prototype.setValue = function(ary) {
		var i = 0;
		return this.value.replace(this.myRegExp, function(str) {
			return str.replace(/\d+(\.\d+)?/, ary[i++]);
		});
	};


	var easing = {
		linear : function(t,b,c,d){return b+c*t},
		easeInQuad:function(i,b,c,d){return c*(i/=d)*i+b;},
		easeOutQuad:function(i,b,c,d){return -c*(i/=d)*(i-2)+b;},
		easeInOutQuad:function(i,b,c,d){if((i/=d/2)<1){return c/2*i*i+b;}return -c/2*((--i)*(i-2)-1)+b;},
		easeInCubic:function(i,b,c,d){return c*(i/=d)*i*i+b;},
		easeOutCubic:function(i,b,c,d){return c*((i=i/d-1)*i*i+1)+b;},
		easeInOutCubic:function(i,b,c,d){if((i/=d/2)<1){return c/2*i*i*i+b;}return c/2*((i-=2)*i*i+2)+b;},
		easeInQuart:function(i,b,c,d){return c*(i/=d)*i*i*i+b;},
		easeOutQuart:function(i,b,c,d){return -c*((i=i/d-1)*i*i*i-1)+b;},
		easeInOutQuart:function(i,b,c,d){if((i/=d/2)<1){return c/2*i*i*i*i+b;}return -c/2*((i-=2)*i*i*i-2)+b;},
		easeInQuint:function(i,b,c,d){return c*(i/=d)*i*i*i*i+b;},
		easeOutQuint:function(i,b,c,d){return c*((i=i/d-1)*i*i*i*i+1)+b;},
		easeInOutQuint:function(i,b,c,d){if((i/=d/2)<1){return c/2*i*i*i*i*i+b;}return c/2*((i-=2)*i*i*i*i+2)+b;},
		easeInSine:function(i,b,c,d){return -c*Math.cos(i/d*(Math.PI/2))+c+b;},
		easeOutSine:function(i,b,c,d){return c*Math.sin(i/d*(Math.PI/2))+b;},
		easeInOutSine:function(i,b,c,d){return -c/2*(Math.cos(Math.PI*i/d)-1)+b;},
		easeInExpo:function(i,b,c,d){return(i==0)?b:c*Math.pow(2,10*(i/d-1))+b;},
		easeOutExpo:function(i,b,c,d){return(i==d)?b+c:c*(-Math.pow(2,-10*i/d)+1)+b;},
		easeInOutExpo:function(i,b,c,d){if(i==0){return b;}if(i==d){return b+c;}if((i/=d/2)<1){return c/2*Math.pow(2,10*(i-1))+b;}return c/2*(-Math.pow(2,-10*--i)+2)+b;},
		easeInCirc:function(i,b,c,d){return -c*(Math.sqrt(1-(i/=d)*i)-1)+b;},
		easeOutCirc:function(i,b,c,d){return c*Math.sqrt(1-(i=i/d-1)*i)+b;},
		easeInOutCirc:function(i,b,c,d){if((i/=d/2)<1){return -c/2*(Math.sqrt(1-i*i)-1)+b;}return c/2*(Math.sqrt(1-(i-=2)*i)+1)+b;},
		easeInElastic:function(m,p,a,b){var d=1.70158;var c=0;var n=a;if(m==0){return p;}if((m/=b)==1){return p+a;}if(!c){c=b*0.3;}if(n<Math.abs(a)){n=a;var d=c/4;}else{var d=c/(2*Math.PI)*Math.asin(a/n);}return -(n*Math.pow(2,10*(m-=1))*Math.sin((m*b-d)*(2*Math.PI)/c))+p;},
		easeOutElastic:function(m,p,a,b){var d=1.70158;var c=0;var n=a;if(m==0){return p;}if((m/=b)==1){return p+a;}if(!c){c=b*0.3;}if(n<Math.abs(a)){n=a;var d=c/4;}else{var d=c/(2*Math.PI)*Math.asin(a/n);}return n*Math.pow(2,-10*m)*Math.sin((m*b-d)*(2*Math.PI)/c)+a+p;},
		easeInOutElastic:function(m,p,a,b){var d=1.70158;var c=0;var n=a;if(m==0){return p;}if((m/=b/2)==2){return p+a;}if(!c){c=b*(0.3*1.5);}if(n<Math.abs(a)){n=a;var d=c/4;}else{var d=c/(2*Math.PI)*Math.asin(a/n);}if(m<1){return -0.5*(n*Math.pow(2,10*(m-=1))*Math.sin((m*b-d)*(2*Math.PI)/c))+p;}return n*Math.pow(2,-10*(m-=1))*Math.sin((m*b-d)*(2*Math.PI)/c)*0.5+a+p;},
		easeInBack:function(k,b,c,d,j){if(j==undefined){j=1.70158;}return c*(k/=d)*k*((j+1)*k-j)+b;},
		easeOutBack:function(k,b,c,d,j){if(j==undefined){j=1.70158;}return c*((k=k/d-1)*k*((j+1)*k+j)+1)+b;},
		easeInOutBack:function(k,b,c,d,j){if(j==undefined){j=1.70158;}if((k/=d/2)<1){return c/2*(k*k*(((j*=(1.525))+1)*k-j))+b;}return c/2*((k-=2)*k*(((j*=(1.525))+1)*k+j)+2)+b;},
		easeInBounce:function(i,b,c,d){return c-easing.easeOutBounce(d-i,0,c,d)+b;},
		easeOutBounce:function(i,b,c,d){if((i/=d)<(1/2.75)){return c*(7.5625*i*i)+b;}else{if(i<(2/2.75)){return c*(7.5625*(i-=(1.5/2.75))*i+0.75)+b;}else{if(i<(2.5/2.75)){return c*(7.5625*(i-=(2.25/2.75))*i+0.9375)+b;}else{return c*(7.5625*(i-=(2.625/2.75))*i+0.984375)+b;}}}},
		easeInOutBounce:function(i,b,c,d){if(i<d/2){return easing.easeInBounce(i*2,0,c,d)*0.5+b;}return easing.easeOutBounce(i*2-d,0,c,d)*0.5+c*0.5+b;}
	};
}));