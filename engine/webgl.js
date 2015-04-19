/// <reference path="vec2.ts"/>
/// <reference path="vec3.ts"/>
/// <reference path="mat3.ts"/>
/// <reference path="texture.ts"/>
/// <reference path="shader.ts"/>
var Sprite = (function () {
    function Sprite(x, y, z, width, height) {
        this.enabled = true;
        this.flip = false;
        this.x = x;
        this.y = y;
        this.z = z;
        this.width = width;
        this.height = height;
        this.color = new vec4([1, 1, 1, 1]);
        this.matrix = mat3.makeIdentity();
        this.texCoords = new vec4([0, 0, 1, 1]);
        this.rotation = 0;
        this.shader = null;
        this.textures = [];
    }
    return Sprite;
})();
var Vertex = (function () {
    function Vertex(position, color, texture, matrix, flip) {
        if (position === void 0) { position = null; }
        if (color === void 0) { color = null; }
        if (texture === void 0) { texture = null; }
        if (matrix === void 0) { matrix = null; }
        if (flip === void 0) { flip = false; }
        this.position = position;
        this.color = color;
        this.texture = texture;
        this.matrix = matrix;
        this.flip = flip;
    }
    return Vertex;
})();
var Pass = (function () {
    function Pass(name) {
        this.vertSize = 4;
        this.size = 512;
        this.numVerts = this.size * this.vertSize;
        this.numIndices = this.size * 6;
        /*
    
            4 float position
            4 float color
            2 float texture
            9 float matrix?
    
        */
        this.useColor = true;
        this.useTexture = true;
        this.useMatrix = true;
        this.useFlip = true;
        this.stride = 4;
        this.name = name;
        this.sprites = {};
        this.shader = null;
        this.texture = null;
    }
    Pass.prototype.initialize = function (context) {
        var gl = context.glContext;
        this.stride = 4;
        if (this.useColor)
            this.stride += 4;
        if (this.useTexture)
            this.stride += 2;
        if (this.useMatrix)
            this.stride += 9;
        if (this.useFlip)
            this.stride += 1;
        this.numVerts *= this.stride;
        this.vertexBuffer = gl.createBuffer();
        this.indexBuffer = gl.createBuffer();
        this.vertices = new Float32Array(this.numVerts);
        this.indices = new Uint16Array(this.numIndices);
        this.verts = new Array(this.numVerts);
        for (var i = 0, j = 0; i < this.size; i += 1, j += 4) {
            this.indices[i * 6 + 0] = j + 0;
            this.indices[i * 6 + 1] = j + 1;
            this.indices[i * 6 + 2] = j + 2;
            this.indices[i * 6 + 3] = j + 0;
            this.indices[i * 6 + 4] = j + 2;
            this.indices[i * 6 + 5] = j + 3;
        }
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    };
    Pass.prototype._p8 = function (s) {
        if (s === void 0) { s = false; }
        var p = (Math.random().toString(16) + "000000000").substr(2, 8);
        return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
    };
    Pass.prototype.guid = function () {
        return this._p8() + this._p8(true) + this._p8(false);
    };
    Pass.prototype.addSprite = function (sprite) {
        var id = this.guid();
        while (this.sprites[id] != null) {
            id = this.guid();
        }
        sprite.guid = id;
        //console.log("add: " + sprite.guid);
        this.sprites[id] = sprite;
    };
    Pass.prototype.removeSprite = function (sprite) {
        //console.log("remove: " + sprite.guid);
        delete this.sprites[sprite.guid];
    };
    Pass.prototype.update = function (context, wireframe) {
        var _this = this;
        var gl = context.glContext;
        var keys = Object.keys(this.sprites);
        var values = keys.map(function (key) {
            return _this.sprites[key];
        });
        this.last = values.sort(function (a, b) {
            return a.z - b.z;
        }).filter(function (value) {
            return value.enabled;
        });
        var index = 0;
        for (var id in this.last) {
            var sprite = this.last[id];
            var a = new vec2([sprite.texCoords.x, sprite.texCoords.y]);
            var b = new vec2([sprite.texCoords.x + sprite.texCoords.z, sprite.texCoords.y]);
            var c = new vec2([sprite.texCoords.x + sprite.texCoords.z, sprite.texCoords.y + sprite.texCoords.w]);
            var d = new vec2([sprite.texCoords.x, sprite.texCoords.y + sprite.texCoords.w]);
            if (sprite.flip) {
                a.x = b.x;
                b.x = d.x;
                c.x = d.x;
                d.x = a.x;
            }
            this.verts[index + 0] = new Vertex(new vec4([sprite.x, sprite.y, sprite.z, sprite.rotation]), sprite.color, a, sprite.matrix, sprite.flip);
            this.verts[index + 1] = new Vertex(new vec4([sprite.x + sprite.width, sprite.y, sprite.z, sprite.rotation]), sprite.color, b, sprite.matrix, sprite.flip);
            this.verts[index + 2] = new Vertex(new vec4([sprite.x + sprite.width, sprite.y + sprite.height, sprite.z, sprite.rotation]), sprite.color, c, sprite.matrix, sprite.flip);
            this.verts[index + 3] = new Vertex(new vec4([sprite.x, sprite.y + sprite.height, sprite.z, sprite.rotation]), sprite.color, d, sprite.matrix, sprite.flip);
            index += 4;
        }
        index = 0;
        for (var id in this.verts) {
            var vert = this.verts[id];
            this.vertices[index + 0] = vert.position.x;
            this.vertices[index + 1] = vert.position.y;
            this.vertices[index + 2] = vert.position.z;
            this.vertices[index + 3] = vert.position.w;
            index += 4;
            if (this.useColor) {
                this.vertices[index + 0] = vert.color.r;
                this.vertices[index + 1] = vert.color.g;
                this.vertices[index + 2] = vert.color.b;
                this.vertices[index + 3] = vert.color.a;
                index += 4;
            }
            if (this.useTexture) {
                this.vertices[index + 0] = vert.texture.u;
                this.vertices[index + 1] = vert.texture.v;
                index += 2;
            }
            if (this.useMatrix) {
                for (var i = 0; i < 9; i++)
                    this.vertices[index + i] = vert.matrix.values[i];
                index += 9;
            }
            if (this.useFlip) {
                this.vertices[index + 0] = (vert.flip ? 1 : 0);
                index += 1;
            }
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
        var offset = 0;
        var vertex = this.shader.getVertexAttr("position");
        gl.enableVertexAttribArray(vertex.handle);
        gl.vertexAttribPointer(vertex.handle, 4, gl.FLOAT, false, this.stride * 4, offset * 4);
        offset += 4;
        if (this.useColor) {
            var color = this.shader.getVertexAttr("color");
            gl.enableVertexAttribArray(color.handle);
            gl.vertexAttribPointer(color.handle, 4, gl.FLOAT, false, this.stride * 4, offset * 4);
            offset += 4;
        }
        if (this.useTexture) {
            var coords = this.shader.getVertexAttr("texture");
            gl.enableVertexAttribArray(coords.handle);
            gl.vertexAttribPointer(coords.handle, 2, gl.FLOAT, false, this.stride * 4, offset * 4);
            offset += 2;
        }
        if (this.useMatrix) {
            var mA = this.shader.getVertexAttr("mA");
            var mB = this.shader.getVertexAttr("mB");
            var mC = this.shader.getVertexAttr("mC");
            gl.enableVertexAttribArray(mA.handle);
            gl.enableVertexAttribArray(mB.handle);
            gl.enableVertexAttribArray(mC.handle);
            gl.vertexAttribPointer(mA.handle, 3, gl.FLOAT, false, this.stride * 4, offset * 4);
            offset += 3;
            gl.vertexAttribPointer(mB.handle, 3, gl.FLOAT, false, this.stride * 4, offset * 4);
            offset += 3;
            gl.vertexAttribPointer(mC.handle, 3, gl.FLOAT, false, this.stride * 4, offset * 4);
            offset += 3;
        }
        if (this.useFlip) {
            var flip = this.shader.getVertexAttr("flip");
            gl.enableVertexAttribArray(flip.handle);
            gl.vertexAttribPointer(flip.handle, 1, gl.FLOAT, false, this.stride * 4, offset * 4);
            offset += 1;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    };
    Pass.prototype.render = function (context, world) {
        var gl = context.glContext;
        if (this.last == null)
            return;
        gl.useProgram(null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        var lastShader = this.shader;
        var lastTexture = [];
        if (this.texture != null)
            lastTexture.push(this.texture);
        for (var i in lastTexture) {
            var name = "sampler";
            if (i > 0)
                name += i;
            if (lastTexture[i] && lastShader) {
                if (lastShader.uniforms[name] != null)
                    lastShader.uniforms[name].value = lastTexture[i];
            }
        }
        if (lastShader) {
            if (lastShader.uniforms["size"])
                lastShader.uniforms["size"].value = new vec2([sprite.width, sprite.height]);
            if (lastShader.uniforms["world"])
                lastShader.uniforms["world"].value = world;
            lastShader.bind();
        }
        var offset = 0;
        var length = 0;
        for (var id in this.last) {
            var sprite = this.last[id];
            var changeShaders = (sprite.shader != null && lastShader != sprite.shader);
            var changeTextures = (sprite.textures != null && sprite.textures.length != 0);
            if (changeTextures && lastTexture != null) {
                changeTextures = false;
                if (lastTexture.length == sprite.textures.length)
                    for (var i in sprite.textures) {
                        if (lastTexture[i] != null || (sprite.textures[i].handle != lastTexture[i].handle)) {
                            changeTextures = true;
                            break;
                        }
                    }
                else
                    changeTextures = true;
            }
            if (changeShaders || changeTextures) {
                if (length > 0)
                    gl.drawElements(gl.TRIANGLES, length * 6, gl.UNSIGNED_SHORT, offset * 6 * 2);
                offset += length;
                length = 0;
                if (changeShaders)
                    lastShader = sprite.shader;
                if (changeTextures)
                    lastTexture = sprite.textures;
                for (var i in lastTexture) {
                    var name = "sampler";
                    if (i > 0)
                        name += i;
                    if (lastTexture[i] && lastShader) {
                        if (lastShader.uniforms[name] != null)
                            lastShader.uniforms[name].value = lastTexture[i];
                    }
                }
                if (lastShader) {
                    if (lastShader.uniforms["size"])
                        lastShader.uniforms["size"].value = new vec2([sprite.width, sprite.height]);
                    if (lastShader.uniforms["world"])
                        lastShader.uniforms["world"].value = world;
                    lastShader.bind();
                }
            }
            length++;
        }
        if (length > 0) {
            gl.drawElements(gl.TRIANGLES, length * 6, gl.UNSIGNED_SHORT, offset * 6 * 2);
        }
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    };
    return Pass;
})();
var WebGL = (function () {
    function WebGL(name, width, height, create) {
        if (create === void 0) { create = false; }
        this.loaded = false;
        this.wireframe = false;
        this.width = width;
        this.height = height;
        this.loaded = false;
        this.canvasElement = null;
        this.glContext = null;
        this.shaders = [];
        this.textures = [];
        this.passes = [];
        if (create) {
            var newCanvas = document.createElement("canvas");
            newCanvas.setAttribute("id", name);
            newCanvas.setAttribute("width", "" + width);
            newCanvas.setAttribute("height", "" + height);
            newCanvas.innerHTML = "Your browser doesn't appear to support the HTML5 <code>&lt;canvas&gt;</code> element.";
            document.body.appendChild(newCanvas);
        }
        try {
            this.canvasElement = document.getElementById(name);
            this.glContext = this.canvasElement.getContext("experimental-webgl", { antialias: true });
            this.glContext.viewport(0, 0, width, height);
        }
        catch (e) {
            alert("error: " + e);
        }
        if (!this.glContext) {
            alert("Unable to initialize WebGL. Your browser may not support it.");
        }
    }
    WebGL.prototype.initialize = function () {
        var gl = this.glContext;
        this.defaultShader = new Shader([
            "attribute vec4 position;",
            "attribute vec4 color;",
            "attribute vec2 texture;",
            "attribute float flip;",
            "attribute vec3 mA;",
            "attribute vec3 mB;",
            "attribute vec3 mC;",
            "",
            "uniform mat3 world;",
            "",
            "varying vec4 outColor;",
            "varying vec2 outTexture;",
            "varying float outFlip;",
            "",
            "void main(void) {",
            "    outColor = color;",
            "    outTexture = texture;",
            "    outFlip = flip;",
            "",
            "    mat3 transform = mat3(mA, mB, mC);",
            "    gl_Position = vec4(((world * transform) * vec3(position.xy, 1)).xy, 0, 1);",
            "}",
            "",
        ].join("\n"), [
            "precision mediump float;",
            "",
            "uniform sampler2D sampler;",
            "",
            "varying vec4 outColor;",
            "varying vec2 outTexture;",
            "",
            "void main(void) {",
            "    vec4 texel = texture2D(sampler, outTexture);",
            "    gl_FragColor = vec4(outColor.rgb * texel.rgb, texel.a * outColor.a);",
            "}",
            "",
        ].join("\n"));
        this.addShader(this.defaultShader);
        gl.disable(gl.DITHER);
        // gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        /* INIT MORE STUFF */
    };
    WebGL.prototype.addPass = function (name, shader, color, texture) {
        if (shader === void 0) { shader = null; }
        if (color === void 0) { color = true; }
        if (texture === void 0) { texture = true; }
        var pass = new Pass(name);
        pass.useColor = color;
        pass.useTexture = texture;
        pass.shader = shader;
        pass.initialize(this);
        pass.update(this, this.wireframe);
        this.passes.push(pass);
    };
    WebGL.prototype.addPassBasic = function (name) {
        var pass = new Pass(name);
        pass.shader = this.defaultShader;
        pass.initialize(this);
        pass.update(this, this.wireframe);
        this.passes.push(pass);
    };
    WebGL.prototype.addShader = function (shader) {
        shader.initialize(this);
        if (shader.hasUniform("world")) {
            shader.uniforms["world"] = {
                entry: shader.getUniform("world"),
                type: "mat3",
                value: mat3.makeIdentity()
            };
        }
        if (shader.hasUniform("size")) {
            shader.uniforms["size"] = {
                entry: shader.getUniform("size"),
                type: "vec2",
                value: mat3.makeIdentity()
            };
        }
        this.shaders.push(shader);
    };
    WebGL.prototype.addTexture = function (texture) {
        texture.initialize(this);
        this.textures.push(texture);
    };
    WebGL.prototype.preRender = function () {
        var gl = this.glContext;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        for (var index in this.passes) {
            this.passes[index].update(this, this.wireframe);
        }
    };
    WebGL.prototype.render = function (world) {
        if (world === void 0) { world = null; }
        var gl = this.glContext;
        if (world == null)
            world = mat3.makeIdentity();
        var view = mat3.make2DPerspective(this.width, this.height).multiply(world);
        for (var index in this.passes) {
            var pass = this.passes[index];
            pass.render(this, view);
        }
    };
    WebGL.prototype.postRender = function () {
        var gl = this.glContext;
        gl.flush();
        gl.useProgram(null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    };
    return WebGL;
})();
//# sourceMappingURL=webgl.js.map