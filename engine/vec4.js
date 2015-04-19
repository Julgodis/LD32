var vec4 = (function () {
    function vec4(values) {
        this.values = new Float32Array(4);
        if (values) {
            this.init(values);
        }
    }
    Object.defineProperty(vec4.prototype, "x", {
        get: function () {
            return this.values[0];
        },
        set: function (value) {
            this.values[0] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "y", {
        get: function () {
            return this.values[1];
        },
        set: function (value) {
            this.values[1] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "z", {
        get: function () {
            return this.values[2];
        },
        set: function (value) {
            this.values[2] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "w", {
        get: function () {
            return this.values[3];
        },
        set: function (value) {
            this.values[3] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "r", {
        get: function () {
            return this.values[0];
        },
        set: function (value) {
            this.values[0] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "g", {
        get: function () {
            return this.values[1];
        },
        set: function (value) {
            this.values[1] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "b", {
        get: function () {
            return this.values[2];
        },
        set: function (value) {
            this.values[2] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "a", {
        get: function () {
            return this.values[3];
        },
        set: function (value) {
            this.values[3] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xyzw", {
        get: function () {
            return this;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "rgba", {
        get: function () {
            return this;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xy", {
        get: function () {
            return new vec2([this.x, this.y]);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yz", {
        get: function () {
            return new vec2([this.y, this.z]);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xz", {
        get: function () {
            return new vec2([this.x, this.z]);
        },
        enumerable: true,
        configurable: true
    });
    vec4.from2 = function (vec, z) {
        var dest = new vec4([
            vec.values[0],
            vec.values[1],
            z
        ]);
        return dest;
    };
    vec4.from4 = function (vec) {
        var dest = new vec4([
            vec.values[0],
            vec.values[1],
            vec.values[2]
        ]);
        return dest;
    };
    vec4.prototype.init = function (values) {
        for (var i = 0; i < 4; i++) {
            this.values[i] = values[i];
        }
        return this;
    };
    vec4.prototype.reset = function () {
        for (var i = 0; i < 4; i++) {
            this.values[i] = 0;
        }
    };
    vec4.prototype.copy = function (dest) {
        if (dest === void 0) { dest = null; }
        if (!dest)
            dest = new vec4();
        for (var i = 0; i < 4; i++) {
            dest.values[i] = this.values[i];
        }
        return dest;
    };
    vec4.prototype.add = function (vec) {
        if (typeof vec == 'number') {
            for (var i = 0; i < 4; i++) {
                this.values[i] += vec;
            }
        }
        else {
            for (var i = 0; i < 4; i++) {
                this.values[i] += vec.values[i];
            }
        }
        return this;
    };
    vec4.prototype.sub = function (vec) {
        if (typeof vec == 'number') {
            for (var i = 0; i < 4; i++) {
                this.values[i] -= vec;
            }
        }
        else {
            for (var i = 0; i < 4; i++) {
                this.values[i] -= vec.values[i];
            }
        }
        return this;
    };
    vec4.prototype.mul = function (vec) {
        if (typeof vec == 'number') {
            for (var i = 0; i < 4; i++) {
                this.values[i] *= vec;
            }
        }
        else {
            for (var i = 0; i < 4; i++) {
                this.values[i] *= vec.values[i];
            }
        }
        return this;
    };
    vec4.prototype.div = function (vec) {
        if (typeof vec == 'number') {
            for (var i = 0; i < 4; i++) {
                this.values[i] /= vec;
            }
        }
        else {
            for (var i = 0; i < 4; i++) {
                this.values[i] /= vec.values[i];
            }
        }
        return this;
    };
    return vec4;
})();
//# sourceMappingURL=vec4.js.map