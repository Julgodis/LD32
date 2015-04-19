/// <reference path="vec2.ts"/>

class mat3 {

    values = new Float32Array(9);

    constructor(values?: number[]) {
        if (values) {
            this.init(values);
        }
    }

    init(values: number[]) {
        for (var i = 0; i < 9; i++) {
            this.values[i] = values[i];
        }

        return this;
    }

    reset(): void {
        for (var i = 0; i < 9; i++) {
            this.values[i] = 0;
        }
    }

    copy(dest: mat3 = null): mat3 {
        if (!dest) dest = new mat3();

        for (var i = 0; i < 9; i++) {
            dest.values[i] = this.values[i];
        }

        return dest;
    }

    setIdentity(): mat3 {
        this.init([
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ]);

        return this;
    }

    set2DPerspective(width: number, height: number) {
        var w = 2.0 / width;
        var h = -2.0 / height;

        this.init([
            w, 0, 0,
            0, h, 0,
           -1, 1, 1
        ]);

        return this;
    }

    setTranslate(x: number, y: number) {
        this.init([
            1, 0, 0,
            0, 1, 0,
            x, y, 1
        ]);

        return this;
    }

    setRotate(angle: number) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);

        this.init([
            c,-s, 0,
            s, c, 0,
            0, 0, 1
        ]);

        return this;
    }

    setScale(x: number, y: number) {
        this.init([
            x, 0, 0,
            0, y, 0,
            0, 0, 1
        ]);

        return this;
    }

    multiply(mat: mat3) {
        var a00 = this.values[0 * 3 + 0];
        var a01 = this.values[0 * 3 + 1];
        var a02 = this.values[0 * 3 + 2];
        var a10 = this.values[1 * 3 + 0];
        var a11 = this.values[1 * 3 + 1];
        var a12 = this.values[1 * 3 + 2];
        var a20 = this.values[2 * 3 + 0];
        var a21 = this.values[2 * 3 + 1];
        var a22 = this.values[2 * 3 + 2];
        var b00 = mat.values[0 * 3 + 0];
        var b01 = mat.values[0 * 3 + 1];
        var b02 = mat.values[0 * 3 + 2];
        var b10 = mat.values[1 * 3 + 0];
        var b11 = mat.values[1 * 3 + 1];
        var b12 = mat.values[1 * 3 + 2];
        var b20 = mat.values[2 * 3 + 0];
        var b21 = mat.values[2 * 3 + 1];
        var b22 = mat.values[2 * 3 + 2];

        this.init([
            a00 * b00 + a01 * b10 + a02 * b20,
            a00 * b01 + a01 * b11 + a02 * b21,
            a00 * b02 + a01 * b12 + a02 * b22,
            a10 * b00 + a11 * b10 + a12 * b20,
            a10 * b01 + a11 * b11 + a12 * b21,
            a10 * b02 + a11 * b12 + a12 * b22,
            a20 * b00 + a21 * b10 + a22 * b20,
            a20 * b01 + a21 * b11 + a22 * b21,
            a20 * b02 + a21 * b12 + a22 * b22
        ]);
        return this;
    }

    vector(v2: vec2 = null): vec2 {
        var vec = vec3.from2(v2, 1);

        var ret3 = new vec3([
            this.values[0] * vec.x + this.values[3] * vec.y + this.values[6] * vec.z,
            this.values[1] * vec.x + this.values[4] * vec.y + this.values[7] * vec.z,
            this.values[2] * vec.x + this.values[5] * vec.y + this.values[8] * vec.z
        ]);

        return ret3.div(ret3.z).xy;
    }

    static makeIdentity(): mat3 {
        return (new mat3()).setIdentity();
    }

    static make2DPerspective(width: number, height: number): mat3 {
        return (new mat3()).set2DPerspective(width, height);
    }

    static makeTranslate(x: number, y: number): mat3 {
        return (new mat3()).setTranslate(x, y);
    }

    static makeRotation(angle: number): mat3 {
        return (new mat3()).setRotate(angle);
    }

    static makeScale(x: number, y: number): mat3 {
        return (new mat3()).setScale(x, y);
    }
} 