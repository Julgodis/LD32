var Style = (function () {
    function Style(sprite) {
        this.animate = false;
        this.animation = 0;
        this.spf = 1;
        this.sprite = sprite;
    }
    Style.prototype.initialize = function () {
        this.tx = this.width / this.realWidth;
        this.ty = this.height / this.realHeight;
        if (!this.animate)
            return;
        this.frame = 0;
        this.time = 0;
        this.sprite.texCoords = new vec4([0, 0, this.tx, this.ty]);
    };
    Style.prototype.update = function (time, dt) {
        if (!this.animate)
            return;
        if (time > this.time) {
            this.time = time + this.spf;
            this.frame++;
            if (this.frame >= this.maxFrames[this.animation])
                this.frame = 0;
        }
        this.sprite.texCoords = new vec4([this.tx * this.frame, this.ty * this.animation, this.tx, this.ty]);
    };
    return Style;
})();
//# sourceMappingURL=style.js.map