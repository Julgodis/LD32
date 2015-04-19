class GameObject {
    isStatic: boolean = false;

    size: vec2;
    position: vec2;
    offset: vec2;
    velocity: vec2;

    maxVelocity: vec2;

    onGround: boolean = false;
    angleGravity: number;
    fixedAngle: number;
    sprite: Sprite;

    remove: boolean;

    constructor(position: vec2, size: vec2) {
        this.position = position;
        this.size = size;

        this.velocity = new vec2([0, 0]);
        this.maxVelocity = new vec2([4, 10]);
        this.angleGravity = -90;
        this.fixedAngle = 1;
        this.offset = new vec2([0, 0]);
        this.remove = false;
    }

    get min(): vec2 {
        if (this.sprite.flip) {
            return new vec2([this.position.x + this.sprite.width*ppm - this.size.x - this.offset.x, this.position.y + this.offset.y]);
        }
        return new vec2([this.position.x, this.position.y]).add(this.offset);
    }

    get max(): vec2 {
        return this.min.add(this.size);
    }
} 