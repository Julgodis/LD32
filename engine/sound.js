var Sound = (function () {
    function Sound(element) {
        this.audios = element;
    }
    Sound.Off = function () {
        Sound.isOff = true;
    };
    Sound.On = function () {
        Sound.isOff = false;
    };
    Object.defineProperty(Sound.prototype, "volume", {
        set: function (value) {
            for (var id in this.audios)
                this.audios[id].volume = value;
        },
        enumerable: true,
        configurable: true
    });
    Sound.prototype.play = function () {
        for (var id in this.audios) {
            if (this.audios[id].currentTime == 0 || this.audios[id].ended) {
                if (!Sound.isOff)
                    this.audios[id].play();
                return this.audios[id];
                break;
            }
        }
        return null;
    };
    Sound.isOff = false;
    return Sound;
})();
//# sourceMappingURL=sound.js.map