var vec3 = (function () {
    function vec3(values) {
        this.values = new Float32Array(3);
        if (values) {
            this.init(values);
        }
    }
    Object.defineProperty(vec3.prototype, "x", {
        get: function () {
            return this.values[0];
        },
        set: function (value) {
            this.values[0] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "y", {
        get: function () {
            return this.values[1];
        },
        set: function (value) {
            this.values[1] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "z", {
        get: function () {
            return this.values[2];
        },
        set: function (value) {
            this.values[2] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "r", {
        get: function () {
            return this.values[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "g", {
        get: function () {
            return this.values[1];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "b", {
        get: function () {
            return this.values[2];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "xyz", {
        get: function () {
            return this;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "rgb", {
        get: function () {
            return this;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "xy", {
        get: function () {
            return new vec2([this.x, this.y]);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "yz", {
        get: function () {
            return new vec2([this.y, this.z]);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "xz", {
        get: function () {
            return new vec2([this.x, this.z]);
        },
        enumerable: true,
        configurable: true
    });
    vec3.from2 = function (vec, z) {
        var dest = new vec3([
            vec.values[0],
            vec.values[1],
            z
        ]);
        return dest;
    };
    vec3.from3 = function (vec) {
        var dest = new vec3([
            vec.values[0],
            vec.values[1],
            vec.values[2]
        ]);
        return dest;
    };
    vec3.prototype.init = function (values) {
        for (var i = 0; i < 3; i++) {
            this.values[i] = values[i];
        }
        return this;
    };
    vec3.prototype.reset = function () {
        for (var i = 0; i < 3; i++) {
            this.values[i] = 0;
        }
    };
    vec3.prototype.copy = function (dest) {
        if (dest === void 0) { dest = null; }
        if (!dest)
            dest = new vec3();
        for (var i = 0; i < 3; i++) {
            dest.values[i] = this.values[i];
        }
        return dest;
    };
    vec3.prototype.length2 = function () {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    };
    vec3.prototype.length = function () {
        return Math.sqrt(this.length2());
    };
    vec3.prototype.add = function (vec) {
        if (typeof vec == 'number') {
            for (var i = 0; i < 3; i++) {
                this.values[i] += vec;
            }
        }
        else {
            for (var i = 0; i < 3; i++) {
                this.values[i] += vec.values[i];
            }
        }
        return this;
    };
    vec3.prototype.sub = function (vec) {
        if (typeof vec == 'number') {
            for (var i = 0; i < 3; i++) {
                this.values[i] -= vec;
            }
        }
        else {
            for (var i = 0; i < 3; i++) {
                this.values[i] -= vec.values[i];
            }
        }
        return this;
    };
    vec3.prototype.mul = function (vec) {
        if (typeof vec == 'number') {
            for (var i = 0; i < 3; i++) {
                this.values[i] *= vec;
            }
        }
        else {
            for (var i = 0; i < 3; i++) {
                this.values[i] *= vec.values[i];
            }
        }
        return this;
    };
    vec3.prototype.div = function (vec) {
        if (typeof vec == 'number') {
            for (var i = 0; i < 3; i++) {
                this.values[i] /= vec;
            }
        }
        else {
            for (var i = 0; i < 3; i++) {
                this.values[i] /= vec.values[i];
            }
        }
        return this;
    };
    return vec3;
})();
//# sourceMappingURL=vec3.js.map