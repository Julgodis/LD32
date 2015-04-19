var vec2 = (function () {
    function vec2(values) {
        this.values = new Float32Array(2);
        if (values) {
            this.init(values);
        }
    }
    Object.defineProperty(vec2.prototype, "x", {
        get: function () {
            return this.values[0];
        },
        set: function (value) {
            this.values[0] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec2.prototype, "y", {
        get: function () {
            return this.values[1];
        },
        set: function (value) {
            this.values[1] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec2.prototype, "u", {
        get: function () {
            return this.values[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec2.prototype, "v", {
        get: function () {
            return this.values[1];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec2.prototype, "s", {
        get: function () {
            return this.values[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec2.prototype, "t", {
        get: function () {
            return this.values[1];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec2.prototype, "xy", {
        get: function () {
            return this;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec2.prototype, "st", {
        get: function () {
            return this;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec2.prototype, "uv", {
        get: function () {
            return this;
        },
        enumerable: true,
        configurable: true
    });
    vec2.from2 = function (vec) {
        var dest = new vec2();
        for (var i = 0; i < 2; i++) {
            dest.values[i] = vec.values[i];
        }
        return dest;
    };
    vec2.prototype.init = function (values) {
        for (var i = 0; i < 2; i++) {
            this.values[i] = values[i];
        }
        return this;
    };
    vec2.prototype.reset = function () {
        for (var i = 0; i < 2; i++) {
            this.values[i] = 0;
        }
    };
    vec2.prototype.copy = function (dest) {
        if (dest === void 0) { dest = null; }
        if (!dest)
            dest = new vec2();
        for (var i = 0; i < 2; i++) {
            dest.values[i] = this.values[i];
        }
        return dest;
    };
    vec2.prototype.length2 = function () {
        return this.x * this.x + this.y * this.y;
    };
    vec2.prototype.length = function () {
        return Math.sqrt(this.length2());
    };
    vec2.prototype.abs = function () {
        for (var i = 0; i < 2; i++) {
            this.values[i] = Math.abs(this.values[i]);
        }
        return this;
    };
    vec2.prototype.add = function (vec) {
        if (typeof vec == 'number') {
            for (var i = 0; i < 2; i++) {
                this.values[i] += vec;
            }
        }
        else {
            for (var i = 0; i < 2; i++) {
                this.values[i] += vec.values[i];
            }
        }
        return this;
    };
    vec2.prototype.sub = function (vec) {
        if (typeof vec == 'number') {
            for (var i = 0; i < 2; i++) {
                this.values[i] -= vec;
            }
        }
        else {
            for (var i = 0; i < 2; i++) {
                this.values[i] -= vec.values[i];
            }
        }
        return this;
    };
    vec2.prototype.mul = function (vec) {
        if (typeof vec == 'number') {
            for (var i = 0; i < 2; i++) {
                this.values[i] *= vec;
            }
        }
        else {
            for (var i = 0; i < 2; i++) {
                this.values[i] *= vec.values[i];
            }
        }
        return this;
    };
    vec2.prototype.div = function (vec) {
        if (typeof vec == 'number') {
            for (var i = 0; i < 2; i++) {
                this.values[i] /= vec;
            }
        }
        else {
            for (var i = 0; i < 2; i++) {
                this.values[i] /= vec.values[i];
            }
        }
        return this;
    };
    return vec2;
})();
//# sourceMappingURL=vec2.js.map