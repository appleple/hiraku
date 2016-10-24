# Hiraku
「hiraku」は下記のようなオフキャンバスメニューを実現するためのjQuery用プラグインです。

## 使い方

### CSS及びJavaScriptの読み込み

```html
<link rel="stylesheet" type="text/css" href="./hiraku.css">
<script src="http://code.jquery.com/jquery-2.2.4.min.js"></script>
<script src="./hiraku.js"></script>
```
### オフキャンバスメニューを左に開閉

```html
<p><a class="acms-admin-btn" id="offcanvas-btn-left" href="#">オフキャンバスを左に開閉</a></p>
<div class="offcanvas-left">
    ここにオフキャンバスメニューの項目が入ります。
</div>
```

```js
$(".offcanvas-left").offcanvas({
	btn:"#offcanvas-btn-left",//オフキャンバスを開くためのボタン
	fixedHeader:".js-offcanvas-header",//オフキャンバスメニュー開閉時にヘッダーを固定する場合に指定する
	direction:"left"//オフキャンバスメニューを開く方向を指定する
});
```

### オフキャンバスメニューを右に開閉

```html
<p><a class="acms-admin-btn" id="offcanvas-btn-right" href="#">オフキャンバスを左に開閉</a></p>
<div class="offcanvas-left">
    ここにオフキャンバスメニューの項目が入ります。
</div>
```

```js
$(".offcanvas-right").offcanvas({
	btn:"#offcanvas-btn-right",//オフキャンバスを開くためのボタン
	fixedHeader:".js-offcanvas-header",//オフキャンバスメニュー開閉時にヘッダーを固定する場合に指定する
	direction:"right"//オフキャンバスメニューを開く方向を指定する
});
```
