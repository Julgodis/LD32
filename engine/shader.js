/// <reference path="loader.ts"/>
var Shader = (function () {
    function Shader(vertex, frag) {
        this.customUniforms = null;
        this.texId = 0;
        this.fragmentShaderContent = frag;
        this.vertexShaderContent = vertex;
        this.textureMap = [];
        this.uniforms = {};
    }
    Shader.prototype.initialize = function (context) {
        this.webgl = context;
        var gl = this.webgl.glContext;
        this.vertexPointersCache = {};
        this.uniformsCache = {};
        this.vertexShader = gl.createShader(gl.VERTEX_SHADER);
        this.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(this.vertexShader, this.vertexShaderContent);
        gl.shaderSource(this.fragmentShader, this.fragmentShaderContent);
        gl.compileShader(this.vertexShader);
        gl.compileShader(this.fragmentShader);
        if (!gl.getShaderParameter(this.vertexShader, gl.COMPILE_STATUS)) {
            alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(this.vertexShader));
            return null;
        }
        if (!gl.getShaderParameter(this.fragmentShader, gl.COMPILE_STATUS)) {
            alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(this.fragmentShader));
            return null;
        }
        this.program = gl.createProgram();
        gl.attachShader(this.program, this.vertexShader);
        gl.attachShader(this.program, this.fragmentShader);
        gl.linkProgram(this.program);
        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            alert("Unable to initialize the shader program: " + gl.getProgramInfoLog(this.program));
        }
        gl.validateProgram(this.program);
        if (!gl.getProgramParameter(this.program, gl.VALIDATE_STATUS)) {
            alert("Unable to validate the shader program " + gl.getProgramInfoLog(this.program));
        }
        gl.useProgram(this.program);
        gl.useProgram(null);
        if (gl.getError() != gl.NO_ERROR) {
            alert("" + gl.getError());
        }
        for (var i = 0; i < 4; i++) {
            var name = "sampler" + (i > 0 ? "" + i : "");
            var textureHandle = gl.getUniformLocation(this.program, name);
            if (textureHandle == null)
                continue;
            this.uniforms[name] = {
                entry: this.getUniform(name),
                type: "texture",
                value: null,
                names: [],
                array_type: ""
            };
        }
        if (this.customUniforms != null) {
            for (var uName in this.customUniforms) {
                var data = this.customUniforms[uName];
                if (data.type == "array") {
                    var uni = {
                        entry: null,
                        type: data.type,
                        value: data.value,
                        names: [],
                        array_type: data.array_type
                    };
                    var i = 0;
                    for (var x in uni.value) {
                        uni.names.push(uName + "[" + i + "]");
                        i++;
                    }
                    this.uniforms[uName] = uni;
                    continue;
                }
                if (!this.hasUniform(uName))
                    continue;
                this.uniforms[uName] = {
                    entry: this.getUniform(uName),
                    type: data.type,
                    value: data.value,
                    names: [],
                    array_type: ""
                };
            }
        }
        // gl.enableVertexAttribArray(vertexPositionAttribute);
    };
    Shader.prototype.setUniform = function (uniform) {
        if (uniform.type == "f1") {
            if (typeof uniform.entry == "string")
                this.setFloat(uniform.entry, uniform.value);
            else
                this.setFloatUniform(uniform.entry, uniform.value);
        }
        else if (uniform.type == "i1") {
            if (typeof uniform.entry == "string")
                this.setInteger(uniform.entry, uniform.value);
            else
                this.setIntegerUniform(uniform.entry, uniform.value);
        }
        else if (uniform.type == "texture") {
            var tex = uniform.value;
            if (tex == null)
                return;
            tex.bind(this.texId);
            if (typeof uniform.entry == "string")
                this.setInteger(uniform.entry, this.texId);
            else
                this.setIntegerUniform(uniform.entry, this.texId);
            this.texId += 1;
        }
        else if (uniform.type == "mat3") {
            if (typeof uniform.entry == "string")
                this.setMatrix3(uniform.entry, uniform.value);
            else
                this.setMatrix3Uniform(uniform.entry, uniform.value);
        }
        else if (uniform.type == "vec2") {
            if (typeof uniform.entry == "string")
                this.setVec2(uniform.entry, uniform.value);
            else
                this.setVec2Uniform(uniform.entry, uniform.value);
        }
        else if (uniform.type == "vec3") {
            if (typeof uniform.entry == "string")
                this.setVec3(uniform.entry, uniform.value);
            else
                this.setVec3Uniform(uniform.entry, uniform.value);
        }
        else if (uniform.type == "array") {
            var uarray = uniform;
            if (uarray.array_type == "struct") {
                for (var i in uarray.value) {
                    for (var name in uarray.value[i]) {
                        var entry = this.getUniform(uarray.names[i] + "." + name);
                        var temp = {
                            entry: entry,
                            type: uarray.value[i][name].type,
                            value: uarray.value[i][name].value
                        };
                        this.setUniform(temp);
                    }
                }
            }
            else {
                console.log("unknown uniform (array) type: " + uniform.type);
            }
        }
        else {
            console.log("unknown uniform type: " + uniform.type);
        }
    };
    Shader.prototype.bind = function () {
        var gl = this.webgl.glContext;
        gl.useProgram(this.program);
        this.texId = 0;
        for (var id in this.uniforms) {
            var uniform = this.uniforms[id];
            this.setUniform(uniform);
        }
    };
    Shader.prototype.setFloat = function (name, value) {
        this.setFloatUniform(this.getUniform(name), value);
    };
    Shader.prototype.setFloatUniform = function (uniform, value) {
        var gl = this.webgl.glContext;
        gl.uniform1f(uniform.handle, value);
    };
    Shader.prototype.setInteger = function (name, value) {
        this.setIntegerUniform(this.getUniform(name), value);
    };
    Shader.prototype.setIntegerUniform = function (uniform, value) {
        var gl = this.webgl.glContext;
        gl.uniform1i(uniform.handle, value);
    };
    Shader.prototype.setVec2 = function (name, value) {
        this.setVec2Uniform(this.getUniform(name), value);
    };
    Shader.prototype.setVec2Uniform = function (uniform, value) {
        var gl = this.webgl.glContext;
        gl.uniform2f(uniform.handle, value.x, value.y);
    };
    Shader.prototype.setVec3 = function (name, value) {
        this.setVec3Uniform(this.getUniform(name), value);
    };
    Shader.prototype.setVec3Uniform = function (uniform, value) {
        var gl = this.webgl.glContext;
        gl.uniform3f(uniform.handle, value.x, value.y, value.z);
    };
    /*setMatrix2(name: string, mat: mat2) {
        this.setMatrix2Uniform(this.getUniform(name), mat);
    }

    setMatrix2Uniform(uniform: Uniform, mat: mat2) {
        var gl = this.webgl.glContext;
        gl.uniformMatrix2fv(uniform.handle, false, mat.values);
    }*/
    Shader.prototype.setMatrix3 = function (name, mat) {
        this.setMatrix3Uniform(this.getUniform(name), mat);
    };
    Shader.prototype.setMatrix3Uniform = function (uniform, mat) {
        var gl = this.webgl.glContext;
        gl.uniformMatrix3fv(uniform.handle, false, mat.values);
    };
    /*setMatrix4(name: string, mat: mat4) {
        this.setMatrix4Uniform(this.getUniform(name), mat);
    }

    setMatrix4Uniform(uniform: Uniform, mat: mat4) {
        var gl = this.webgl.glContext;
        gl.uniformMatrix4fv(uniform.handle, false, mat.values);
    }*/
    Shader.prototype.hasUniform = function (name) {
        var gl = this.webgl.glContext;
        if (this.uniformsCache[name] != null)
            return true;
        var handle = gl.getUniformLocation(this.program, name);
        return handle != null;
    };
    Shader.prototype.getUniform = function (name) {
        var gl = this.webgl.glContext;
        if (this.uniformsCache[name] != null)
            return this.uniformsCache[name];
        var handle = gl.getUniformLocation(this.program, name);
        if (handle == null) {
            throw new Error("Unknown uniform: " + handle);
        }
        if (gl.getError() != gl.NO_ERROR) {
            alert("" + gl.getError());
        }
        var uniform = { name: name, handle: handle };
        this.uniformsCache[name] = uniform;
        return uniform;
    };
    Shader.prototype.getVertexAttr = function (name) {
        var gl = this.webgl.glContext;
        if (this.vertexPointersCache[name] != null)
            return this.vertexPointersCache[name];
        var handle = gl.getAttribLocation(this.program, name);
        if (handle < 0) {
            throw new Error("Unknown attribute: " + handle + ", " + name);
        }
        if (gl.getError() != gl.NO_ERROR) {
            alert("" + gl.getError());
        }
        var vertex = { name: name, handle: handle };
        this.vertexPointersCache[name] = vertex;
        return vertex;
    };
    return Shader;
})();
//# sourceMappingURL=shader.js.map