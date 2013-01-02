# nClass
nClass is javascript class system.

## loading script
```html
<script src="path/to/nclass.js"></script>
```

## Simple class
`nClass(prototypeObject)` create class using prototype object.

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
console.log(a.num); //100
console.log(a.list); //[]

a.addNum(10);
console.log(a.num); //110

a.pushData('food');
console.log(a.list); //['food']
```

## Extend class
`nClass(superClass, prototypeObject)` create class using super class.

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

    getHistory: function() {
        return this.history.join(' > ');
    }
});

var b = new ClassB(10, 'car');

b.addNum(10);
b.addNum(20);
console.log(b.num); //40
console.log(b.history); //[10, 20]
console.log(b.getHistory()); //'10 > 20'

b.pushData('book');
console.log(b.list); //['car', 'book']
```

## Static property
`$static` is common property in the same class.

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
property in prototype object is primitive or null.

```javascript
var ClassA = nClass({
    data: [] // throw nClass.PropertyTypeError
});
```

if use object data, use initialize function.

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

Don't use $super.
```javascript
var ClassA = nClass({});

var ClassB = nClass({
    say: function() {
    }
});
```
