
class Player extends GameObject {
    onWall: boolean = false;
    wallDirection: number = 0;
    grabRange: number = ppm * 5;

    jumpDown: boolean = false;
    moveDirection: number = 0;

    speed: vec2 = new vec2([8, -8]);
    pushSpeed: vec2 = new vec2([4, -7]);
    turnSpeed: number = 3;
    maxWallSpeed: vec2 = new vec2([0, 1.8]);

    hp: number;
    maxHp: number;

    currentAnimation: number;
    currentFrame: number;

    frameTime: number[][];
    animationData: number[];

    nextFrame: number;
    coordWidth: number;
    coordHeight: number;
    animate: boolean;

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

    updateInput() {
        this.moveDirection = 0;

        if (keyboard.isDown(65)) { this.moveDirection = -1; this.sprite.flip = this.onWall ? false: true; }
        else if (keyboard.isDown(68)) { this.moveDirection = 1; this.sprite.flip = this.onWall ? true : false; }

        if (Math.abs(this.velocity.x) >= Math.abs(this.velocity.y)) {

            if (this.currentAnimation != 1)
                this.startAnimation(1);

            if (Math.abs(this.velocity.x) < 0.2)
                this.startAnimation(0);

        } else {

            if (!this.onGround && this.currentAnimation != 3)
                this.startAnimation(3);

            if (this.onGround) {
                this.startAnimation(0);
            }

        }

        this.jumpDown = keyboard.isDown(87) || keyboard.isDown(32);

        if (this.jumpDown) {
            this.startAnimation(3);
        }
    }

    walk(dt: number): boolean {
        if (this.moveDirection != 0) {

            var currrentDirection = ((this.velocity.x > 0) ? 1 : (this.velocity.x < 0 ? -1 : 0));
            var speed = this.speed.x;
            if (currrentDirection != 0 && this.moveDirection != currrentDirection) {
                speed *= this.turnSpeed;
            }

            this.velocity.x += speed * this.moveDirection * dt;
            return true;
        }

        return false;
    }

    groundUpdate(dt: number) {
        if (this.jumpDown) this.velocity.y = this.speed.y;
        else this.velocity.y = 0;

        if (!this.walk(dt))
            this.velocity.x *= 0.80;
    }

    wallUpdate(dt: number) {
        if (this.jumpDown && this.velocity.y > 0) {
            this.velocity.y = this.pushSpeed.y;
            this.velocity.x = this.pushSpeed.x * -this.wallDirection;
        } else {
            if (this.velocity.y > this.maxWallSpeed.y)
                this.velocity.y = this.maxWallSpeed.y;
        }

        if (this.walk(dt))
            this.velocity.x *= 1.50;
    }

    airUpdate(dt: number) {
        if (this.velocity.y < 0 && !this.jumpDown)
            this.velocity.y *= 0.95;

        if (!this.walk(dt))
            this.velocity.x *= 0.99;
    }
}