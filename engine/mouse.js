var Mouse = (function () {
    function Mouse(canvas) {
        var _this = this;
        this.canvas = canvas;
        this.position = new vec2([0, 0]);
        this.leftDown = false;
        this.canvas.onmousemove = function (event) {
            var rect = _this.canvas.getBoundingClientRect();
            _this.position = new vec2([
                event.clientX - rect.left,
                event.clientY - rect.top
            ]);
        };
        this.canvas.onmousedown = function (event) {
            if (event.button == 0)
                _this.leftDown = true;
        };
        this.canvas.onmouseup = function (event) {
            if (event.button == 0)
                _this.leftDown = false;
        };
    }
    return Mouse;
})();
//# sourceMappingURL=mouse.js.map