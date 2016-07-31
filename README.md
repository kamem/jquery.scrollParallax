# jquery.scrollParallax

Change the css by the scroll is a jQuery plugin that implements the parallax effect.

## Description
This plugin has three functions.

1.Run the function when it has passed through an arbitrary position
2. Changing the css according to the scroll amount
3. Changing the css according to the moving distance

## DEMO

* [y scroll](http://github.develo.org/jquery.scrollParallax/example/y.html)

## Requirement

* jquery
* [jquery.dataExtend](https://github.com/kamem/jquery.dataExtend)

※ a description of the jquery plugin is a plugin that can be written to the data attribute.
By using this, it will be able to realize a parallax effect without writing too much js.

Full description of jquery.dataExtend, please look at the following.

* en: https://github.com/kamem/jquery.dataExtend
* ja: http://qiita.com/kamem/items/94e974a0212396d97ed7

## Install

### Bower

	bower install jquery.scrollParallax

### Npm

	npm install jquery.scroll-parallax

## Usage

### Initial setting

	$.parallax({
		stage: window,
		direction: 'y',
		debugMode: true
	});


| option name| Descriptions |default
|:-----------|:------------|:------------|
| stage      | Window as the user scrolls |`window`
| direction  | Direction of the scroll |`'y'`
| debugMode  | Will display the scroll amount for debugging. Will display the position to perform the function in timing. | `false`

### If you are using a jquery.dataExtend

	$('.parallax-timing').dataExtend('parallaxTiming');
	$('.parallax-speed').dataExtend('parallaxSpeed');
	$('.parallax-fit').dataExtend('parallaxFit');

Class Please put any value.
And if this writing, the tag that was attached the above class, you can specify the option in the data attribute.

### timing
Run the function when it has passed through an arbitrary position.

#### Initial setting

	$.parallaxTiming({
		timingLinePercent: 50
	});

| option name| Descriptions |default
|:-----------|:------------|:------------|
| timingLinePercent |Position that you want to run. (percentage of window width) |`50`

#### Behavior

	$(el).parallaxTiming(
		fixScrollPosition: null,
		start: null,
		end: null,
		toggle: []
	);

| option name| Descriptions |default
|:-----------|:------------|:------------|
| fixScrollPosition | If the value is "null", substitute the "offset (). Top" of the specified tag. |`null`
| start | Function to be executed when it has passed through from top to bottom |`null`
| end | Function to be executed when it has passed through from bottom to top |`null`
| toggle | When you pass through from top to bottom, run the first array. When you pass through from bottom to top, run the second array. |`[]`

#### Example)
Writing of two ways code.

	$(el).parallaxTiming({
		start: function(e) {
			console.log('start')
		},
		end: function(e) {
			console.log('end')
		}
	});

	$(el).parallaxTiming({
		toggle: [
			function(e) {
				console.log('start')
			},
			function(e) {
				console.log('end')
			}
		]
	});

※ "IsOver" and "target" in the argument is returned.

	function(e) {
		console.log(e.isOver); //Whether it exceeds the line
		console.log(e.target); //It returns the elements specified in the "$ (el)"
	}


#### Example) If you are using a jquery.dataExtend

	<p class="parallax-timing" data-start="start" data-end="end">Test</p>

Run the function if it has passed through the position of this tag.
If you omit the "fixScrollPosition", Tag of "offset (). Top" will be the reference.

* Run in the "global" "start" when it is passed from top to bottom
* Run in the "global" "end" when it is passed from bottom to top

### speed

Changing the css according to the scroll amount

	$(el).parallaxSpeed({
		style: 'top',
		speed: 2,
		min: -999999,
		max: 999999,
		fixStyleValue: String($element.css(style)),
		fixScrollPosition: 0
	});

| option name| Descriptions |default
|:-----------|:------------|:------------|
| style | The change you want css values |`'top'`
| speed | Changing the value in the calculation formula of "scroll amount / speed" |`2`
| min | Minimum value |`-999999`
| max | Maximum value |`999999`
| fixStyleValue | Style of when the content is to fix. is assigned the style that has been specified in advance by the css in the case of null. |`null`
| fixScrollPosition | It is the value of the "fixStyleValue" when the amount of scroll came to the position of "fixScrollPosition". |`0`

#### Example)
	$(el).parallaxSpeed {
		sytle: 'left',
		speed: 0.5
		fixScrollPosition: 300
	}

#### Example) If you are using a jquery.dataExtend

	<p class="parallax-speed" data-style="left" data-speed="0.5" data-fix-scroll-position="300">Test</p>


#### further practice
Each option can be specified in the array.

	$(el).parallaxSpeed {
		sytle: ['top', 'left', 'background-color'],
		speed: [0.5, 2, 2],
		min: [100, 100, [100,10,0]],
		max: [500, 500, [255,255,200]] //rgb(100, 100, 100)
		fixScrollPosition: 300
	}

#### If you are using a jquery.dataExtend

	<p class="parallax-speed"
		data-style="['top', 'left', 'background-color']"
		data-speed="[0.5, 2, 2]"
		data-min="[0.5, 2, 2]"
		data-max="[500, 500, [255,255,200]]"
		data-fix-scroll-position="300">Test</p>


#### What to do if the content width is changed by the width of the window
Its "offset ().top" of the tag can be a position from "fixScrollPosition" by specifying the tag as follows.
Please put the value in a comma-separated if you want to adjust from a reference position.

	fixScrollPosition: '#main,+100'

### fit

Changing the css according to the moving distance

	$(el).parallaxFit({
		start: 0,
		end: 500,
		fromStyle: {
			top: '100px'
		},
		toStyle: {
			top: '700px'
		},
		easing: 'easeInOutBack',
	});

| option name| Descriptions |default
|:-----------|:------------|:------------|
| start | Scroll position to start moving |`null`
| end | Scroll position to movement end |`null`
| fromStyle | Css at the time of the start（String） |`null`
| toStyle | Css at the time of the end（String） |`null`
| easing | Specify the easing name [easing plugin](http://semooh.jp/jquery/cont/doc/easing/)  |`null`


#### 例） If you are using a jquery.dataExtend

	<p class="parallax-fit"
		data-start="0"
		data-end="500"
		data-from-style="{'top': '100px'}"
		data-to-style="{'top': '400px'}"
		data-easing="easeInOutBack">Test</p>

#### further practice

You can specify multiple motion by such as "motion1Start".

* You will see the value of the past "end" If you omit the " start".
* You will see the value of the past "to" If you omit the " from".
* If there is no value of the referenced results "to" You go to see the value that is specified in the css.


---
	$(el).parallaxFit({
		start: 0,
		end: 500,
		fromStyle: {
			top: '100px'
		},
		toStyle: {
			top: '400px'
		},
		easing: 'easeInOutBack',

		motion1End: 700,
		motion1FromStyle: {
			left: '300px'
		},
		motion1ToStyle: {
			left: '400px'
		},
		motion1Easing: 'easeInOutBack',
	});

#### What to do if the content width is changed by the window width
Its "offset ().top" of the tag can be a position from "start" by specifying the tag as follows.
Please put the value in a comma-separated if you want to adjust from a reference position.

	$(el).parallaxFit({
		start: '#main',
		end:'#main,+100',


## License

The license is available within the repository in the [LICENSE](https://github.com/kamem/jquery.scrollParallax/blob/master/LICENSE.txt) file.

## Author

[kamem] (https://github.com/kamem)([@kamem](https://twitter.com/kamem))
