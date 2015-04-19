
class Texture {

    context: WebGL
    image: HTMLImageElement;
    handle: WebGLTexture;

    mip: boolean;
    options: any;

    constructor(image: HTMLImageElement, mip: boolean = true, options: any = null) {
        this.image = image;
        this.mip = mip;
        this.options = options;
    }

    initialize(context: WebGL) {
        this.context = context;
        var gl = this.context.glContext;

        this.handle = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, this.handle);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);

        if (this.options != null &&
            this.options["pixelate"] != null &&
            this.options["pixelate"]) {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        } else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        }

        if (this.options != null &&
            this.options["repeat_x"] != null &&
            this.options["repeat_x"]) {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        }
        else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        }

        if (this.options != null &&
            this.options["repeat_y"] != null &&
            this.options["repeat_y"]) {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        }
        else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }

        if (this.mip) {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

            gl.generateMipmap(gl.TEXTURE_2D);
        }

        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    bind(index: number = 0) {
        var gl = this.context.glContext;

        gl.activeTexture(gl.TEXTURE0 + index);
        gl.bindTexture(gl.TEXTURE_2D, this.handle);
    }
} 