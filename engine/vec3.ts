

class vec3 {
    values = new Float32Array(3);

    get x(): number {
        return this.values[0];
    }

    get y(): number {
        return this.values[1];
    }

    get z(): number {
        return this.values[2];
    }

    set x(value: number) {
        this.values[0] = value;
    }

    set y(value: number) {
        this.values[1] = value;
    }

    set z(value: number) {
        this.values[2] = value;
    }


    get r(): number {
        return this.values[0];
    }

    get g(): number {
        return this.values[1];
    }

    get b(): number {
        return this.values[2];
    }

    get xyz(): vec3 {
        return this;
    }

    get rgb(): vec3 {
        return this;
    }

    get xy(): vec2 {
        return new vec2([this.x, this.y]);
    }

    get yz(): vec2 {
        return new vec2([this.y, this.z]);
    }

    get xz(): vec2 {
        return new vec2([this.x, this.z]);
    }


    constructor(values?: number[]) {
        if (values) {
            this.init(values);
        }
    }

    static from2(vec: vec2, z: number): vec3 {
        var dest = new vec3([
            vec.values[0],
            vec.values[1],
            z
        ]);

        return dest;
    }

    static from3(vec: vec3): vec3 {
        var dest = new vec3([
            vec.values[0],
            vec.values[1],
            vec.values[2]
        ]);

        return dest;
    }

    init(values: number[]) {
        for (var i = 0; i < 3; i++) {
            this.values[i] = values[i];
        }

        return this;
    }

    reset(): void {
        for (var i = 0; i < 3; i++) {
            this.values[i] = 0;
        }
    }

    copy(dest: vec3 = null): vec3 {
        if (!dest) dest = new vec3();

        for (var i = 0; i < 3; i++) {
            dest.values[i] = this.values[i];
        }

        return dest;
    }

    length2(): number {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    length(): number {
        return Math.sqrt(this.length2());
    }

    add(vec: vec3|number) {
        if (typeof vec == 'number') {
            for (var i = 0; i < 3; i++) {
                this.values[i] += <number>vec;
            }
        } else {
            for (var i = 0; i < 3; i++) {
                this.values[i] += (<vec3>vec).values[i];
            }
        }

        return this;
    }

    sub(vec: vec3|number) {
        if (typeof vec == 'number') {
            for (var i = 0; i < 3; i++) {
                this.values[i] -= <number>vec;
            }
        } else {
            for (var i = 0; i < 3; i++) {
                this.values[i] -= (<vec3>vec).values[i];
            }
        }

        return this;
    }

    mul(vec: vec3|number) {
        if (typeof vec == 'number') {
            for (var i = 0; i < 3; i++) {
                this.values[i] *= <number>vec;
            }
        } else {
            for (var i = 0; i < 3; i++) {
                this.values[i] *= (<vec3>vec).values[i];
            }
        }

        return this;
    }

    div(vec: vec3|number) {
        if (typeof vec == 'number') {
            for (var i = 0; i < 3; i++) {
                this.values[i] /= <number>vec;
            }
        } else {
            for (var i = 0; i < 3; i++) {
                this.values[i] /= (<vec3>vec).values[i];
            }
        }

        return this;
    }
}  