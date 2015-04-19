var Light = (function () {
    function Light(position, radius, strength, color) {
        if (strength === void 0) { strength = 1; }
        if (color === void 0) { color = new vec3([1.0, 1.0, 1.0]); }
        this.position = position;
        this.start_position = this.position;
        this.radius = radius;
        this.start_radius = this.radius;
        this.strength = strength;
        this.color = color;
        this.torch = false;
        this.random = Math.random();
    }
    Light.prototype.update = function (time, dt) {
        if (this.torch) {
            this.position = new vec3([
                this.start_position.x + Math.cos(time * 20) * 1,
                this.start_position.y + Math.sin(time * 20) * 6,
                this.start_position.z
            ]);
            this.radius = Math.cos((time + this.random) * 10) * 10 + this.start_radius;
        }
    };
    return Light;
})();
//# sourceMappingURL=light.js.map