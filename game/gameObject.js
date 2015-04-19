var GameObject = (function () {
    function GameObject(position, size) {
        this.isStatic = false;
        this.onGround = false;
        this.position = position;
        this.size = size;
        this.velocity = new vec2([0, 0]);
        this.maxVelocity = new vec2([4, 10]);
        this.angleGravity = -90;
        this.fixedAngle = 1;
        this.offset = new vec2([0, 0]);
        this.remove = false;
    }
    Object.defineProperty(GameObject.prototype, "min", {
        get: function () {
            if (this.sprite.flip) {
                return new vec2([this.position.x + this.sprite.width * ppm - this.size.x - this.offset.x, this.position.y + this.offset.y]);
            }
            return new vec2([this.position.x, this.position.y]).add(this.offset);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameObject.prototype, "max", {
        get: function () {
            return this.min.add(this.size);
        },
        enumerable: true,
        configurable: true
    });
    return GameObject;
})();
//# sourceMappingURL=gameObject.js.map