class Light {
    start_position: vec3;
    position: vec3;
    radius: number;
    start_radius: number;
    strength: number;
    color: vec3;

    torch: boolean;
    random: number;

    constructor(
        position: vec3,
        radius: number,
        strength: number = 1,
        color: vec3 = new vec3([1.0, 1.0, 1.0])) {

        this.position = position;
        this.start_position = this.position;
        this.radius = radius;
        this.start_radius = this.radius;
        this.strength = strength;
        this.color = color;
        this.torch = false;
        this.random = Math.random();
    }

    update(time: number, dt: number) {
        if (this.torch) {

            this.position = new vec3([
                this.start_position.x + Math.cos(time * 20) * 1,
                this.start_position.y + Math.sin(time * 20) * 6,
                this.start_position.z]);
            this.radius = Math.cos((time + this.random) * 10) * 10 + this.start_radius;
        }
    }
}