
class Style {
    sprite: Sprite;
    animate: boolean = false;

    animationCount: number;
    animation: number = 0;
    maxFrames: number[];
    spf: number = 1;
    time: number;

    width: number;
    height: number;
    realWidth: number;
    realHeight: number;

    tx: number;
    ty: number;
    frame: number;

    x: number;

    constructor(sprite: Sprite) {
        this.sprite = sprite;
    }

    initialize() {
        this.tx = this.width / this.realWidth;
        this.ty = this.height / this.realHeight;

        if (!this.animate) return;

        this.frame = 0;
        this.time = 0;
        this.sprite.texCoords = new vec4([0, 0, this.tx, this.ty]);
    }

    update(time: number, dt: number) {
        if (!this.animate) return;

        if (time > this.time) {
            this.time = time + this.spf;

            this.frame++;
            if (this.frame >= this.maxFrames[this.animation])
                this.frame = 0;
        }

        this.sprite.texCoords = new vec4([this.tx * this.frame, this.ty * this.animation, this.tx, this.ty]);
    }
}

 