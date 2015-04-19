
class KeyboardKey {
    keyCode: number;
    isDown: boolean;

    value: boolean;
    change: boolean;
}

class Keyboard {

    canvasId: string;
    canvas: HTMLCanvasElement;

    keysDown: Array<KeyboardKey>;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.keysDown = new Array<KeyboardKey>(256);

        this.canvas.tabIndex = 1000;
        this.canvas.focus();
        this.canvas.onkeydown = (event) => {
            var key = event.which || event.keyCode;

            if (this.keysDown[key] == null) {
                this.keysDown[key] = new KeyboardKey();
                this.keysDown[key].keyCode = key;
            }

            this.keysDown[key].isDown = true;
        };

        this.canvas.onkeyup = (event) => {
            var key = event.which || event.keyCode;
            
            if (this.keysDown[key] == null) {
                this.keysDown[key] = new KeyboardKey();
                this.keysDown[key].keyCode = key;
            }

            this.keysDown[key].isDown = false;
        };
    }

    update() {
        for (var id in this.keysDown) {
            var key = this.keysDown[id];

            key.change = (key.value != key.isDown);
            key.value = key.isDown;
        }
    }

    isDown(key: number) {
        if (this.keysDown[key] == null)
            return false;

        return this.keysDown[key].value;
    }

    isUp(key: number) {
        return !this.isDown(key);
    }

    press(key: number) {
        if (this.keysDown[key] == null)
            return false;

        return this.keysDown[key].value && this.keysDown[key].change;
    }
} 