# nClass
JavaScriptでクラスを実現するライブラリ

- MITライセンス
- クラスの生成 (new演算子と共につかう関数)
- コンストラクタ関数 (インスタンス生成時に自動実行される関数)
- クラスの継承 (親クラスの機能を継承して拡張)
- 関数のオーバーライド (関数のオーバーライド時に親クラスの関数呼び出し機能)
- 無名クラスから直接インスタンス生成 (シングルトンパターン)
- クラス変数 (同じクラスから生成されたインスタンスで共通の変数)

## ライブラリの読み込み
```html
<script src="path/to/nclass.js"></script>
```

## クラス
`nClass(prototypeObject)`を使ってクラスを生成します.
- `initialize` 関数は`new`演算子を使ったインスタンス生成時に自動的に実行される関数です.
- `prototypeObject` のプロパティの値は基本型(number, string, boolean)、関数もしくはnullにする必要があります.
  - もしオブジェクト({}, [], etc...)を使用したい場合は `initialize` 関数内で値を代入してください.

```javascript
var ClassA = nClass({
    num: 0,
    list: null,

    initialize: function(num) {
        this.num = num;
        this.list = [];
    },

    addNum: function(num) {
        this.num += num;
    },

    pushData: function(data) {
        this.list.push(data);
    }
});

var a = new ClassA(100);
a.num; // 100
a.list; // []

a.addNum(10);
a.num; // 110

a.pushData('food');
a.list; // ['food']
```

## 継承を使ったクラス
`nClass(superClass, prototypeObject)` は親クラスを使用してクラスを生成します.

- 継承を使うことで、親クラスの関数とプロパティを再利用することができます.

```javascript
var ClassA = nClass({
    num: 0,
    list: null,

    initialize: function(num) {
        this.num = num;
        this.list = [];
    },

    addNum: function(num) {
        this.num += num;
    },

    pushData: function(data) {
        this.list.push(data);
    }
});

var ClassB = nClass(ClassA, {
    resetNum: function() {
        this.num = 0;
    }
});

var b = new ClassB(10);

b.addNum(20);
b.num; // 30

b.pushData('book');
b.list; // ['book']

b.resetNum();
b.num; // 0
```

## オーバーライド関数
関数内で `$super` 引数を使うことで、親クラスの関数をオーバーライドすることができます.

- オーバーライドした関数内で親クラスの関数を使用したい場合、その関数の最初の引数を `$super` としてください.

```javascript
var ClassA = nClass({
    num: 0,
    list: null,

    initialize: function(num) {
        this.num = num;
        this.list = [];
    },

    addNum: function(num) {
        this.num += num;
    },

    pushData: function(data) {
        this.list.push(data);
    }
});

var ClassB = nClass(ClassA, {
    history: null,

    initialize: function($super, num, data) {
        $super(num);
        this.history = [];
        this.pushData(data);
    },

    addNum: function($super, num) {
        $super(num);
        this.history.push(num);
    },
});

var b = new ClassB(10, 'car');

b.addNum(10);
b.addNum(20);
b.num; //40
b.history; //[10, 20]
```

## インスタンスを直接生成
`nClass.instance(prorotypeObject)` と `nClass.instance(superClass, prototypeObject)` はインスタンスを生成します.

- 生成されたインスタンスは初期化されていないので、 `initialized()` を手動で実行する必要があります.
- シングルトンパターンに似たことを実現できます.

```javascript
var InstanceA = nClass.instance({
    data: null,

    initialize: function() {
        this.data = [];
    },

    pushData: function(data) {
        this.data.push(data);
    }
});

InstanceA.initialize();
InstanceA.pushData('foo');
```

## Staticプロパティ
- `$static` は同じクラスから生成されたインスタンス内で共通のプロパティとなります.

```javascript
var ClassA = nClass({
    $static: {
        data: []
    },

    pushData: function(data) {
        this.$static.x.push(data);
    }
});

var a1 = new ClassA();
var a2 = new ClassA();

a1.pushData('food');
a2.pushData('book');

a1.$static.data; //['food', 'book']
a2.$static.data; //['food', 'book']
```

## 注意

### プロパティ型エラー
`prototypeObject` 内のプロパティは基本型(number, string, booelan)、関数もしくはnullとする必要があります.

```javascript
var ClassA = nClass({
    data: [] // throw nClass.PropertyTypeError
});
```

もしオブジェクトを使いたい場合は `initialize` 関数内で代入してください.

```javascript
var ClassA = nClass({
    data: null,

    initialize: function() {
        this.data = [];
    }
});
```

### オーバーライドエラー
親クラス(先祖クラス)に存在しない関数をオーバーライドすることはできません.

```javascript
var ClassA = nClass({});

var ClassB = nClass({
    say: function($super) { // throw nClass.OverrideError
    }
});
```

`$super` を使わないようにしてください.

```javascript
var ClassA = nClass({});

var ClassB = nClass({
    say: function() {
    }
});
```
