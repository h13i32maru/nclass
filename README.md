# nClass
nClass is javascript class system.

## loading script
```html
<script src="path/to/nclass.js"></script>
```

## Simple class
`nClass(prototypeObject)` creates class using prototype object.

- `initialize` runs automatically when creating object with `new` operator.
- value of property in prototype object must be primitive(number, string, boolean), function or null.
    - if you use object value({}, [], etc), assign in `initialize` function.

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

## Extend class
`nClass(superClass, prototypeObject)` creates class using super class.

- Using extend class, reuse function and property in super class.

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

## Using override function
`$super` argument in function overrides super class function.

- if you want to use super class function in overriding function, first argument of the function must be `$super`.

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

## Static property
`$static` is common property in objects which creating same class.

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

console.log(a1.$static.data); //['food', 'book']
console.log(a2.$static.data); //['food', 'book']
```

## Attention
### Property type error
property in prototype object must be primitive or null.

```javascript
var ClassA = nClass({
    data: [] // throw nClass.PropertyTypeError
});
```

if use object data, use `initialize` function.

```javascript
var ClassA = nClass({
    data: null,

    initialize: function() {
        this.data = [];
    }
});
```

### Override error
Can't override function which not existing in super classes.

```javascript
var ClassA = nClass({});

var ClassB = nClass({
    say: function($super) { // throw nClass.OverrideError
    }
});
```

Don't use `$super`.
```javascript
var ClassA = nClass({});

var ClassB = nClass({
    say: function() {
    }
});
```
