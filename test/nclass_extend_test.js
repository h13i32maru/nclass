TestCase('nClassExtendTest', {
    setUp: function() {
        this.ClassA = nClass.create({
            $static: {
                x: null
            },

            initialize: function(arg1) {
                this.arg1 = arg1;
            },

            say: function() {
                return 'ClassA';
            },

            overrideABC: function() {
                return ['ClassA'];
            },

            overrideAC: function() {
                return ['ClassA'];
            }
        });

        this.ClassB = nClass.extend(this.ClassA, {
            initialize: function($super, arg1, arg2) {
                $super(arg1);

                this.arg2 = arg2;
            },

            say: function() {
                return 'ClassB';
            },

            overrideABC: function($super) {
                var res = $super();
                res.push('ClassB');
                return res;
            }
        });

        this.ClassC = nClass.extend(this.ClassB, {
            overrideABC: function($super) {
                var res = $super();
                res.push('ClassC');
                return res;
            },

            overrideAC: function($super) {
                var res = $super();
                res.push('ClassC');
                return res;
            }
        });
    },

    'test instance of': function() {
        var a = new this.ClassA();
        var b = new this.ClassB();
        var c = new this.ClassC();

        assertTrue(a instanceof this.ClassA);
        assertFalse(a instanceof this.ClassB);
        assertFalse(a instanceof this.ClassC);

        assertTrue(b instanceof this.ClassA);
        assertTrue(b instanceof this.ClassB);
        assertFalse(b instanceof this.ClassC);

        assertTrue(c instanceof this.ClassA);
        assertTrue(c instanceof this.ClassB);
        assertTrue(c instanceof this.ClassC);

    },

    'test method': function() {
        var b = new this.ClassB();

        assertEquals('ClassB', b.say());
    },

    'test override method': function() {
        var b = new this.ClassB();
        var c = new this.ClassC();

        assertEquals(['ClassA', 'ClassB'], b.overrideABC());
        assertEquals(['ClassA', 'ClassB', 'ClassC'], c.overrideABC());
    },

    'test override method skip B': function() {
        var b = new this.ClassB();
        var c = new this.ClassC();

        assertEquals(['ClassA'], b.overrideAC());
        assertEquals(['ClassA', 'ClassC'], c.overrideAC());
    },

    'test override initialize': function() {
        var arg1 = [10, 20, 30];
        var arg2 = 100;

        var b = new this.ClassB(arg1, arg2);
        var c = new this.ClassC(arg1, arg2);

        assertSame(arg1, b.arg1);
        assertSame(arg2, b.arg2);

        assertSame(arg1, c.arg1);
        assertSame(arg2, c.arg2);
    },

    'test static property': function() {
        var x = [];

        var b1 = new this.ClassB();
        var b2 = new this.ClassB();

        b1.$static.x = x;

        assertSame(b1.$static, b2.$static);
        assertSame(x, b1.$static.x);
        assertSame(x, b2.$static.x);
    },

    'test override error': function() {
        try {
            var ClassA = nClass.create({});
            var ClassB = nClass.extend(ClassA, {
                say: function($super) {
                }
            });
        } catch(e) {
            assertTrue(e instanceof nClass.OverrideError);
            return;
        }
        fail();
    },

    'test argument error': function() {
        try {
            var ClassB = nClass.extend({});
        } catch(e) {
            assertTrue(e instanceof nClass.InvalidArgumentError);
            return;
        }

        fail();
    }
});
