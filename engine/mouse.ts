
class Mouse {

    canvasId: string;
    canvas: HTMLCanvasElement;

    position: vec2;
    leftDown: boolean;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.position = new vec2([0, 0]);
        this.leftDown = false;

        this.canvas.onmousemove = (event) => {
            var rect = this.canvas.getBoundingClientRect();
            this.position = new vec2([
                event.clientX - rect.left,
                event.clientY - rect.top
            ]);
        }

        this.canvas.onmousedown = (event) => {
            if (event.button == 0)
                this.leftDown = true;

        };

        this.canvas.onmouseup = (event) => {
            if (event.button == 0)
                this.leftDown = false;

        };
    }
}