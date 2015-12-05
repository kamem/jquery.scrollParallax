/*!
 * jquery.scrollParallax (2015-12-5)
 * Implementing parallax effect by utilizing various events of scroll.
 * https://github.com/kamem/jquery.scrollParallax.git
 * (c) 2015 kamem (@kamem)
 *
 * @version 0.1.1
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
;(function() {
var scrollParallax_ScrollStatus = {}, scrollParallax_ScrollTiming = {}, scrollParallax_Util = {}, scrollParallax_ScrollFit = {}, jqueryscrollParallaxjs;
scrollParallax_ScrollStatus = function (exports) {
  Object.defineProperty(exports, '__esModule', { value: true });
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }
  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ('value' in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    return function (Constructor, protoProps, staticProps) {
      if (protoProps)
        defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();
  var ScrollStatus = function () {
    function ScrollStatus() {
      _classCallCheck(this, ScrollStatus);
      this.$stage = $(global);
      this.direction = 'y';
      this.functions = [];
      this.debugMode = false;
      this.setDirectionInfo();
    }
    _createClass(ScrollStatus, [
      {
        key: 'setVal',
        value: function setVal(ops) {
          this.$stage = ops.stage ? $(ops.stage) : $(global);
          this.direction = ops.direction || this.direction;
          this.debugMode = ops.debugMode || this.debugMode;
          this.setDirectionInfo();
        }
      },
      {
        key: 'update',
        value: function update() {
          var scroll = 'scroll' + this.directionPositionName;
          this.scrollPosition = this.$stage[scroll]();
          var innerWidth = global['inner' + this.stageSizeName];
          this.stageSize = innerWidth ? innerWidth : document.documentElement['client' + this.stageSizeName];
        }
      },
      {
        key: 'setDirectionInfo',
        value: function setDirectionInfo() {
          this.directionPositionName = this.direction === 'y' ? 'Top' : 'Left';
          this.stageSizeName = this.direction === 'y' ? 'Height' : 'Width';
        }
      }
    ]);
    return ScrollStatus;
  }();
  var Status = exports.Status = new ScrollStatus();
  return exports;
}(scrollParallax_ScrollStatus);
scrollParallax_ScrollTiming = function (exports) {
  Object.defineProperty(exports, '__esModule', { value: true });
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }
  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ('value' in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    return function (Constructor, protoProps, staticProps) {
      if (protoProps)
        defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();
  var ScrollTiming = exports.ScrollTiming = function () {
    function ScrollTiming() {
      _classCallCheck(this, ScrollTiming);
      this.timingLinePercent = 50;
    }
    _createClass(ScrollTiming, [{
        key: 'setVal',
        value: function setVal(ops) {
          this.timingLinePercent = ops.timingLinePercent || this.timingLinePercent;
        }
      }]);
    return ScrollTiming;
  }();
  return exports;
}(scrollParallax_ScrollTiming);
scrollParallax_Util = function (exports, _ScrollStatus) {
  Object.defineProperty(exports, '__esModule', { value: true });
  exports.easing = exports.scrollPositionStringToNumber = exports.StyleValue = undefined;
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }
  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ('value' in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    return function (Constructor, protoProps, staticProps) {
      if (protoProps)
        defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();
  var StyleValue = exports.StyleValue = function () {
    function StyleValue(styleValue) {
      _classCallCheck(this, StyleValue);
      this.myRegExp = /(\d+(\.\d+)?)(deg|\)|px|em|rem|%|$|\,)/g;
      this.colorStringRegExp = /red|blue|green|yellow/g;
      this.colorRegExp = /#[0-9a-fA-F]{3,6}/g;
      this.value = this.changeColor(styleValue);
    }
    _createClass(StyleValue, [
      {
        key: 'changeColor',
        value: function changeColor(styleValue) {
          var colors = {
            red: 'FF0000',
            blue: '0000FF',
            yellow: 'FFFF00',
            green: '008000'
          };
          var c = styleValue.replace(this.colorStringRegExp, function (color) {
            return '#' + colors[color];
          });
          return c.replace(this.colorRegExp, function (color) {
            if (color.length === 4) {
              var firstNum = color.slice(1, 2) + color.slice(1, 2);
              var secondNum = color.slice(2, 3) + color.slice(2, 3);
              var thirdNum = color.slice(3, 4) + color.slice(3, 4);
              color = firstNum + secondNum + thirdNum;
            }
            var r = parseInt(color.substring(1).substring(0, 2), 16);
            var g = parseInt(color.substring(1).substring(2, 4), 16);
            var b = parseInt(color.substring(1).substring(4, 6), 16);
            return 'rgb(' + r + ',' + g + ',' + b + ')';
          });
        }
      },
      {
        key: 'getValueAry',
        value: function getValueAry() {
          var valueRegAry;
          var valueAry = [];
          while ((valueRegAry = this.myRegExp.exec(this.value)) !== null) {
            valueAry.push(Number(valueRegAry[1]));
          }
          return valueAry;
        }
      },
      {
        key: 'setValue',
        value: function setValue(ary) {
          var i = 0;
          return this.value.replace(this.myRegExp, function (styleValue) {
            return styleValue.replace(/\d+(\.\d+)?/, ary[i++]);
          });
        }
      }
    ]);
    return StyleValue;
  }();
  var scrollPositionStringToNumber = exports.scrollPositionStringToNumber = function scrollPositionStringToNumber(motionStart) {
    if (typeof motionStart === 'string') {
      var i = motionStart.split(',');
      var value = $(i[0]).offset()[_ScrollStatus.Status.directionPositionName.toLocaleLowerCase()];
      if (i[1])
        value += parseInt(i[1]);
    } else {
      var value = motionStart;
    }
    return value;
  };
  var easing = exports.easing = {
    linear: function linear(t, b, c, d) {
      return b + c * t;
    },
    easeInQuad: function easeInQuad(i, b, c, d) {
      return c * (i /= d) * i + b;
    },
    easeOutQuad: function easeOutQuad(i, b, c, d) {
      return -c * (i /= d) * (i - 2) + b;
    },
    easeInOutQuad: function easeInOutQuad(i, b, c, d) {
      if ((i /= d / 2) < 1) {
        return c / 2 * i * i + b;
      }
      return -c / 2 * (--i * (i - 2) - 1) + b;
    },
    easeInCubic: function easeInCubic(i, b, c, d) {
      return c * (i /= d) * i * i + b;
    },
    easeOutCubic: function easeOutCubic(i, b, c, d) {
      return c * ((i = i / d - 1) * i * i + 1) + b;
    },
    easeInOutCubic: function easeInOutCubic(i, b, c, d) {
      if ((i /= d / 2) < 1) {
        return c / 2 * i * i * i + b;
      }
      return c / 2 * ((i -= 2) * i * i + 2) + b;
    },
    easeInQuart: function easeInQuart(i, b, c, d) {
      return c * (i /= d) * i * i * i + b;
    },
    easeOutQuart: function easeOutQuart(i, b, c, d) {
      return -c * ((i = i / d - 1) * i * i * i - 1) + b;
    },
    easeInOutQuart: function easeInOutQuart(i, b, c, d) {
      if ((i /= d / 2) < 1) {
        return c / 2 * i * i * i * i + b;
      }
      return -c / 2 * ((i -= 2) * i * i * i - 2) + b;
    },
    easeInQuint: function easeInQuint(i, b, c, d) {
      return c * (i /= d) * i * i * i * i + b;
    },
    easeOutQuint: function easeOutQuint(i, b, c, d) {
      return c * ((i = i / d - 1) * i * i * i * i + 1) + b;
    },
    easeInOutQuint: function easeInOutQuint(i, b, c, d) {
      if ((i /= d / 2) < 1) {
        return c / 2 * i * i * i * i * i + b;
      }
      return c / 2 * ((i -= 2) * i * i * i * i + 2) + b;
    },
    easeInSine: function easeInSine(i, b, c, d) {
      return -c * Math.cos(i / d * (Math.PI / 2)) + c + b;
    },
    easeOutSine: function easeOutSine(i, b, c, d) {
      return c * Math.sin(i / d * (Math.PI / 2)) + b;
    },
    easeInOutSine: function easeInOutSine(i, b, c, d) {
      return -c / 2 * (Math.cos(Math.PI * i / d) - 1) + b;
    },
    easeInExpo: function easeInExpo(i, b, c, d) {
      return i == 0 ? b : c * Math.pow(2, 10 * (i / d - 1)) + b;
    },
    easeOutExpo: function easeOutExpo(i, b, c, d) {
      return i == d ? b + c : c * (-Math.pow(2, -10 * i / d) + 1) + b;
    },
    easeInOutExpo: function easeInOutExpo(i, b, c, d) {
      if (i == 0) {
        return b;
      }
      if (i == d) {
        return b + c;
      }
      if ((i /= d / 2) < 1) {
        return c / 2 * Math.pow(2, 10 * (i - 1)) + b;
      }
      return c / 2 * (-Math.pow(2, -10 * --i) + 2) + b;
    },
    easeInCirc: function easeInCirc(i, b, c, d) {
      return -c * (Math.sqrt(1 - (i /= d) * i) - 1) + b;
    },
    easeOutCirc: function easeOutCirc(i, b, c, d) {
      return c * Math.sqrt(1 - (i = i / d - 1) * i) + b;
    },
    easeInOutCirc: function easeInOutCirc(i, b, c, d) {
      if ((i /= d / 2) < 1) {
        return -c / 2 * (Math.sqrt(1 - i * i) - 1) + b;
      }
      return c / 2 * (Math.sqrt(1 - (i -= 2) * i) + 1) + b;
    },
    easeInElastic: function easeInElastic(m, p, a, b) {
      var d = 1.70158;
      var c = 0;
      var n = a;
      if (m == 0) {
        return p;
      }
      if ((m /= b) == 1) {
        return p + a;
      }
      if (!c) {
        c = b * 0.3;
      }
      if (n < Math.abs(a)) {
        n = a;
        var d = c / 4;
      } else {
        var d = c / (2 * Math.PI) * Math.asin(a / n);
      }
      return -(n * Math.pow(2, 10 * (m -= 1)) * Math.sin((m * b - d) * (2 * Math.PI) / c)) + p;
    },
    easeOutElastic: function easeOutElastic(m, p, a, b) {
      var d = 1.70158;
      var c = 0;
      var n = a;
      if (m == 0) {
        return p;
      }
      if ((m /= b) == 1) {
        return p + a;
      }
      if (!c) {
        c = b * 0.3;
      }
      if (n < Math.abs(a)) {
        n = a;
        var d = c / 4;
      } else {
        var d = c / (2 * Math.PI) * Math.asin(a / n);
      }
      return n * Math.pow(2, -10 * m) * Math.sin((m * b - d) * (2 * Math.PI) / c) + a + p;
    },
    easeInOutElastic: function easeInOutElastic(m, p, a, b) {
      var d = 1.70158;
      var c = 0;
      var n = a;
      if (m == 0) {
        return p;
      }
      if ((m /= b / 2) == 2) {
        return p + a;
      }
      if (!c) {
        c = b * (0.3 * 1.5);
      }
      if (n < Math.abs(a)) {
        n = a;
        var d = c / 4;
      } else {
        var d = c / (2 * Math.PI) * Math.asin(a / n);
      }
      if (m < 1) {
        return -0.5 * (n * Math.pow(2, 10 * (m -= 1)) * Math.sin((m * b - d) * (2 * Math.PI) / c)) + p;
      }
      return n * Math.pow(2, -10 * (m -= 1)) * Math.sin((m * b - d) * (2 * Math.PI) / c) * 0.5 + a + p;
    },
    easeInBack: function easeInBack(k, b, c, d, j) {
      if (j == undefined) {
        j = 1.70158;
      }
      return c * (k /= d) * k * ((j + 1) * k - j) + b;
    },
    easeOutBack: function easeOutBack(k, b, c, d, j) {
      if (j == undefined) {
        j = 1.70158;
      }
      return c * ((k = k / d - 1) * k * ((j + 1) * k + j) + 1) + b;
    },
    easeInOutBack: function easeInOutBack(k, b, c, d, j) {
      if (j == undefined) {
        j = 1.70158;
      }
      if ((k /= d / 2) < 1) {
        return c / 2 * (k * k * (((j *= 1.525) + 1) * k - j)) + b;
      }
      return c / 2 * ((k -= 2) * k * (((j *= 1.525) + 1) * k + j) + 2) + b;
    },
    easeInBounce: function easeInBounce(i, b, c, d) {
      return c - easing.easeOutBounce(d - i, 0, c, d) + b;
    },
    easeOutBounce: function easeOutBounce(i, b, c, d) {
      if ((i /= d) < 1 / 2.75) {
        return c * (7.5625 * i * i) + b;
      } else {
        if (i < 2 / 2.75) {
          return c * (7.5625 * (i -= 1.5 / 2.75) * i + 0.75) + b;
        } else {
          if (i < 2.5 / 2.75) {
            return c * (7.5625 * (i -= 2.25 / 2.75) * i + 0.9375) + b;
          } else {
            return c * (7.5625 * (i -= 2.625 / 2.75) * i + 0.984375) + b;
          }
        }
      }
    },
    easeInOutBounce: function easeInOutBounce(i, b, c, d) {
      if (i < d / 2) {
        return easing.easeInBounce(i * 2, 0, c, d) * 0.5 + b;
      }
      return easing.easeOutBounce(i * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
    }
  };
  return exports;
}(scrollParallax_Util, scrollParallax_ScrollStatus);
scrollParallax_ScrollFit = function (exports, _ScrollStatus, _Util) {
  Object.defineProperty(exports, '__esModule', { value: true });
  exports.ScrollFit = undefined;
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }
  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ('value' in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    return function (Constructor, protoProps, staticProps) {
      if (protoProps)
        defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();
  var ScrollFit = exports.ScrollFit = function () {
    function ScrollFit($element) {
      _classCallCheck(this, ScrollFit);
      this.$element = $element;
      this.styleValues = {};
      this.motions = [];
      this.rangeMotions = [];
    }
    _createClass(ScrollFit, [
      {
        key: 'setMotions',
        value: function setMotions(motion) {
          var ops = $.extend({ easing: 'linear' }, motion);
          this.motions.push(ops);
        }
      },
      {
        key: 'setRangeMotions',
        value: function setRangeMotions() {
          var range = [];
          this.motions.forEach(function (motion) {
            var start = (0, _Util.scrollPositionStringToNumber)(motion.start);
            var isMotion = start <= _ScrollStatus.Status.scrollPosition;
            if (isMotion)
              range.push(motion);
          });
          this.rangeMotions = range;
        }
      },
      {
        key: 'setDefaultStyles',
        value: function setDefaultStyles() {
          var defaultStyles = {};
          this.motions.forEach(function (motion) {
            for (var style in motion.fromStyle) {
              if (defaultStyles[style] === undefined)
                defaultStyles[style] = motion.fromStyle[style];
            }
          });
          this.styleValues = defaultStyles;
        }
      },
      {
        key: 'setFromStyle',
        value: function setFromStyle() {
          var _this = this;
          this.motions.forEach(function (motion, i) {
            for (var style in motion.toStyle) {
              if (motion.fromStyle === undefined)
                motion.fromStyle = {};
              if (motion.fromStyle[style] === undefined) {
                motion.fromStyle[style] = _this.getLastToStyle(style, i);
              }
            }
          });
        }
      },
      {
        key: 'getLastToStyle',
        value: function getLastToStyle(style, i) {
          var fromStyle = '';
          var k = Math.max(i - 1, 0);
          for (var j = k; j >= 0; j--) {
            var motion = this.motions[j];
            if (motion.fromStyle[style] !== undefined) {
              fromStyle = motion.toStyle[style];
              break;
            }
          }
          if (fromStyle === '')
            fromStyle = this.$element.css(style);
          return fromStyle;
        }
      },
      {
        key: 'setStart',
        value: function setStart() {
          var _this = this;
          this.motions.forEach(function (motion, i) {
            if (motion.start === undefined) {
              motion.start = _this.getLastStart(i);
            }
          });
        }
      },
      {
        key: 'getLastStart',
        value: function getLastStart(i) {
          var start = '';
          var k = Math.max(i - 1, 0);
          for (var j = k; j >= 0; j--) {
            var motion = this.motions[j];
            if (motion.start !== undefined) {
              start = motion.end;
              break;
            }
          }
          return start;
        }
      }
    ]);
    return ScrollFit;
  }();
  return exports;
}(scrollParallax_ScrollFit, scrollParallax_ScrollStatus, scrollParallax_Util);
jqueryscrollParallaxjs = function (_ScrollStatus, _ScrollTiming, _ScrollFit, _Util) {
  function _typeof(obj) {
    return obj && typeof Symbol !== 'undefined' && obj.constructor === Symbol ? 'symbol' : typeof obj;
  }
  $.parallax = function (ops) {
    _ScrollStatus.Status.setVal(ops);
    if (_ScrollStatus.Status.debugMode)
      $('body').append('<p class="parallax-debug" style="border: 1px solid red;position: absolute;' + (_ScrollStatus.Status.direction === 'y' ? 'width' : 'height') + ': 100%;' + (_ScrollStatus.Status.direction === 'y' ? 'left' : 'top') + ': 0;' + '"></p>');
  };
  var Timing = new _ScrollTiming.ScrollTiming();
  $.parallaxTiming = function (ops) {
    Timing.setVal(ops);
  };
  $.fn.parallaxTiming = function (ops) {
    var $element = this;
    var toggle = ops.toggle || [];
    var fixScrollPosition = ops.fixScrollPosition || null;
    var isOver;
    _ScrollStatus.Status.functions.push(function () {
      var fixLine = fixScrollPosition ? fixScrollPosition : $element.offset()[_ScrollStatus.Status.directionPositionName.toLocaleLowerCase()];
      var timingLinePercent = ops.timingLinePercent || Timing.timingLinePercent;
      var timingLine = _ScrollStatus.Status.scrollPosition + _ScrollStatus.Status.stageSize / (100 / timingLinePercent);
      if (timingLine >= fixLine ? !isOver : isOver) {
        isOver = timingLine >= fixLine;
        var name = [isOver ? 'start' : 'end'];
        if (ops[name]) {
          ops[name]({
            target: $element,
            isOver: isOver
          });
        } else if (toggle.length > 0) {
          ops.toggle[isOver ? 0 : 1]({
            target: $element,
            isOver: isOver
          });
        }
      }
      if (_ScrollStatus.Status.debugMode)
        $('body > .parallax-debug').css(_ScrollStatus.Status.directionPositionName.toLocaleLowerCase(), timingLine);
    });
  };
  $.fn.parallaxSpeed = function (ops) {
    var $element = this;
    var style = ops.style || 'top';
    var options = $.extend({
      speed: 2,
      min: -999999,
      max: 999999,
      fixStyleValue: String($element.css(style)),
      fixScrollPosition: 0
    }, ops);
    var styles = (typeof style === 'undefined' ? 'undefined' : _typeof(style)) === 'object' ? style : [style];
    var speeds = _typeof(options.speed) === 'object' ? options.speed : [options.speed];
    var mins = _typeof(options.min) === 'object' ? options.min : [options.min];
    var maxs = _typeof(options.max) === 'object' ? options.max : [options.max];
    var fixStyleValues = [];
    styles.forEach(function (name, i) {
      fixStyleValues[i] = String($element.css(name));
    });
    _ScrollStatus.Status.functions.push(function () {
      styles.forEach(function (style, i) {
        var speed = speeds[i] || options.speed;
        var min = mins[i] || options.min;
        var max = maxs[i] || options.max;
        var fixScrollPosition = (0, _Util.scrollPositionStringToNumber)(options.fixScrollPosition);
        var fixStyleValue = fixStyleValues[i] || options.fixStyleValue;
        var styleVal = new _Util.StyleValue(fixStyleValue);
        var styleValues = styleVal.getValueAry();
        var values = [];
        styleValues.forEach(function (value, j) {
          var valuesMin = (typeof min === 'undefined' ? 'undefined' : _typeof(min)) === 'object' ? min[j] : min;
          var valuesMax = (typeof max === 'undefined' ? 'undefined' : _typeof(max)) === 'object' ? max[j] : max;
          var valuesSpeed = (typeof speed === 'undefined' ? 'undefined' : _typeof(speed)) === 'object' ? speed[j] : speed;
          values[j] = -Number(-_ScrollStatus.Status.scrollPosition / valuesSpeed + fixScrollPosition / valuesSpeed) + value;
          values[j] = Number(values[j] < valuesMin ? valuesMin : values[j] > valuesMax ? valuesMax : values[j]);
          if (style.indexOf('background') >= 0 && fixStyleValue.indexOf('rgb') >= 0)
            values[j] = values[j] >= 1 ? parseInt(values[j]) : values[j] < 0 ? 0 : values[j];
        });
        $element.css(style, styleVal.setValue(values));
      });
    });
  };
  $.fn.parallaxFit = function (ops) {
    var Fit = new _ScrollFit.ScrollFit(this);
    if (ops['end'] !== undefined) {
      Fit.setMotions({
        start: ops['start'],
        end: ops['end'],
        fromStyle: ops['fromStyle'],
        toStyle: ops['toStyle'],
        easing: ops['easing']
      });
    }
    for (var i = 1; ops['motion' + i + 'End'] !== undefined; i++) {
      var motion = 'motion' + i;
      Fit.setMotions({
        start: ops[motion + 'Start'],
        end: ops[motion + 'End'],
        fromStyle: ops[motion + 'FromStyle'],
        toStyle: ops[motion + 'ToStyle'],
        easing: ops[motion + 'Easing']
      });
    }
    Fit.setFromStyle();
    Fit.setStart();
    _ScrollStatus.Status.functions.push(function () {
      Fit.setRangeMotions();
      Fit.setDefaultStyles();
      Fit.rangeMotions.forEach(function (motion, j) {
        var start = (0, _Util.scrollPositionStringToNumber)(motion.start);
        var end = (0, _Util.scrollPositionStringToNumber)(motion.end);
        var isInRange = start < _ScrollStatus.Status.scrollPosition && _ScrollStatus.Status.scrollPosition < end;
        var range = end - start;
        var scrollPercent = isInRange ? (_ScrollStatus.Status.scrollPosition - start) / range : _ScrollStatus.Status.scrollPosition > start ? 1 : _ScrollStatus.Status.scrollPosition < end ? 0 : '';
        for (var style in motion.fromStyle) {
          var from = new _Util.StyleValue(String(motion.fromStyle[style]));
          var to = new _Util.StyleValue(String(motion.toStyle[style]));
          var fromStyles = from.getValueAry();
          var toStyles = to.getValueAry();
          var values = [];
          for (var i = 0; i < fromStyles.length; i++) {
            var abs = Math.abs(fromStyles[i] - toStyles[i]);
            var fixAbs = fromStyles[i] < toStyles[i] ? abs : -abs;
            values[i] = _Util.easing[motion.easing](scrollPercent, fromStyles[i], fixAbs, 1);
            if (style.indexOf('background') >= 0)
              values[i] = values[i] >= 1 ? parseInt(values[i]) : values[i] < 0 ? 0 : values[i];
          }
          Fit.styleValues[style] = from.setValue(values);
        }
      });
      Fit.$element.css(Fit.styleValues);
    });
  };
  _ScrollStatus.Status.$stage.on('scroll resize load', function () {
    _ScrollStatus.Status.update();
    _ScrollStatus.Status.functions.forEach(function (func) {
      func();
    });
  });
  var scrollStop = function scrollStop() {
    _ScrollStatus.Status.$stage.queue([]).stop();
  };
  global.addEventListener('DOMMouseScroll', scrollStop, false);
  global.onmousewheel = document.onmousewheel = scrollStop;
}(scrollParallax_ScrollStatus, scrollParallax_ScrollTiming, scrollParallax_ScrollFit, scrollParallax_Util);
}());
}));