# hiraku.js - jQuery Offcanvas Menu Plugin

We made jQuery plugin called hiraku.js so that more people can use Offcanvas-menu functionality which is used in a CMS we make.

You can easily find source code or plugins for Offcanvas-menu via Google by searching with "offcanvas JavaScript", but we can't find any plugins which meet all features that hiraku.js has. That's Why we made it from the scratch.

## Feature

- Not affected by the DOM structure.
- Enable to open both right and left side menu.
- Main canvas is not scrolled, while scrolling Offcanvas-menu.
- Easy to control the movement
- Accessible for keyboard navigation and screen readers.

## Installation

npm

```
$ npm install hiraku
```

## Setup

```html
<link rel="stylesheet" type="text/css" href="./hiraku.css">
<script src="http://code.jquery.com/jquery-2.2.4.min.js"></script>
<script src="./hiraku.js"></script>
```

## Option
hiraku.js has following options. Via options, you can control the behavior when you open the Offcanvas-menu.
And if you want to change the width of the Offcanvas-menu, You may want to change CSS properties instead of changing the JavaScript.

| Variable | Description |
|-----------|----------------------------------------------------------------|
| btn       | Selector of the button to open the Offcanvas-menu |
| fixedHeader | Selector of the fixed elements |
| direction | Offcanvas-menu from "left" or "right" |

## Demo

### From right side
```html
<button class="hiraku-open-btn" id="offcanvas-btn-right" data-toggle-offcanvas="#js-hiraku-offcanvas-1">
	<span class="hiraku-open-btn-line"></span>
</button>
<div class="offcanvas-right">
	<ul><li>hogehoge</li></ul>
</div>
```

```js
$(".offcanvas-right").hiraku({
	btn: "#offcanvas-btn-right",
	fixedHeader: "#header",
	direction: "right"
});
```
### From left side

```html
<button class="hiraku-open-btn" id="offcanvas-btn-left" data-toggle-offcanvas="#js-hiraku-offcanvas-1">
	<span class="hiraku-open-btn-line"></span>
</button>
<div class="offcanvas-left">
	<ul><li>hogehoge</li></ul>
</div>
```

```js
$(".offcanvas-left").hiraku({
	btn: "#offcanvas-btn-left",
	fixedHeader: "#header",
	direction: "left"
});
```
### From both side

```html
<button class="hiraku-open-btn" id="offcanvas-btn-left" data-toggle-offcanvas="#js-hiraku-offcanvas-1">
	<span class="hiraku-open-btn-line"></span>
</button>
<div class="offcanvas-left">
	<ul><li>hogehoge</li></ul>
</div>

<button class="hiraku-open-btn" id="offcanvas-btn-right" data-toggle-offcanvas="#js-hiraku-offcanvas-1">
	<span class="hiraku-open-btn-line"></span>
</button>
<div class="offcanvas-right">
	<ul><li>hogehoge</li></ul>
</div>
```

```js
$(".offcanvas-left").hiraku({
	btn: "#offcanvas-btn-left",
	fixedHeader: "#header",
	direction: "left"
});


$(".offcanvas-right").hiraku({
	btn: "#offcanvas-btn-right",
	fixedHeader: "#header",
	direction: "right"
});
```


## CSS Customize

If you don't want to move the main contents, When opening the Offcanvas-menu.

By default, main contents will be pressed out. But if you want to fix main contents, you will overwrite hiraku.css like below

```css
.js-hiraku-offcanvas-body-right .js-hiraku-header-fixed {
	margin-left: -70%;
}

.js-hiraku-offcanvas-body-left .js-hiraku-header-fixed {
	margin-left: 70%;
}

.js-hiraku-offcanvas-body-right {
	left: 0;
}

.js-hiraku-offcanvas-body-left {
	left: 0;
}
```


### Specify the width of the Offcanvas-menu in pixels

By default, width of the Offcanvas-menu is 70% of the screen size. But you may want to change the size of the menu when using tablets. Then you can overwrite hiraku.css like below.

```css
.js-hiraku-offcanvas-body-right .js-hiraku-header-fixed {
	margin-left: -210px;
}

.js-hiraku-offcanvas-body-left .js-hiraku-header-fixed {
	margin-left: 210px;
}

.js-hiraku-offcanvas .js-hiraku-offcanvas-sidebar-left {
	margin-left: -210px;
}
 
.js-hiraku-offcanvas .js-hiraku-offcanvas-sidebar-right {
	margin-right: 210px;
}

.js-hiraku-offcanvas .js-hiraku-offcanvas-sidebar {
	width: 210px;
}

.js-hiraku-offcanvas-body-left {
	left: 210px;
}

.js-hiraku-offcanvas-body-right {
	right: 210px;
}
```

### Customize hiraku.css via hiraku.scss

You can change its width by changing the variable on hiraku.scss. You can also change its transition speed with it.

| Variable | Description |
|-----------|----------------------------------------------------------------|
| $side-menu-width | Width of the Offcanvas-menu (default： 70%) |
| $animation | Transition speeed and type (default: 0.3s ease-in-out) |

## Download

You can download from here.

[Download hiraku.js](http://github.com/appleple/hiraku/archive/master.zip)

## Github

[hiraku.js on Github](http://github.com/appleple/hiraku)
