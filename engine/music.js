var Music = (function () {
    function Music(element, loop) {
        if (loop === void 0) { loop = false; }
        this.audio = element;
        this.audio.loop = loop;
    }
    Music.Off = function () {
        Music.isOff = true;
    };
    Music.On = function () {
        Music.isOff = false;
    };
    Object.defineProperty(Music.prototype, "volume", {
        get: function () {
            return this.audio.volume;
        },
        set: function (value) {
            this.audio.volume = value;
        },
        enumerable: true,
        configurable: true
    });
    Music.prototype.play = function () {
        if (!Music.isOff)
            this.audio.play();
    };
    Music.prototype.stop = function () {
        this.audio.pause();
    };
    Music.isOff = false;
    return Music;
})();
//# sourceMappingURL=music.js.map