TestCase('nClassInstanceTest', {
    setUp: function() {
        this.ClassA = nClass({
            data: null,

            initialize: function() {
                this.data = [1, 2, 3];
            },

            say: function() {
                return ['ClassA'];
            },

            getData: function() {
                return this.data;
            },

            getThis: function() {
                return this;
            }
        });

        this.InstanceA = nClass.instance(this.ClassA, {
            arg1: null,
            arg2: null,

            initialize: function($super, arg1, arg2) {
                $super();
                this.arg1 = arg1;
                this.arg2 = arg2;
            },

            echo: function(str) {
                return str;
            },

            add: function(num1, num2) {
                return num1 + num2;
            },

            say: function($super) {
                var res = $super();
                res.push('InstanceA');
                return res;
            }
        });

        this.arg1 = 'foo';
        this.arg2 = [10, 20, 30];
        this.InstanceA.initialize(this.arg1, this.arg2);
    },

    'test instance': function() {
        var str = 'foo';
        assertEquals(str, this.InstanceA.echo(str));
    },

    'test initialize': function() {
        assertEquals(this.arg1, this.InstanceA.arg1);
        assertSame(this.arg2, this.InstanceA.arg2);
        assertEquals([1, 2, 3], this.InstanceA.data);
    },

    'test instance of': function() {
        assertTrue(this.InstanceA instanceof this.ClassA);
    },

    'test super class function': function() {
        var a = 1;
        var b = 10;

        assertEquals(a + b, this.InstanceA.add(a, b));
    },

    'test override': function() {
        var res = this.InstanceA.say();

        assertEquals(['ClassA', 'InstanceA'], res);
    },

    'test this in function': function() {
        assertEquals([1, 2, 3], this.InstanceA.getData());
        assertSame(this.InstanceA, this.InstanceA.getThis());
    }
});
