

class vec4 {
    values = new Float32Array(4);

    get x(): number {
        return this.values[0];
    }

    get y(): number {
        return this.values[1];
    }

    get z(): number {
        return this.values[2];
    }

    get w(): number {
        return this.values[3];
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

    get a(): number {
        return this.values[3];
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

    set w(value: number) {
        this.values[3] = value;
    }

    set r(value: number) {
        this.values[0] = value;
    }

    set g(value: number) {
        this.values[1] = value;
    }

    set b(value: number) {
        this.values[2] = value;
    }

    set a(value: number) {
        this.values[3] = value;
    }

    get xyzw(): vec4 {
        return this;
    }

    get rgba(): vec4 {
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

    static from2(vec: vec2, z: number): vec4 {
        var dest = new vec4([
            vec.values[0],
            vec.values[1],
            z
        ]);

        return dest;
    }

    static from4(vec: vec4): vec4 {
        var dest = new vec4([
            vec.values[0],
            vec.values[1],
            vec.values[2]
        ]);

        return dest;
    }

    init(values: number[]) {
        for (var i = 0; i < 4; i++) {
            this.values[i] = values[i];
        }

        return this;
    }

    reset(): void {
        for (var i = 0; i < 4; i++) {
            this.values[i] = 0;
        }
    }

    copy(dest: vec4 = null): vec4 {
        if (!dest) dest = new vec4();

        for (var i = 0; i < 4; i++) {
            dest.values[i] = this.values[i];
        }

        return dest;
    }

    add(vec: vec4|number) {
        if (typeof vec == 'number') {
            for (var i = 0; i < 4; i++) {
                this.values[i] += <number>vec;
            }
        } else {
            for (var i = 0; i < 4; i++) {
                this.values[i] += (<vec4>vec).values[i];
            }
        }

        return this;
    }

    sub(vec: vec4|number) {
        if (typeof vec == 'number') {
            for (var i = 0; i < 4; i++) {
                this.values[i] -= <number>vec;
            }
        } else {
            for (var i = 0; i < 4; i++) {
                this.values[i] -= (<vec4>vec).values[i];
            }
        }

        return this;
    }

    mul(vec: vec4|number) {
        if (typeof vec == 'number') {
            for (var i = 0; i < 4; i++) {
                this.values[i] *= <number>vec;
            }
        } else {
            for (var i = 0; i < 4; i++) {
                this.values[i] *= (<vec4>vec).values[i];
            }
        }

        return this;
    }

    div(vec: vec4|number) {
        if (typeof vec == 'number') {
            for (var i = 0; i < 4; i++) {
                this.values[i] /= <number>vec;
            }
        } else {
            for (var i = 0; i < 4; i++) {
                this.values[i] /= (<vec4>vec).values[i];
            }
        }

        return this;
    }
}   