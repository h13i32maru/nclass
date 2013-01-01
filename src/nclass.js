nClass = {
    /**
     * 引数にスーパークラスの関数が渡されるように元の関数をラップして返す。
     * @param {Object} superObjスーパークラスのオブジェクト.
     * @param {string} funcname ラップする関数の名前.
     * @param {function(...)} func ラップする関数.
     * @return {function(...)} ラップした関数.
     */
    _wrapFunction: function(superObj, funcname, func) {
        'use strict';

        if (typeof superObj[funcname] !== 'function') {
            throw new this.OverrideError(funcname);
        }

        return function() {
            var _this = this;
            var $super = function() { return superObj[funcname].apply(_this, arguments); }
            var arg = [$super].concat(Array.prototype.slice.call(arguments, 0));
            return func.apply(this, arg);
        };
    },

    /**
     * 関数の仮引数名のリストを取得する.
     * @param {function(...)} func 対象とする関数.
     * @return {Array.<string>} 仮引数名の配列.
     */
    _argumentNames: function(func) {
        'use strict';

        var names = func.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1]
          .replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
          .replace(/\s+/g, '').split(',');
        return names.length == 1 && !names[0] ? [] : names;
    },

    /**
     * スーパークラスを指定せずにクラスを生成したときのクラス.
     */
    _rootClass: (function() {
        'use strict';

        var _rootClass = function() {};
        _rootClass.prototype.initialize = function() {};
        return _rootClass;
    })(),

    /**
     * プロパティの型が不正の場合のエラー.
     * @param {string} propName 不正なプロパティの名前.
     * @return {PropertyTypeError}
     */
    PropertyTypeError: (function(){
        'use strict';

        var E = function(propName) {
            if (!E.prototype.message) {
                E.prototype = new Error();
                E.prototype.message = propName + ' is not primitive type. not ';
                E.prototype.name = 'PropertyTypeError';
                return new E();
            }
        }
        return E;
    })(),

    OverrideError: (function(){
        'use strict';

        var E = function(funcname) {
            if (!E.prototype.message) {
                E.prototype = new Error();
                E.prototype.message = funcname + ' is not a function in super class.';
                E.prototype.name = 'OverrideError';
                return new E();
            }
        }
        return E;
    })(),

    InvalidArgumentError: (function(){
        'use strict';

        var E = function(expection, actual) {
            if (!E.prototype.message) {
                E.prototype = new Error();
                E.prototype.message = 'arguments count was expecting ' + expection.join(' or ') + ', ' + actual + ' was actually.';
                E.prototype.name = 'InvalidArgumentError';
                return new E();
            }
        }
        return E;
    })(),


    _create: function(superClass, protoObj) {
        'use strict';

        var constructor = function() {
            if (typeof this.initialize === 'function') {
                this.initialize.apply(this, arguments);
            }
        };

        var emptySuperClass = function() {};
        emptySuperClass.prototype = superClass.prototype;
        var superObj = new emptySuperClass();
        var superObjForWrap = new emptySuperClass();

        constructor.prototype = superObj;

        var key;
        var value;
        for (key  in protoObj) {
            value = protoObj[key];

            if (typeof value === 'object' && value !== null) {
                if (key !== '$static') {
                    throw new this.PropertyTypeError(key);
                }
            }

            if (typeof value === 'function') {
                if (this._argumentNames(value)[0] === '$super') {
                    value = this._wrapFunction(superObjForWrap, key, value);
                }
            }
            constructor.prototype[key] = value;
        }

        constructor.prototype.constructor = constructor;

        return constructor;
    },

    create: function(protoObj) {
        'use strict';

        if (arguments.length !== 1) {
            throw new this.InvalidArgumentError([1], arguments.length);
        }

        return this._create(this._rootClass, protoObj);
    },

    extend: function(superClass, protoObj) {
        'use strict';

        if (arguments.length !== 2) {
            throw new this.InvalidArgumentError([2], arguments.length);
        }

        return this._create(superClass, protoObj);
    }
};

var ClassA = nClass.create({
    p: 'hello',
    $static:{
        x: []
    },
    initialize: function($super, a, b) {

        this.funcAB();
        this.$static.x.push(a);
    },

    onlyInA: function() {
        console.log('onlyInA');
    },

    funcAB: function() {
        console.log('ClassA#funcAB');
    },

    funcAC: function() {
        console.log('ClassA#funcAC');
    }
});

var ClassB = nClass.extend(ClassA, {
    p: 'bye',
    initialize: function($super, a, b){
        $super(a, b);
        //console.log(a, b);
    },

    onlyInB: function() {
        console.log('onlyInB');
    },

    funcAB: function($super) {
        $super();
        console.log('ClassB#funcAB');
    }
});

var ClassC = nClass.extend(ClassB, {
    initialize: function($super, a, b){
        console.log('ClassC');
        $super(a, b);
        console.log(a, b);
    },

    onlyInC: function() {
        console.log('onlyInC');
    },

    funcAC: function($super) {
        $super();
        console.log('ClassC#funcAC');
    }
});

var c = new ClassC();
console.log(c instanceof ClassC);
console.log(c instanceof ClassB);
console.log(c instanceof ClassA);
