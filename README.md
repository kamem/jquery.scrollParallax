# jquery.scrollParallax

スクロールによってcssを変更してパララックス効果を実現するjQueryプラグインです。

## Description
このプラグインには3つの機能があります。

1. 任意の位置にスクロール量が来た時に関数を実行する
2. スクロール量に応じてcssを変化させる
3. 移動距離に応じてcssを変化させる

## DEMO

* [y scroll](http://github.develo.org/jquery.scrollParallax/example/y.html)

## Requirement

* jquery
* [jquery.dataExtend](https://github.com/kamem/jquery.dataExtend)

※ jquery.dataExtendはjqueryプラグイン用の記述をdata属性に持たせることができるプラグインです。
これを使うことによってjsをあまり書かずにparallax効果を実現することができます。
jquery.dataExtendの詳しい説明は詳しくは下記を見てください。

* en: https://github.com/kamem/jquery.dataExtend
* ja: http://qiita.com/kamem/items/94e974a0212396d97ed7

## Usage

### 初期設定

	$.parallax({
		stage: window,
		direction: 'y',
		debugMode: true
	});


| option name| Descriptions |default
|:-----------|:------------|:------------|
| stage      | スクロールさせたいwindow |`window`
| direction  | スクロールの方向 |`'y'`
| debugMode  | デバックようにスクロール量を表示 timingでの実行位置を表示 | `false`

### `jquery.dataExtend`を使用する場合
classは任意の値を入れてください。
（これにより下記のクラスをつけたタグにはdata属性でoptionを指定することができます。）

	$('.parallax-timing').dataExtend('parallaxTiming');
	$('.parallax-speed').dataExtend('parallaxSpeed');
	$('.parallax-fit').dataExtend('parallaxFit');

### timing
任意の位置にスクロール量が来た時に関数を実行する

#### 初期設定

	$.parallaxTiming({
		timingLinePercent: 50
	});

| option name| Descriptions |default
|:-----------|:------------|:------------|
| timingLinePercent | タイミングの位置をどこに設定するか（windowの幅での割合） |`50`

#### 動作

	$(el).parallaxTiming(
		fixScrollPosition: null,
		start: null,
		end: null,
		toggle: []
	);

| option name| Descriptions |default
|:-----------|:------------|:------------|
| fixScrollPosition | スクロール位置がこの位置にきた時に関数が実行される、もしも値が`null`の場合は指定したタグのoffset().topを代入します。 |`null`
| start | 上から下に向かって通過した場合に実行される |`null`
| end | 下から上に代入します。 |`null`
| start | 上から下に向かって通過した場合に実行される |`null`
| toggle | 上から下に向かって通過した場合: 配列の1番目を実行, 下から上に向かって通過した場合: 配列の2番目を実行 |`[]`

#### 例）
2つとも同じ意味です

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

※ 引数に`isOver`と`target`が返されます。

	function(e) {
		console.log(e.isOver); //ラインを超えているか
		console.log(e.target); //どのコンテンツの関数が反応したのか
	}


#### 例）`jquery.dataExtend`を使用した場合

	<p class="parallax-timing" data-start="start" data-end="end">Test</p>

このタグの位置を`fixScrollPosition`で指定した位置が通過した場合に関数を実行
※ fixScrollPositionを省略している場合は指定したタグのoffset().topが基準になります。

* 上から下に通過した場合に`global`にある`start`を実行
* 下から上に通過した場合に`global`にある`end`を実行

### speed

スクロール量に応じてcssを変化させる

	$(el).parallaxSpeed({
		style: 'top',
		speed: 2,
		min: -999999,
		max: 999999,
		adjustment: String($element.css(style)),
		fixScrollPosition: 0
	});

| option name| Descriptions |default
|:-----------|:------------|:------------|
| style | 変化させたいcssの値 |`'top'`
| speed | スクロール量 / speed ので値を変化させる |`2`
| min | 値の最小値 |`-999999`
| max | 値の最大値 |`999999`
| fixPosition | 希望の位置、コンテンツのfix位置、nullの場合はcss予め指定していた位置が代入されます。 |`null`
| fixScrollPosition | スクロールが`fixScrollPosition`の位置に来た時に希望の位置（fixPosition）にコンテンツがfixします。 |`0`

#### 例）
	$(el).parallaxSpeed {
		sytle: 'left',
		speed: 0.5
		fixScrollPosition: 300
	}

#### 例）`jquery.dataExtend`を使用した場合

	<p class="parallax-speed" data-style="left" data-speed="0.5" data-fix-scroll-position="300">Test</p>


#### 応用編
各オプションは配列で指定することができます。

	$(el).parallaxSpeed {
		sytle: ['top', 'left', 'background-color'],
		speed: [0.5, 2, 2],
		min: [100, 100, [100,10,0]],
		max: [500, 500, [255,255,200]] //3つめはrba(100, 100, 100)のような値をそれぞれ指定できます。
		fixScrollPosition: 300
	}

#### `jquery.dataExtend`を使用した場合

	<p class="parallax-speed"
		data-style="['top', 'left', 'background-color']"
		data-speed="[0.5, 2, 2]"
		data-min="[0.5, 2, 2]"
		data-max="[500, 500, [255,255,200]]"
		data-fix-scroll-position="300">Test</p>


#### ウィンドウ幅によりコンテンツ幅が変わる場合の対処方法
下記のようにタグを指定することでそのタグの`offset().top`からの位置を`fixScrollPosition`とすることができます。
基準の位置から微調整したい場合は`,`で区切り値を入れてください。

	fixScrollPosition: '#main,+100'

### fit

移動距離に応じてcssを変化させる

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
| start | 移動を始めるスクロール位置 |`null`
| end | 移動が終わるスクロール位置 |`null`
| toStyle | 始めのcss（cssは文字列で指定してください） |`null`
| fromStyle | 終わりのcss（cssは文字列で指定してください） |`null`
| easing | [easing plugin](http://semooh.jp/jquery/cont/doc/easing/)の名前を指定 |`null`


#### 例）`jquery.dataExtend`を使用した場合

	<p class="parallax-fit"
		data-start="0"
		data-end="500"
		data-fromStyle="{top: '100px'}"
		data-toStyle="{top: '400px'}"
		data-easing="easeInOutBack">Test</p>

#### 応用編

`motion1Start`のようにmotionをつなげていくことでmotionを複数指定できます。

* start,fromを省略すると過去の`end` or `to`の値を参照し最後に指定した値から始まります。
* 参照した結果`end` or `to`の値がない場合はcssで指定している値を見にいきます。


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

#### ウィンドウ幅によりコンテンツ幅が変わる場合の対処方法
下記のようにタグを指定することでそのタグの`offset().top`からの位置を`start`とすることができます。
基準の位置から微調整したい場合は`,`で区切り値を入れてください。

	$(el).parallaxFit({
		start: '#main',
		end:'#main,+100',


## License

The license is available within the repository in the [LICENSE](https://github.com/kamem/jquery.scrollParallax/blob/master/LICENSE.txt) file.

## Author

[kamem] (https://github.com/kamem)([@kamem](https://twitter.com/kamem))