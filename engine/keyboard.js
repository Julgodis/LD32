var KeyboardKey = (function () {
    function KeyboardKey() {
    }
    return KeyboardKey;
})();
var Keyboard = (function () {
    function Keyboard(canvas) {
        var _this = this;
        this.canvas = canvas;
        this.keysDown = new Array(256);
        this.canvas.tabIndex = 1000;
        this.canvas.focus();
        this.canvas.onkeydown = function (event) {
            var key = event.which || event.keyCode;
            if (_this.keysDown[key] == null) {
                _this.keysDown[key] = new KeyboardKey();
                _this.keysDown[key].keyCode = key;
            }
            _this.keysDown[key].isDown = true;
        };
        this.canvas.onkeyup = function (event) {
            var key = event.which || event.keyCode;
            if (_this.keysDown[key] == null) {
                _this.keysDown[key] = new KeyboardKey();
                _this.keysDown[key].keyCode = key;
            }
            _this.keysDown[key].isDown = false;
        };
    }
    Keyboard.prototype.update = function () {
        for (var id in this.keysDown) {
            var key = this.keysDown[id];
            key.change = (key.value != key.isDown);
            key.value = key.isDown;
        }
    };
    Keyboard.prototype.isDown = function (key) {
        if (this.keysDown[key] == null)
            return false;
        return this.keysDown[key].value;
    };
    Keyboard.prototype.isUp = function (key) {
        return !this.isDown(key);
    };
    Keyboard.prototype.press = function (key) {
        if (this.keysDown[key] == null)
            return false;
        return this.keysDown[key].value && this.keysDown[key].change;
    };
    return Keyboard;
})();
//# sourceMappingURL=keyboard.js.map