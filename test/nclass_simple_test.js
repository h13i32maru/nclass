TestCase('nClassSimpleTest', {
    setUp: function() {
        this.ClassA = nClass.create({
            $static: {
                x: [10, 20],
                num: 0,
            },

            arg1: null,
            arg2: null,
            
            initialize: function(arg1, arg2) {
                this.arg1 = arg1;
                this.arg2 = arg2;
            },

            say: function() {
                return 'ClassA#say';
            }
        });

        this.ClassB = nClass.create({
            say: function() {
                return 'ClassB#sayB';
            }
        });
    },

    'test simple class': function() {
        var a = new this.ClassA();
        assertEquals('ClassA#say', a.say());
    },

    'test class instanceof': function() {
        var a = new this.ClassA();
        var b = new this.ClassB();

        assertTrue(a instanceof this.ClassA);
        assertFalse(b instanceof this.ClassA);
    },

    'test initialize function': function() {
        var arg1 = 100;
        var arg2 = [-1, -2];
        var a = new this.ClassA(arg1, arg2);

        assertEquals(arg1, a.arg1);
        assertSame(arg2, a.arg2);
    },

    'test static property': function() {
        var a1 = new this.ClassA();
        var a2 = new this.ClassA();

        assertSame(a1.$static.x, a2.$static.x);
        assertEquals(10, a1.$static.x[0]);

        var array = [];
        a1.$static.x = array;
        a1.$static.x.push(-1);
        assertSame(array, a2.$static.x);
        assertEquals(-1, a2.$static.x[0]);

        a1.$static.num = 20;
        assertEquals(20, a1.$static.num);
        assertEquals(20, a2.$static.num);
    },

    'test access constructor': function() {
        var a = new this.ClassA();

        assertSame(this.ClassA, a.constructor);
    }
});
