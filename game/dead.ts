
class Dead extends GameObject {

    rotation: number;
    radius: number;
    time: number;
    maxTime: number;

    constructor(position: vec2, size: vec2, radius: number) {
        super(position, size);

        this.rotation = 0;
        this.radius = radius;
        this.fixedAngle = 0.9;

        this.maxTime = 5.0;
        this.time = this.maxTime;
    }
} 