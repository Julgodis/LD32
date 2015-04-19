
class Rock extends GameObject {
    radius: number;
    rotation: number;

    constructor(position: vec2, size: vec2, radius: number) {
        super(position, size);

        this.rotation = 0;
        this.radius = radius;
        this.fixedAngle = 0.9;
    }


} 