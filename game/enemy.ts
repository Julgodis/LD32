class Enemy extends GameObject {

    hp: number;
    maxHp: number;

    playAttack: number = 0;
    currentAnimation: number;
    currentFrame: number;

    frameTime: number[][];
    animationData: number[];

    nextFrame: number;
    coordWidth: number;
    coordHeight: number;
    animate: boolean;

    doJump: number = 0;

    constructor(position: vec2, size: vec2) {
        super(position, size);

        this.maxHp = 100;
        this.hp = this.maxHp;
        this.nextFrame = 0;
        this.currentAnimation = 0;
        this.currentFrame = 0;
        this.coordWidth = 1;
        this.coordHeight = 1;
        this.frameTime = [[1]];
        this.animationData = [1];
        this.animate = false;
    }

    startAnimation(id: number) {
        this.currentAnimation = id;
        this.currentFrame = 0;
        this.animate = true;
    }

    stopAnimation() {
        this.animate = false;
    }

    update(time: number, dt: number) {
        if (time > this.nextFrame && this.animate) {
            this.currentFrame++;
            if (this.currentFrame >= this.animationData[this.currentAnimation])
                this.currentFrame = 0;

            this.nextFrame = time + this.frameTime[this.currentAnimation][this.currentFrame];
        }

        this.sprite.texCoords = new vec4([
            this.coordWidth * this.currentFrame,
            this.coordHeight * this.currentAnimation,
            this.coordWidth,
            this.coordHeight]);
    }

} 