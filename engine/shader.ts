/// <reference path="loader.ts"/>

interface VertexPointerEntry {
    name: string;
    handle: number;
}

interface UniformEntry {
    name: string;
    handle: WebGLUniformLocation;
}

interface TexMap {
    name: string;
    index: number;
    handle: WebGLUniformLocation;
}

interface Uniform {
    entry: UniformEntry|string;
    type: string;
    value: any;

}

interface UniformArray extends Uniform {
    names: string[];
    array_type: string;
}

class Shader {

    webgl: WebGL;
    fragmentShaderContent: string;
    vertexShaderContent: string;

    fragmentShader: WebGLShader;
    vertexShader: WebGLShader;

    program: WebGLProgram;

    vertexPointersCache: { [name: string]: VertexPointerEntry; };
    uniformsCache: { [name: string]: UniformEntry; };

    uniforms: { [name: string]: Uniform; };
    customUniforms: any = null;

    textureMap: TexMap[];

    constructor(vertex?: string, frag?: string) {

        this.fragmentShaderContent = frag;
        this.vertexShaderContent = vertex;
        this.textureMap = [];

        this.uniforms = {};
    }

    initialize(context: WebGL) {
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
            alert(""+gl.getError());
        }
        
        for (var i = 0; i < 4; i++) {
            var name = "sampler" + (i > 0 ? "" + i : "");
            var textureHandle = gl.getUniformLocation(this.program, name);
            if (textureHandle == null)
                continue;

            this.uniforms[name] = <Uniform> {
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
                    var uni = <UniformArray> {
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

                this.uniforms[uName] = <Uniform> {
                    entry: this.getUniform(uName),
                    type: data.type,
                    value: data.value,
                    names: [],
                    array_type: ""
                };
            }

        }
        
       // gl.enableVertexAttribArray(vertexPositionAttribute);
    }

    setUniform(uniform: Uniform) {

        if (uniform.type == "f1") {
            if(typeof uniform.entry == "string")
                this.setFloat(<string>uniform.entry, uniform.value);
            else
                this.setFloatUniform(<UniformEntry>uniform.entry, uniform.value);

        }
        else if (uniform.type == "i1") {
            if (typeof uniform.entry == "string")
                this.setInteger(<string>uniform.entry, uniform.value);
            else
                this.setIntegerUniform(<UniformEntry>uniform.entry, uniform.value);
        }
        else if (uniform.type == "texture") {
            var tex = (<Texture>uniform.value);
            if (tex == null)
                return;
            tex.bind(this.texId);
            if (typeof uniform.entry == "string")
                this.setInteger(<string>uniform.entry, this.texId);
            else
                this.setIntegerUniform(<UniformEntry>uniform.entry, this.texId);
            this.texId += 1;
        }
        else if (uniform.type == "mat3") {
            if (typeof uniform.entry == "string")
                this.setMatrix3(<string>uniform.entry, uniform.value);
            else
                this.setMatrix3Uniform(<UniformEntry>uniform.entry, uniform.value);
        }
        else if (uniform.type == "vec2") {
            if (typeof uniform.entry == "string")
                this.setVec2(<string>uniform.entry, uniform.value);
            else
                this.setVec2Uniform(<UniformEntry>uniform.entry, uniform.value);
        }
        else if (uniform.type == "vec3") {
            if (typeof uniform.entry == "string")
                this.setVec3(<string>uniform.entry, uniform.value);
            else
                this.setVec3Uniform(<UniformEntry>uniform.entry, uniform.value);
        }
        else if (uniform.type == "array") {
            var uarray = <UniformArray>uniform;
            if (uarray.array_type == "struct") {

                for (var i in uarray.value) {

                    for (var name in uarray.value[i]) {
                        var entry = this.getUniform(uarray.names[i] + "." + name);

                        var temp = <Uniform> {
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

            //this.setVec2Uniform(uniform.entry, uniform.value);
        }
        else {
            console.log("unknown uniform type: " + uniform.type);
        }
    }

    texId: number = 0;
    bind() {
        var gl = this.webgl.glContext;
        gl.useProgram(this.program);  
        
        this.texId = 0;
        for (var id in this.uniforms) {
            var uniform = this.uniforms[id];

            this.setUniform(uniform);
        }  
    }

    setFloat(name: string, value: number) {
        this.setFloatUniform(this.getUniform(name), value);
    }

    setFloatUniform(uniform: UniformEntry, value: number) {
        var gl = this.webgl.glContext;
        gl.uniform1f(uniform.handle, value);
    }

    setInteger(name: string, value: number) {
        this.setIntegerUniform(this.getUniform(name), value);
    }

    setIntegerUniform(uniform: UniformEntry, value: number) {
        var gl = this.webgl.glContext;
        gl.uniform1i(uniform.handle, value);
    }

    setVec2(name: string, value: vec2) {
        this.setVec2Uniform(this.getUniform(name), value);
    }

    setVec2Uniform(uniform: UniformEntry, value: vec2) {
        var gl = this.webgl.glContext;
        gl.uniform2f(uniform.handle, value.x, value.y);
    }

    setVec3(name: string, value: vec3) {
        this.setVec3Uniform(this.getUniform(name), value);
    }

    setVec3Uniform(uniform: UniformEntry, value: vec3) {
        var gl = this.webgl.glContext;
        gl.uniform3f(uniform.handle, value.x, value.y, value.z);
    }
    /*setMatrix2(name: string, mat: mat2) {
        this.setMatrix2Uniform(this.getUniform(name), mat);
    }

    setMatrix2Uniform(uniform: Uniform, mat: mat2) {
        var gl = this.webgl.glContext;
        gl.uniformMatrix2fv(uniform.handle, false, mat.values);
    }*/

    setMatrix3(name: string, mat: mat3) {
        this.setMatrix3Uniform(this.getUniform(name), mat);
    }

    setMatrix3Uniform(uniform: UniformEntry, mat: mat3) {
        var gl = this.webgl.glContext;
        gl.uniformMatrix3fv(uniform.handle, false, mat.values);
    }

    /*setMatrix4(name: string, mat: mat4) {
        this.setMatrix4Uniform(this.getUniform(name), mat);
    }

    setMatrix4Uniform(uniform: Uniform, mat: mat4) {
        var gl = this.webgl.glContext;
        gl.uniformMatrix4fv(uniform.handle, false, mat.values);
    }*/

    hasUniform(name: string): boolean {
        var gl = this.webgl.glContext;

        if (this.uniformsCache[name] != null)
            return true;

        var handle = gl.getUniformLocation(this.program, name);
        return handle != null;
    }

    getUniform(name: string): UniformEntry {
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

        var uniform: UniformEntry = { name: name, handle: handle };
        this.uniformsCache[name] = uniform;

        return uniform;
    }

    getVertexAttr(name: string): VertexPointerEntry {
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

        var vertex: VertexPointerEntry = { name: name, handle: handle };
        this.vertexPointersCache[name] = vertex;

        return vertex;
    }
} 
