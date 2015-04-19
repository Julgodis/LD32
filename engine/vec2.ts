class vec2 {

    values = new Float32Array(2);

    get x(): number {
        return this.values[0];
    }

    set x(value: number) {
        this.values[0] = value;
    }

    get y(): number {
        return this.values[1];
    }

    set y(value: number) {
        this.values[1] = value;
    }

    get u(): number {
        return this.values[0];
    }

    get v(): number {
        return this.values[1];
    }

    get s(): number {
        return this.values[0];
    }

    get t(): number {
        return this.values[1];
    }

    get xy(): vec2 {
        return this;
    }

    get st(): vec2 {
        return this;
    }

    get uv(): vec2 {
        return this;
    }

    constructor(values?: number[]) {
        if (values) {
            this.init(values);
        }
    }

    static from2(vec: vec2) {
        var dest = new vec2();
        for (var i = 0; i < 2; i++) {
            dest.values[i] = vec.values[i];
        }

        return dest;
    }

    init(values: number[]) {
        for (var i = 0; i < 2; i++) {
            this.values[i] = values[i];
        }

        return this;
    }

    reset(): void {
        for (var i = 0; i < 2; i++) {
            this.values[i] = 0;
        }
    }

    copy(dest: vec2 = null): vec2 {
        if (!dest) dest = new vec2();

        for (var i = 0; i < 2; i++) {
            dest.values[i] = this.values[i];
        }

        return dest;
    }

    length2(): number {
        return this.x * this.x + this.y * this.y;
    }

    length(): number {
        return Math.sqrt(this.length2());
    }

    abs(): vec2 {
        for (var i = 0; i < 2; i++) {
            this.values[i] = Math.abs(this.values[i]);
        }

        return this;
    }

    add(vec: vec2|number) {
        if (typeof vec == 'number') {
            for (var i = 0; i < 2; i++) {
                this.values[i] += <number>vec;
            }
        } else {
            for (var i = 0; i < 2; i++) {
                this.values[i] += (<vec2>vec).values[i];
            }
        }

        return this;
    }

    sub(vec: vec2|number) {
        if (typeof vec == 'number') {
            for (var i = 0; i < 2; i++) {
                this.values[i] -= <number>vec;
            }
        } else {
            for (var i = 0; i < 2; i++) {
                this.values[i] -= (<vec2>vec).values[i];
            }
        }

        return this;
    }

    mul(vec: vec2|number) {
        if (typeof vec == 'number') {
            for (var i = 0; i < 2; i++) {
                this.values[i] *= <number>vec;
            }
        } else {
            for (var i = 0; i < 2; i++) {
                this.values[i] *= (<vec2>vec).values[i];
            }
        }

        return this;
    }

    div(vec: vec2|number) {
        if (typeof vec == 'number') {
            for (var i = 0; i < 2; i++) {
                this.values[i] /= <number>vec;
            }
        } else {
            for (var i = 0; i < 2; i++) {
                this.values[i] /= (<vec2>vec).values[i];
            }
        }

        return this;
    }
} 