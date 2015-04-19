
class Tile extends GameObject {
    constructor(position: vec2, size: vec2) {
        super(position, size);
    }
} 

class TileSlope extends GameObject {
    angle: number;

    constructor(position: vec2, size: vec2, angle: number) {
        super(position, size);

        this.angle = angle;
    }
} 