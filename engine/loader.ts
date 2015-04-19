/// <reference path="shader.ts"/>
/// <reference path="texture.ts"/>

class Resource {
    handle: number;
    loaded: boolean = false;

    constructor(handle: number) {
        this.handle = handle;
    }
}

class FileResource extends Resource {
    filename: string;
    content: string;
    constructor(handle: number, filename: string) {
        this.filename = filename;
        this.content = "";

        super(handle);
    }
}

class ShaderResource extends Resource {
    vert: FileResource;
    frag: FileResource;
    uniforms: any;
    shader: Shader;
    interval: number;
    constructor(handle: number, vert: FileResource, frag: FileResource, uniforms: any) {
        this.vert = vert;
        this.frag = frag;
        this.uniforms = uniforms;
        
        this.interval = setInterval(() => {
            var vertOk = this.vert == null || this.vert.loaded;
            var fragOk = this.frag == null || this.frag.loaded;

            if (vertOk && fragOk)
            {
                clearInterval(this.interval);
                this.shader = new Shader(
                    this.vert == null ? null : this.vert.content,
                    this.frag == null ? null : this.frag.content);

                this.shader.customUniforms = this.uniforms;

                this.loaded = true;
                Loader.CheckLoaded();
            }
        }, 100);

        super(handle);
    }
}

class TextureResource extends Resource {
    filename: string;
    texture: Texture;
    image: HTMLImageElement;
    options: any;
    constructor(handle: number, filename: string, options: any = null) {
        this.filename = filename;
        this.options = options;

        this.image = new Image();
        this.image.onload = () => {
            this.texture = new Texture(this.image, false, this.options);

            this.loaded = true;
            Loader.CheckLoaded();
        }
        this.image.src = filename;

        super(handle);
    }
}

class MusicResource extends Resource {
    filename: string;
    music: Music;
    audio: HTMLAudioElement;
    options: any;
    constructor(handle: number, filename: string, options: any = null) {
        this.filename = filename;
        this.options = options;

        this.audio = new Audio();
        this.audio.src = this.filename;
        this.audio.load();

        this.audio.onloadeddata = () => {
            this.music = new Music(this.audio,(options != null ? options["loop"] : false));

            this.loaded = true;
            Loader.CheckLoaded();
        }

        super(handle);
    }
}

class SoundResource extends Resource {
    filename: string;
    sound: Sound;
    audios: HTMLAudioElement[];
    options: any;
    loadCount: number;
    constructor(handle: number, filename: string, count: number, options: any = null) {
        this.filename = filename;
        this.options = options;
        this.audios = [];
        this.loadCount = count;

        for (var i = 0; i < count; i++) {
            this.audios[i] = new Audio();
            this.audios[i].src = this.filename;
            this.audios[i].load();

            this.audios[i].onloadeddata = () => {
                this.loadCount--;
                if (this.loadCount == 0) {
                    this.sound = new Sound(this.audios);

                    this.loaded = true;
                    Loader.CheckLoaded();
                }
            }
        }

        super(handle);
    }
}

class Loader {

    static Loaded: boolean = false;
    static Resources: Resource[] = [];

    static CheckLoaded() {
        for (var id in Loader.Resources) {
            var res = Loader.Resources[id];
            if (!res.loaded) {
                Loader.Loaded = false;
                return;
            }
        }

        Loader.Loaded = true;
    }

    static ReadShaderResource(vert: string, frag: string, uniforms: any = null)
        : ShaderResource
    {
        var vertResource = Loader.ReadFileResource(vert);
        var fragResource = Loader.ReadFileResource(frag);

        var handle = Loader.Resources.length;
        var resource = new ShaderResource(
            handle,
            vertResource,
            fragResource,
            uniforms);
        Loader.Resources.push(resource);
        Loader.CheckLoaded();

        return resource;
    }


    static ReadTextureResource(filename: string, options: any = null)
        : TextureResource
    {
        var handle = Loader.Resources.length;
        var resource = new TextureResource(
            handle,
            filename,
            options);
        Loader.Resources.push(resource);
        Loader.CheckLoaded();

        return resource;
    }

    static ReadSoundResource(filename: string, count: number)
        : SoundResource {
        var handle = Loader.Resources.length;
        console.log(handle);
        var resource = new SoundResource(
            handle,
            filename,
            count);
        Loader.Resources.push(resource);
        Loader.CheckLoaded();

        return resource;
    }

    static ReadMusicResource(filename: string, options: any = null)
        : MusicResource {
        var handle = Loader.Resources.length;
        console.log(handle);
        var resource = new MusicResource(
            handle,
            filename,
            options);
        Loader.Resources.push(resource);
        Loader.CheckLoaded();

        return resource;
    }

    static ReadFileResource(filename: string)
        : FileResource
    {
        var handle = Loader.Resources.length;
        var resource = new FileResource(handle, filename);
        Loader.Resources.push(resource);
        Loader.CheckLoaded();

        var request = new XMLHttpRequest();
        request.onreadystatechange = (event: Event) => {
            if (request.readyState != 4 || request.status != 200)
                return;

            resource.content = request.responseText;
            resource.loaded = true;
            Loader.CheckLoaded();
        };
        request.open("get", filename, true);
        request.send();

        return resource;
    }
}


//class FileTask extends Task<FileData> {
//    constructor(request: XMLHttpRequest) {
//        console.log("new file");
//        super(() => {
//            console.error("error");
//        });
//    }
//}

//class FileData {
//    filename: string
//    content: string
//}

//class Loader {

//    static ReadFileAsync(filename: string)
//        : Task<FileData>
//    {
//        var request = new XMLHttpRequest();
//        request.onload = (event: Event) => {
//            console.log(event);
//        };
//        request.open("get", filename, true);
//        request.send();



//        return new FileTask(request);
//    }

//} 