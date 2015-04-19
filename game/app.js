/// <reference path="../engine/mat3.ts"/>
/// <reference path="../engine/webgl.ts"/>
var context;
var keyboard;
var mouse;
var updateHandle;
var renderHandle;
var state = 0;
var todoTime = 6;
var updateDt = 1.0 / 60.0;
var renderDt = 1.0 / 120.0;
var elapsedTime = 0;
var frameCount = 0;
var lastTime = 0;
var fps = 0;
var data = {
    shaders: {},
    textures: {},
    music: {},
    sounds: {},
};
window.onload = function () {
    data.shaders["basic"] = Loader.ReadShaderResource("shaders/shader.vert", "shaders/shader.frag", {
        "pixelSize": {
            type: "vec2",
            value: new vec2([8, 8])
        }
    });
    var uniformLights = [];
    for (var i = 0; i < 10; i++) {
        var light = {
            "position": { type: "vec3", value: new vec3([0, 0, 0]) },
            "radius": { type: "f1", value: 0 },
            "strength": { type: "f1", value: 0 },
            "color": { type: "vec3", value: new vec3([0, 0, 0]) },
        };
        uniformLights.push(light);
    }
    data.shaders["light"] = Loader.ReadShaderResource("shaders/light.vert", "shaders/light.frag", {
        "lightCount": {
            type: "i1",
            value: 0
        },
        "lights": {
            type: "array",
            array_type: "struct",
            value: uniformLights
        }
    });
    data.textures["hero"] = Loader.ReadTextureResource("textures/hero.png", { pixelate: true });
    data.textures["hero_normal"] = Loader.ReadTextureResource("textures/hero_normal.png", { pixelate: true });
    data.textures["hero_parts"] = Loader.ReadTextureResource("textures/hero_parts.png", { pixelate: true });
    data.textures["hero_parts_normal"] = Loader.ReadTextureResource("textures/hero_parts_normal.png", { pixelate: true });
    data.textures["princess"] = Loader.ReadTextureResource("textures/princess.png", { pixelate: true });
    data.textures["princess_normal"] = Loader.ReadTextureResource("textures/princess_normal.png", { pixelate: true });
    data.textures["rock"] = Loader.ReadTextureResource("textures/rock.png", { pixelate: true });
    data.textures["rock_normal"] = Loader.ReadTextureResource("textures/rock_normal.png", { pixelate: true });
    data.textures["slope"] = Loader.ReadTextureResource("textures/slope.png", { pixelate: true });
    data.textures["slope_normal"] = Loader.ReadTextureResource("textures/slope_normal.png", { pixelate: true });
    data.textures["wall"] = Loader.ReadTextureResource("textures/wall.png", { pixelate: true, repeat_x: true, repeat_y: true });
    data.textures["wall_normal"] = Loader.ReadTextureResource("textures/wall_normal.png", { pixelate: true, repeat_x: true, repeat_y: true });
    // NOTE: Adding this if ill have time left
    //data.textures[4] = Loader.ReadTextureResource("textures/wall_specular.png", { pixelate: true });
    data.textures["torch"] = Loader.ReadTextureResource("textures/torch.png", { pixelate: true, repeat_x: true, repeat_y: true });
    data.textures["torch_normal"] = Loader.ReadTextureResource("textures/torch_normal.png", { pixelate: true, repeat_x: true, repeat_y: true });
    data.textures["enemy"] = Loader.ReadTextureResource("textures/enemy.png", { pixelate: true });
    data.textures["enemy_normal"] = Loader.ReadTextureResource("textures/enemy_normal.png", { pixelate: true });
    data.textures["enemy_parts"] = Loader.ReadTextureResource("textures/enemy_parts.png", { pixelate: true });
    data.textures["enemy_parts_normal"] = Loader.ReadTextureResource("textures/enemy_parts_normal.png", { pixelate: true });
    data.textures["pillar"] = Loader.ReadTextureResource("textures/pillar.png", { pixelate: true });
    data.textures["pillar_normal"] = Loader.ReadTextureResource("textures/pillar_normal.png", { pixelate: true });
    data.textures["title"] = Loader.ReadTextureResource("textures/title.png", { pixelate: true });
    data.textures["title_normal"] = Loader.ReadTextureResource("textures/title_normal.png", { pixelate: true });
    data.textures["controls"] = Loader.ReadTextureResource("textures/controls.png", { pixelate: true });
    data.textures["controls_normal"] = Loader.ReadTextureResource("textures/controls_normal.png", { pixelate: true });
    data.textures["win"] = Loader.ReadTextureResource("textures/win.png", { pixelate: true });
    data.textures["win_normal"] = Loader.ReadTextureResource("textures/win_normal.png", { pixelate: true });
    data.textures["lose"] = Loader.ReadTextureResource("textures/lose.png", { pixelate: true });
    data.textures["lose_normal"] = Loader.ReadTextureResource("textures/lose_normal.png", { pixelate: true });
    data.textures["play"] = Loader.ReadTextureResource("textures/play.png", { pixelate: true });
    data.textures["play_hover"] = Loader.ReadTextureResource("textures/play_hover.png", { pixelate: true });
    data.textures["play_normal"] = Loader.ReadTextureResource("textures/play_normal.png", { pixelate: true });
    data.textures["play_normal_hover"] = Loader.ReadTextureResource("textures/play_normal_hover.png", { pixelate: true });
    data.music["music"] = Loader.ReadMusicResource("music/music.ogg", { loop: true });
    data.sounds["die"] = Loader.ReadSoundResource("music/die.ogg", 6);
    data.sounds["sword"] = Loader.ReadSoundResource("music/sword.ogg", 10);
    data.sounds["rock"] = Loader.ReadSoundResource("music/rock.ogg", 10);
    var loadInterval = setInterval(function () {
        console.log("loaded: " + Loader.Loaded);
        if (Loader.Loaded) {
            clearInterval(loadInterval);
            clearInterval(loadDraw);
            newCanvas.parentNode.removeChild(newCanvas);
            start();
        }
    }, 1000);
    var newCanvas = document.createElement("canvas");
    newCanvas.setAttribute("id", name);
    newCanvas.setAttribute("width", "" + 900);
    newCanvas.setAttribute("height", "" + 600);
    newCanvas.innerHTML = "Your browser doesn't appear to support the HTML5 <code>&lt;canvas&gt;</code> element.";
    document.body.appendChild(newCanvas);
    var ctx = newCanvas.getContext("2d");
    var loadDraw = setInterval(function () {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, 900, 600);
        ctx.fillStyle = "#FFF";
        ctx.fillRect(0, 300 - 10, 900, 20);
        var a = Loader.Resources.length;
        var b = 0;
        for (var id in Loader.Resources) {
            var res = Loader.Resources[id];
            if (res.loaded) {
                b++;
            }
        }
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(0, 300 - 10, 900 * (b / a), 20);
    }, 1 / 60);
};
function start() {
    console.log("start");
    var baseMusic = data.music["music"].music;
    baseMusic.volume = 0.4;
    baseMusic.play();
    context = new WebGL("glCanvas", 900, 600, true);
    context.initialize();
    keyboard = new Keyboard(context.canvasElement);
    mouse = new Mouse(context.canvasElement);
    for (var id in data.shaders)
        context.addShader(data.shaders[id].shader);
    for (var id in data.textures)
        context.addTexture(data.textures[id].texture);
    context.addPassBasic("pass1");
    lightShader = data.shaders["light"].shader;
    objects = [];
    styles = [];
    lights = [];
    context.passes[0].shader = lightShader;
    addBackground();
    titleLight = addTorch((worldBound.x) / 2, (worldBound.y * 2) / 4, 20);
    {
        var sprite = new Sprite(0, 0, 1.05, 140 * 4, 30 * 4);
        sprite.color = new vec4([1.0, 1.0, 1.0, 1.0]);
        sprite.textures = [
            data.textures["title"].texture,
            data.textures["title_normal"].texture
        ];
        var object = new Tile(new vec2([worldBound.x / 2 - 70 * 4 * ppm, worldBound.y / 2 - 1]), new vec2([140 * 4, 30 * 4]).mul(ppm));
        object.sprite = sprite;
        object.isStatic = true;
        sprite.matrix = mat3.makeTranslate(object.position.x * mpp, object.position.y * mpp);
        context.passes[0].addSprite(sprite);
        objects.push(object);
        title = object;
    }
    {
        var sprite = new Sprite(0, 0, 1.06, 554 * 1.7, 324 * 1.7);
        sprite.color = new vec4([1.0, 1.0, 1.0, 0.0]);
        sprite.textures = [
            data.textures["controls"].texture,
            data.textures["controls_normal"].texture
        ];
        var object = new Tile(new vec2([worldBound.x / 2 - sprite.width * 0.5 * ppm, worldBound.y / 2 - sprite.height * 0.5 * ppm]), new vec2([sprite.width, sprite.height]).mul(ppm));
        object.sprite = sprite;
        object.isStatic = true;
        sprite.matrix = mat3.makeTranslate(object.position.x * mpp, object.position.y * mpp);
        context.passes[0].addSprite(sprite);
        objects.push(object);
        controls = object;
    }
    {
        var sprite = new Sprite(0, 0, 1.05, 80 * 2, 38 * 2);
        sprite.color = new vec4([1.0, 1.0, 1.0, 1.0]);
        sprite.textures = [
            data.textures["play"].texture,
            data.textures["play_normal"].texture
        ];
        var object = new Tile(new vec2([worldBound.x / 2 - 40 * 2 * ppm, worldBound.y - worldBound.y / 3]), new vec2([80 * 2, 38 * 2]).mul(ppm));
        object.sprite = sprite;
        object.isStatic = true;
        sprite.matrix = mat3.makeTranslate(object.position.x * mpp, object.position.y * mpp);
        context.passes[0].addSprite(sprite);
        objects.push(object);
        playButton = object;
    }
    updateHandle = setInterval(update, updateDt * 1000);
    requestAnimationFrame(render);
    lastTime = new Date().getTime();
}
function win() {
    for (var id in objects) {
        var obj = objects[id];
        if (obj.sprite) {
            context.passes[0].removeSprite(obj.sprite);
        }
    }
    for (var id in styles) {
        var style = styles[id];
        if (style.sprite) {
            context.passes[0].removeSprite(style.sprite);
        }
    }
    objects = [];
    styles = [];
    lights = [];
    player = null;
    addBackground();
    titleLight = addTorch((worldBound.x) / 2, (worldBound.y * 2) / 4, 20);
    {
        var sprite = new Sprite(0, 0, 1.06, 554 * 2.7, 324 * 2.7);
        sprite.color = new vec4([1.0, 1.0, 1.0, 1.0]);
        sprite.textures = [
            data.textures["win"].texture,
            data.textures["win_normal"].texture
        ];
        var object = new Tile(new vec2([worldBound.x / 2 - sprite.width * 0.5 * ppm, worldBound.y / 2 - sprite.height * 0.5 * ppm]), new vec2([sprite.width, sprite.height]).mul(ppm));
        object.sprite = sprite;
        object.isStatic = true;
        sprite.matrix = mat3.makeTranslate(object.position.x * mpp, object.position.y * mpp);
        context.passes[0].addSprite(sprite);
        objects.push(object);
        winObject = object;
    }
    {
        var sprite = new Sprite(0, 0, 1.05, 80 * 2, 38 * 2);
        sprite.color = new vec4([1.0, 1.0, 1.0, 1.0]);
        sprite.textures = [
            data.textures["play"].texture,
            data.textures["play_normal"].texture
        ];
        var object = new Tile(new vec2([worldBound.x / 2 - 40 * 2 * ppm, worldBound.y - worldBound.y / 4]), new vec2([80 * 2, 38 * 2]).mul(ppm));
        object.sprite = sprite;
        object.isStatic = true;
        sprite.matrix = mat3.makeTranslate(object.position.x * mpp, object.position.y * mpp);
        context.passes[0].addSprite(sprite);
        objects.push(object);
        playButton = object;
    }
}
function lose() {
    for (var id in objects) {
        var obj = objects[id];
        if (obj.sprite) {
            context.passes[0].removeSprite(obj.sprite);
        }
    }
    for (var id in styles) {
        var style = styles[id];
        if (style.sprite) {
            context.passes[0].removeSprite(style.sprite);
        }
    }
    objects = [];
    styles = [];
    lights = [];
    player = null;
    addBackground();
    titleLight = addTorch((worldBound.x) / 2, (worldBound.y * 2) / 4, 20);
    {
        var sprite = new Sprite(0, 0, 1.06, 554 * 2.7, 324 * 2.7);
        sprite.color = new vec4([1.0, 1.0, 1.0, 1.0]);
        sprite.textures = [
            data.textures["lose"].texture,
            data.textures["lose_normal"].texture
        ];
        var object = new Tile(new vec2([worldBound.x / 2 - sprite.width * 0.5 * ppm, worldBound.y / 2 - sprite.height * 0.5 * ppm]), new vec2([sprite.width, sprite.height]).mul(ppm));
        object.sprite = sprite;
        object.isStatic = true;
        sprite.matrix = mat3.makeTranslate(object.position.x * mpp, object.position.y * mpp);
        context.passes[0].addSprite(sprite);
        objects.push(object);
        winObject = object;
    }
    {
        var sprite = new Sprite(0, 0, 1.05, 80 * 2, 38 * 2);
        sprite.color = new vec4([1.0, 1.0, 1.0, 1.0]);
        sprite.textures = [
            data.textures["play"].texture,
            data.textures["play_normal"].texture
        ];
        var object = new Tile(new vec2([worldBound.x / 2 - 40 * 2 * ppm, worldBound.y - worldBound.y / 4]), new vec2([80 * 2, 38 * 2]).mul(ppm));
        object.sprite = sprite;
        object.isStatic = true;
        sprite.matrix = mat3.makeTranslate(object.position.x * mpp, object.position.y * mpp);
        context.passes[0].addSprite(sprite);
        objects.push(object);
        playButton = object;
    }
}
function startGame() {
    for (var id in objects) {
        var obj = objects[id];
        if (obj.sprite) {
            context.passes[0].removeSprite(obj.sprite);
        }
    }
    for (var id in styles) {
        var style = styles[id];
        if (style.sprite) {
            context.passes[0].removeSprite(style.sprite);
        }
    }
    objects = [];
    styles = [];
    lights = [];
    addBackground();
    var baseY = Math.round((worldBound.y) / (128 * ppm) - 1) * 128 * ppm;
    addGround(baseY);
    addBase(-13, baseY - (1 * 128 * ppm));
    var yLevel = 0;
    var next = 0;
    for (var x = 0; x < 80; x++) {
        var meterX = x * 128 * ppm;
        var meterY = baseY - ((yLevel + 1) * 128 * ppm);
        var meterYm1 = baseY - ((yLevel) * 128 * ppm);
        var change = 0;
        var rnd = Math.random();
        if (rnd > 0.80)
            change = 1;
        if (rnd < 0.30)
            change = -1;
        if (rnd < 0.10 && yLevel >= 2)
            change = -2;
        if (rnd < 0.05 && yLevel >= 3)
            change = -3;
        if (rnd < 0.02 && yLevel >= 4)
            change = -4;
        if (rnd < 0.01 && yLevel >= 5)
            change = -5;
        if (yLevel == 0 && change < 0)
            change = 0;
        if (x == 79) {
            change = -yLevel;
        }
        var fy = 0;
        if (change == 1) {
            addSlope(meterX, meterY, false);
            fy = 0;
        }
        if (change == -1) {
            addSlope(meterX, meterYm1, true);
            fy = 1;
        }
        if (change <= -2) {
            for (var l = 0; l < -change; l++)
                addBlock(meterX, baseY - ((yLevel - l) * 128 * ppm));
            fy = -change;
        }
        if (change == 0 && yLevel != 0) {
            addBlock(meterX, meterYm1);
            fy = 1;
        }
        for (var y = (yLevel - fy) - 1; y >= 0; y--) {
            var my = baseY - ((y + 1) * 128 * ppm);
            addBlockStyle(meterX, my);
        }
        if (Math.random() > 0.85) {
            for (var e = 0; e < 1 + Math.random() * 2; e++)
                addEnemy(2 + x + Math.random() * 3 + e, baseY - ((yLevel + 3) * 128 * ppm));
        }
        yLevel += change;
        if (x == next) {
            next = x + Math.round(3 + Math.random() * 5);
            addTorch(x * 128 * ppm, baseY - ((yLevel + 2) * 128 * ppm) - (Math.random() - 0.3) * 0.7);
        }
    }
    for (var e = 0; e < 20; e++)
        addTorch((80 + e * 2) * 128 * ppm, baseY - ((2) * 128 * ppm));
    for (var e = 0; e < 20; e++)
        addEnemy((85 + e / 2) * 128 * ppm, baseY - ((4) * 128 * ppm));
    addBase(110 * 128 * ppm, baseY - (1 * 128 * ppm));
    addPrincess(-20, baseY - (2 * 128 * ppm));
    addPrincess(105 * 128 * ppm, baseY - (2 * 128 * ppm));
    addPlayer();
    addRock();
}
function addPrincess(x, y) {
    var sprite = new Sprite(0, 0, 1, 20 * 7, 20 * 7);
    sprite.color = new vec4([1.0, 1.0, 1.0, 1.0]);
    sprite.textures = [
        data.textures["princess"].texture,
        data.textures["princess_normal"].texture
    ];
    var object = new Princess(new vec2([x, y]), new vec2([4 * 7, 20 * 7]).mul(ppm));
    object.offset = new vec2([8 * 7, 0]).mul(ppm);
    object.sprite = sprite;
    object.isStatic = false;
    object.velocity.y = -1;
    object.velocity.x = 0;
    context.passes[0].addSprite(sprite);
    objects.push(object);
}
function addPlayer() {
    var sprite = new Sprite(0, 0, 2, 20 * 7, 20 * 7);
    sprite.color = new vec4([1.0, 1.0, 1.0, 1.0]);
    sprite.textures = [
        data.textures["hero"].texture,
        data.textures["hero_normal"].texture
    ];
    sprite.texCoords = new vec4([0, 0, 20 / 128, 20 / 128]);
    var object = new Player(new vec2([-3, 1]), new vec2([4 * 7, 20 * 7]).mul(ppm));
    object.offset = new vec2([8 * 7, 0]).mul(ppm);
    object.sprite = sprite;
    object.isStatic = false;
    object.velocity.y = -1;
    object.velocity.x = 0;
    player = object;
    player.coordWidth = 20 / 128;
    player.coordHeight = 20 / 128;
    player.animationData = [4, 4, 2, 1];
    player.frameTime = [
        [0.1, 0.1, 0.1, 0.1],
        [0.1, 0.1, 0.1, 0.1],
        [0.1, 0.3],
        [0.4]
    ];
    player.startAnimation(1);
    context.passes[0].addSprite(sprite);
    objects.push(object);
}
function addEnemy(x, y) {
    var sprite = new Sprite(0, 0, 1, 20 * 7, 20 * 7);
    sprite.color = new vec4([1.0, 1.0, 1.0, 1.0]);
    sprite.textures = [
        data.textures["enemy"].texture,
        data.textures["enemy_normal"].texture
    ];
    var object = new Enemy(new vec2([x, y]), new vec2([4 * 7, 20 * 7]).mul(ppm));
    object.offset = new vec2([8 * 7, 0]).mul(ppm);
    object.sprite = sprite;
    object.isStatic = false;
    object.velocity.y = -1;
    object.velocity.x = 0;
    var enemy = object;
    enemy.coordWidth = 20 / 128;
    enemy.coordHeight = 20 / 128;
    enemy.animationData = [4, 4, 2];
    enemy.frameTime = [
        [0.1, 0.1, 0.1, 0.1],
        [0.1, 0.1, 0.1, 0.1],
        [0.1, 0.3]
    ];
    enemy.startAnimation(1);
    context.passes[0].addSprite(sprite);
    objects.push(object);
}
function addRock() {
    var sprite = new Sprite(0, 0, 50, 16 * 7, 16 * 7);
    sprite.color = new vec4([1.0, 1.0, 1.0, 1.0]);
    sprite.textures = [
        data.textures["rock"].texture,
        data.textures["rock_normal"].texture
    ];
    var object = new Rock(new vec2([player.position.x + 2, 2]), new vec2([sprite.width, sprite.height]).mul(ppm), sprite.width * 0.5 * ppm);
    var rock = object;
    object.sprite = sprite;
    object.isStatic = false;
    object.velocity.y = -1;
    object.velocity.x = 0;
    context.passes[0].addSprite(sprite);
    objects.push(object);
}
function addBackground() {
    var sprite = new Sprite(0, 0, 0, 128 * 1000, 128 * 20);
    sprite.color = new vec4([0.6, 0.6, 0.6, 1.0]);
    sprite.texCoords = new vec4([0, 0, 1000, 20]);
    sprite.textures = [
        data.textures["wall"].texture,
        data.textures["wall_normal"].texture
    ];
    sprite.matrix = mat3.makeTranslate(-128 * 10, -128 * 10);
    context.passes[0].addSprite(sprite);
}
function addSlope(x, y, dir) {
    var sprite = new Sprite(0, 0, 1.10, 128, 128);
    sprite.color = new vec4([1.0, 1.0, 1.0, 1.0]);
    sprite.textures = [
        data.textures["slope"].texture,
        data.textures["slope_normal"].texture
    ];
    sprite.flip = dir;
    var angle = 45 * (Math.PI / 180.0);
    if (dir)
        angle = (180 - 45) * (Math.PI / 180.0);
    var object = new TileSlope(new vec2([x, y]), new vec2([128, 128]).mul(ppm), angle);
    object.sprite = sprite;
    object.isStatic = true;
    context.passes[0].addSprite(sprite);
    objects.push(object);
}
function addBlock(x, y) {
    var sprite = new Sprite(0, 0, 1.10, 128, 128);
    sprite.color = new vec4([1.0, 1.0, 1.0, 1.0]);
    sprite.textures = [
        data.textures["wall"].texture,
        data.textures["wall_normal"].texture
    ];
    var object = new Tile(new vec2([x, y]), new vec2([128, 128]).mul(ppm));
    object.offset = new vec2([0, 0]);
    object.sprite = sprite;
    object.isStatic = true;
    context.passes[0].addSprite(sprite);
    objects.push(object);
}
function addTorch(x, y, t) {
    if (t === void 0) { t = 10; }
    var sprite = new Sprite(0, 0, 1.2, 16 * 4, 16 * 4);
    sprite.color = new vec4([1.0, 1.0, 1.0, 1.0]);
    sprite.texCoords = new vec4([0, 0, 0.5, 1]);
    sprite.textures = [
        data.textures["torch"].texture,
        data.textures["torch_normal"].texture
    ];
    sprite.matrix = mat3.makeTranslate(x * mpp - 8 * 4, y * mpp - 8 * 3);
    context.passes[0].addSprite(sprite);
    var style = new Style(sprite);
    style.x = x * mpp - 8 * 4;
    style.animate = true;
    style.spf = 0.08;
    style.animation = 0;
    style.width = 16;
    style.height = 16;
    style.realWidth = 64;
    style.realHeight = 16;
    style.maxFrames = [4];
    style.initialize();
    styles.push(style);
    var light = new Light(new vec3([x * mpp, y * mpp, 45]), 300, t, new vec3([1.0, 0.7, 0.5]));
    light.torch = true;
    lights.push(light);
    return { x: x * mpp, y: y * mpp, style: style, light: light };
}
function addBlockStyle(x, y) {
    var sprite = new Sprite(0, 0, 1.20, 128, 128);
    sprite.color = new vec4([1.0, 1.0, 1.0, 1.0]);
    sprite.textures = [
        data.textures["wall"].texture,
        data.textures["wall_normal"].texture
    ];
    sprite.matrix = mat3.makeTranslate(x * mpp, y * mpp);
    var style = new Style(sprite);
    style.x = x * mpp;
    style.animate = false;
    style.width = 16;
    style.height = 16;
    style.realWidth = 16;
    style.realheight = 16;
    style.initialize();
    context.passes[0].addSprite(sprite);
    styles.push(style);
}
function addBase(x, y) {
    var sprite = new Sprite(0, 0, 1, 128 * 10, 128 * 10);
    sprite.color = new vec4([1.0, 1.0, 1.0, 1.0]);
    sprite.texCoords = new vec4([0, 0, 10, 10]);
    sprite.textures = [
        data.textures["wall"].texture,
        data.textures["wall_normal"].texture
    ];
    var object = new Tile(new vec2([(x) * 128 * ppm, y + (-9) * 128 * ppm]), new vec2([sprite.width, sprite.height]).mul(ppm));
    object.sprite = sprite;
    object.isStatic = true;
    context.passes[0].addSprite(sprite);
    objects.push(object);
}
function addGround(y) {
    var sprite = new Sprite(0, 0, 1, 128 * 1000, 128);
    sprite.color = new vec4([1.0, 1.0, 1.0, 1.0]);
    sprite.texCoords = new vec4([0, 0, 1000, 1]);
    sprite.textures = [
        data.textures["wall"].texture,
        data.textures["wall_normal"].texture
    ];
    var object = new Tile(new vec2([-500 * 128 * ppm, y]), new vec2([sprite.width, sprite.height]).mul(ppm));
    object.sprite = sprite;
    object.isStatic = true;
    context.passes[0].addSprite(sprite);
    objects.push(object);
}
var titleLight = {};
var title;
var controls;
var playButton = null;
var winObject = null;
var loseObject = null;
var controlTime;
var time = 0;
var mpp = 100.0;
var ppm = 1.0 / mpp;
var lightShader = null;
var camera = new vec2([0, 0]);
var objects;
var styles;
var lights;
var gravity = 10;
var player = null;
var worldBound = new vec2([900, 600]).mul(ppm);
function update() {
    keyboard.update();
    time += updateDt;
    if (keyboard.press(77)) {
        if (Sound.isOff == false) {
            Sound.Off();
            Music.Off();
            data.music["music"].music.stop();
        }
        else {
            Sound.On();
            Music.On();
            data.music["music"].music.play();
        }
    }
    // NOTE: Update the lights
    var lightsVisible = lights.filter(function (value, index, array) {
        if (player == null)
            return (state <= 1 || state >= 3);
        var delta = player.position.copy().mul(mpp).sub(value.position.xy);
        return delta.length2() < (900 * 900 + 600 * 600);
    });
    if (player != null) {
        lightsVisible = lightsVisible.sort(function (a, b) {
            var delta1 = player.position.copy().mul(mpp).sub(a.position.xy);
            var delta2 = player.position.copy().mul(mpp).sub(b.position.xy);
            return delta1.length2() - delta2.length2();
        });
    }
    lightShader.uniforms.lightCount.value = (lightsVisible.length > 10 ? 10 : lightsVisible.length);
    for (var id in lightsVisible) {
        if (id >= lightShader.uniforms.lightCount.value)
            break;
        var uniform = lightShader.uniforms.lights.value[id];
        var light = lightsVisible[id];
        light.update(time, updateDt);
        uniform.position.value = light.position;
        uniform.radius.value = light.radius;
        uniform.strength.value = light.strength;
        uniform.color.value = light.color;
    }
    if (state <= 1) {
        camera = new vec2([0, 0]);
        if (state == 0) {
            playButton.sprite.textures[0] = data.textures["play"].texture;
            if (mouse.position.x > playButton.min.x * mpp && mouse.position.x < playButton.max.x * mpp) {
                if (mouse.position.y > playButton.min.y * mpp && mouse.position.y < playButton.max.y * mpp) {
                    playButton.sprite.textures[0] = data.textures["play_hover"].texture;
                    if (mouse.leftDown) {
                        state = 1;
                        title.sprite.color.a = 0;
                        playButton.sprite.color.a = 0;
                        controls.sprite.color.a = 1;
                        controlTime = 6;
                        return;
                    }
                }
            }
        }
        else {
            if (controlTime < 0) {
                state = 2;
                startGame();
                return;
            }
            controlTime -= updateDt;
        }
        var mx = titleLight.x + Math.cos(time) * 200;
        var my = titleLight.y + Math.sin(time) * 200;
        titleLight.style.update(time, updateDt);
        titleLight.style.sprite.matrix = mat3.makeTranslate(0, my - 8 * 6); //mx - 8 * 4, my - 8 * 6);
        titleLight.style.sprite.x = mx - 8 * 4;
        titleLight.light.position.x = mx;
        titleLight.light.position.y = my;
        return;
    }
    else if (state == 4 || state == 3) {
        camera = new vec2([0, 0]);
        playButton.sprite.textures[0] = data.textures["play"].texture;
        if (mouse.position.x > playButton.min.x * mpp && mouse.position.x < playButton.max.x * mpp) {
            if (mouse.position.y > playButton.min.y * mpp && mouse.position.y < playButton.max.y * mpp) {
                playButton.sprite.textures[0] = data.textures["play_hover"].texture;
                if (mouse.leftDown) {
                    state = 2;
                    startGame();
                    return;
                }
            }
        }
        var mx = titleLight.x + Math.cos(time) * 200;
        var my = titleLight.y + Math.sin(time) * 200;
        titleLight.style.update(time, updateDt);
        titleLight.style.sprite.matrix = mat3.makeTranslate(0, my - 8 * 6); //mx - 8 * 4, my - 8 * 6);
        titleLight.style.sprite.x = mx - 8 * 4;
        titleLight.light.position.x = mx;
        titleLight.light.position.y = my;
        return;
    }
    if (player != null) {
        var playerPosition = player.position.copy().sub(player.size.copy().mul(0.5)).add(new vec2([2, 1]));
        var cameraPosition = camera.copy().add(worldBound).mul(new vec2([0.5, 0.6]));
        camera.add(playerPosition.sub(cameraPosition).mul(0.4));
    }
    var toUpdate = objects.filter(function (value) {
        if (player == null) {
            value.sprite.enabled = false;
            return false;
        }
        var a = (value.min.x >= player.min.x - worldBound.x && value.max.x <= player.max.x + worldBound.x) || (value.min.x <= player.min.x - worldBound.x && value.max.x >= player.max.x + worldBound.x) || (value.min.x >= player.min.x - worldBound.x && value.min.x <= player.max.x + worldBound.x) || (value.max.x >= player.min.x - worldBound.x && value.max.x <= player.max.x + worldBound.x);
        value.sprite.enabled = a;
        return a;
    });
    for (var id in toUpdate) {
        var obj = toUpdate[id];
        if (!obj.isStatic) {
            if (obj instanceof Player) {
                player = obj;
                player.hp += 0.1;
                if (player.hp > player.maxHp)
                    player.hp = player.maxHp;
                player.update(time, updateDt);
                player.updateInput();
                if (player.onGround)
                    player.groundUpdate(updateDt);
                else if (player.onWall)
                    player.wallUpdate(updateDt);
                else
                    player.airUpdate(updateDt);
                if (keyboard.press(32)) {
                    player.startAnimation(3);
                }
                if (player.hp < 0) {
                    for (var i = 0; i < 10; i++) {
                        var red = Math.random() * 0.5;
                        var sprite = new Sprite(0, 0, 1, 6 * 7, 6 * 7);
                        sprite.color = new vec4([1.0, 1.0 - red, 1.0 - red, 1.0]);
                        sprite.texCoords = new vec4([0, (6 / 30) * (i % 6), 1, 6 / 30]);
                        sprite.textures = [
                            data.textures["hero_parts"].texture,
                            data.textures["hero_parts_normal"].texture
                        ];
                        var object = new Dead(player.position.copy(), new vec2([6 * 7, 6 * 7]).mul(ppm), 3 * 7 * ppm);
                        object.offset = new vec2([0, 0]).mul(ppm);
                        object.sprite = sprite;
                        object.isStatic = false;
                        object.velocity.y = -(Math.random() * 5 + 2);
                        object.velocity.x = (Math.random() * 10 - 5);
                        objects.push(object);
                        context.passes[0].addSprite(sprite);
                    }
                    state = 3;
                    lose();
                    data.sounds["die"].sound.play();
                    player.remove = true;
                    return;
                }
                else
                    player.onWall = false;
            }
            else if (obj instanceof Rock) {
                var rock = obj;
                rock.rotation += -rock.velocity.x / (5.0 * Math.PI * 2);
                if (keyboard.press(88)) {
                    var dist = rock.position.copy().add(rock.radius).sub(player.position.copy().add(player.size.copy().mul(0.5))).length2();
                    if (dist < 8 * rock.radius * rock.radius) {
                        rock.velocity.x += (rock.position.x < player.position.x ? -1 : 1) * 25;
                    }
                }
                if (obj.onGround) {
                    obj.velocity.y = 0.00;
                }
                obj.velocity.x *= 0.995;
            }
            else if (obj instanceof Dead) {
                var dead = obj;
                dead.rotation += -dead.velocity.x / (1.0 * Math.PI * 2);
                dead.time -= updateDt;
                if (dead.time < 0) {
                    dead.time = 0;
                    dead.remove = true;
                }
                if (keyboard.press(88)) {
                    var p1 = dead.position.copy().add(dead.radius);
                    var p2 = player.position.copy().add(player.size.copy().mul(0.5));
                    var d = p1.copy().sub(p2);
                    var dist = d.length2();
                    if (dist < 16 * dead.radius * dead.radius) {
                        var angle = Math.atan2(-d.y, d.x);
                        dead.velocity.x += 10 * -Math.cos(angle);
                        dead.velocity.y += 10 * -Math.sin(angle);
                    }
                }
                if (obj.onGround) {
                    obj.velocity.y = 0.00;
                }
                obj.velocity.x *= 0.995;
            }
            else if (obj instanceof Princess) {
                var princess = obj;
                if (player != null) {
                    var delta = (princess.min.x + princess.size.x) - (player.min.x + player.size.x);
                    princess.sprite.flip = (delta > 0);
                    if (Math.abs(delta) < 0.5) {
                        state = 4;
                        win();
                        return;
                    }
                }
            }
            else if (obj instanceof Enemy) {
                var enemy = obj;
                if (player != null) {
                    var delta = (enemy.min.x + enemy.size.x) - (player.min.x + player.size.x);
                    enemy.sprite.flip = (delta > 0);
                    var dist = Math.abs(delta);
                    if (dist < 0.8) {
                        if (enemy.currentAnimation != 2)
                            enemy.startAnimation(2);
                        if (dist < 0.9 && Math.abs((enemy.min.y + enemy.size.y) - (player.min.y + player.size.y)) < player.size.y / 2) {
                            if (time > enemy.playAttack) {
                                var ref = data.sounds["sword"].sound.play();
                                ref.volume = 0.2;
                                enemy.playAttack = time + 0.4;
                                player.hp -= 18 + Math.random() * 10;
                            }
                        }
                    }
                    else if (dist < worldBound.x / 2.0) {
                        if (enemy.currentAnimation != 1)
                            enemy.startAnimation(1);
                        enemy.velocity.x -= 0.6 * (delta / Math.abs(delta));
                    }
                    else {
                        enemy.startAnimation(0);
                    }
                }
                if (Math.random() > 0.98 && (enemy.doJump == 0) && enemy.onGround) {
                    enemy.doJump = 0.01 + updateDt;
                }
                if (enemy.doJump > 0) {
                    obj.velocity.y -= 2.8;
                    obj.onGround = false;
                }
                enemy.doJump -= updateDt;
                if (enemy.doJump < 0)
                    enemy.doJump = 0;
                enemy.update(time, updateDt);
                if (enemy.hp < 0) {
                    for (var i = 0; i < 10; i++) {
                        var red = Math.random() * 0.5;
                        var sprite = new Sprite(0, 0, 1, 6 * 7, 6 * 7);
                        sprite.color = new vec4([1.0, 1.0 - red, 1.0 - red, 1.0]);
                        sprite.texCoords = new vec4([0, (6 / 30) * (i % 6), 1, 6 / 30]);
                        sprite.textures = [
                            data.textures["enemy_parts"].texture,
                            data.textures["enemy_parts_normal"].texture
                        ];
                        var object = new Dead(enemy.position.copy(), new vec2([6 * 7, 6 * 7]).mul(ppm), 3 * 7 * ppm);
                        object.offset = new vec2([0, 0]).mul(ppm);
                        object.sprite = sprite;
                        object.isStatic = false;
                        object.velocity.y = -(Math.random() * 5 + 2);
                        object.velocity.x = (Math.random() * 10 - 5);
                        objects.push(object);
                        context.passes[0].addSprite(sprite);
                    }
                    data.sounds["die"].sound.play();
                    enemy.remove = true;
                }
                if (obj.onGround) {
                    obj.velocity.x *= 0.80;
                    obj.velocity.y = 0.00;
                }
                else {
                    obj.velocity.x *= 0.7;
                }
            }
            else {
                if (obj.onGround) {
                    obj.velocity.x *= 0.80;
                    obj.velocity.y = 0.00;
                }
                else {
                    obj.velocity.x *= 0.99;
                }
            }
            obj.onGround = false;
            obj.velocity.add(new vec2([Math.cos(obj.angleGravity) * (1 - obj.fixedAngle), -Math.sin(obj.angleGravity)]).mul(gravity * updateDt));
            obj.angleGravity = -Math.PI / 2;
            for (var id2 in toUpdate) {
                if (id == id2)
                    continue;
                var obj2 = toUpdate[id2];
                if (obj2 instanceof Dead)
                    continue;
                if (obj2 instanceof Rock) {
                    if (obj instanceof Dead)
                        continue;
                    if (!(obj.max.x > obj2.min.x && obj.min.x < obj2.max.x) && (obj.max.y > obj2.min.y && obj.min.y < obj2.max.y))
                        continue;
                    var rock = obj2;
                    var p1 = obj.min;
                    p1.add(obj.size.copy().mul(0.5));
                    var p2 = obj2.min;
                    p2.add(rock.radius);
                    var distance = p1.copy().sub(p2).length();
                    if (distance <= (rock.radius + (obj.size.x) * 0.5)) {
                        var dx = (rock.radius + (obj.size.x) * 0.5) - distance;
                        if (p1.x > p2.x)
                            dx *= -1;
                        if (obj instanceof Enemy) {
                            var enemy = obj;
                            var len = rock.velocity.length();
                            var damage = len * len * len * 5;
                            console.log("damage: " + damage + ", len: " + len);
                            var ref = data.sounds["rock"].sound.play();
                            ref.volume = 0.1;
                            enemy.hp -= damage;
                            rock.velocity.x -= (dx * 0.1);
                        }
                        rock.velocity.x += dx;
                        rock.position.x += dx / 2;
                        obj.position.x -= dx / 2;
                    }
                }
                else if (obj instanceof GameObject && obj2 instanceof TileSlope && obj2.isStatic) {
                    var slope = obj2;
                    {
                        //} else {
                        var f = function (x) {
                            return x;
                        }; // function
                        var collide = (obj.max.x > obj2.min.x && obj.min.x < obj2.max.x) && (obj.max.y > obj2.min.y && obj.min.y < obj2.max.y);
                        if (collide) {
                            var tposition1 = obj.max.copy().sub(obj2.min);
                            var tposition2 = obj.min.copy().sub(obj2.max);
                            tposition1.abs();
                            tposition2.abs();
                            var dposition = new vec2([0, 0]);
                            var direction = new vec2([0, 0]);
                            if (tposition1.x < tposition2.x) {
                                dposition.x = tposition1.x;
                                direction.x = -1;
                            }
                            else if (tposition1.x > tposition2.x) {
                                dposition.x = tposition2.x;
                                direction.x = 1;
                            }
                            if (tposition1.y < tposition2.y) {
                                dposition.y = tposition1.y;
                                direction.y = -1;
                            }
                            else if (tposition1.y > tposition2.y) {
                                dposition.y = tposition2.y;
                                direction.y = 1;
                            }
                            {
                                if (obj instanceof Rock || obj instanceof Dead) {
                                    var radius = 0;
                                    if (obj instanceof Rock) {
                                        radius = obj.radius;
                                    }
                                    else {
                                        radius = obj.radius;
                                    }
                                    var angle = -Math.PI / 4;
                                    if (slope.sprite.flip)
                                        angle = -Math.PI + Math.PI / 4;
                                    var xmax = (obj.min.x + radius + Math.cos(angle) * radius);
                                    var ymax = (obj.min.y + radius + -Math.sin(angle) * radius);
                                    var x = 0;
                                    if (slope.sprite.flip)
                                        x = (obj2.max.x - xmax) / slope.size.x;
                                    else
                                        x = (xmax - obj2.min.x) / slope.size.x;
                                    if (x < 0) {
                                        if (slope.sprite.flip && -x > rock.radius / slope.size.x) {
                                            obj.velocity.x -= 2 * updateDt;
                                        }
                                        x = 0;
                                    }
                                    else if (x > 1) {
                                        if (!slope.sprite.flip && x - 1 > rock.radius / slope.size.x) {
                                            obj.velocity.x += 2 * updateDt;
                                        }
                                        x = 1;
                                    }
                                    /*if (x > 0.90) { // NOTE: Fixes edges on slopes
                                        obj.velocity.y -= (1 + (1.0 - 0.9)/0.01 + (obj.velocity.x/2.0)) * updateDt;
                                    }*/
                                    var y = Math.sin(slope.angle) * x * Math.sqrt(slope.size.x * slope.size.x + slope.size.y * slope.size.y) * 1.3;
                                    if (obj.position.y >= obj2.max.y - y - (ymax - obj.min.y)) {
                                        obj.position.y = obj2.max.y - y - (ymax - obj.min.y);
                                        obj.onGround = true;
                                        obj.angleGravity = slope.angle - Math.PI;
                                    }
                                }
                                else {
                                    var x = 0;
                                    if (slope.sprite.flip)
                                        x = (obj2.max.x - obj.min.x) / slope.size.x;
                                    else
                                        x = (obj.max.x - obj2.min.x) / slope.size.x;
                                    if (x < 0)
                                        x = 0;
                                    if (x > 1)
                                        x = 1;
                                    var y = Math.sin(slope.angle) * x * Math.sqrt(slope.size.x * slope.size.x + slope.size.y * slope.size.y);
                                    if (obj.position.y >= obj2.max.y - y - obj.size.y && (obj.position.y - (obj2.max.y - y - obj.size.y)) < (obj.size.y / 2)) {
                                        obj.position.y = obj2.max.y - y - obj.size.y;
                                        obj.onGround = true;
                                        obj.angleGravity = slope.angle - Math.PI;
                                    }
                                }
                            }
                        }
                    }
                }
                else if (obj instanceof GameObject && obj2.isStatic) {
                    var edge = 0;
                    if (player != null && obj instanceof Player)
                        edge = player.grabRange;
                    if (obj.max.x + edge > obj2.min.x && obj.min.x - edge < obj2.max.x) {
                        if (obj.max.y + edge >= obj2.min.y && obj.min.y - edge <= obj2.max.y) {
                            var tposition1 = obj.max.copy().sub(obj2.min);
                            var tposition2 = obj.min.copy().sub(obj2.max);
                            tposition1.abs();
                            tposition2.abs();
                            var dposition = new vec2([0, 0]);
                            var direction = new vec2([0, 0]);
                            if (tposition1.x < tposition2.x) {
                                dposition.x = tposition1.x;
                                direction.x = -1;
                            }
                            else if (tposition1.x > tposition2.x) {
                                dposition.x = tposition2.x;
                                direction.x = 1;
                            }
                            if (tposition1.y < tposition2.y) {
                                dposition.y = tposition1.y;
                                direction.y = -1;
                            }
                            else if (tposition1.y > tposition2.y) {
                                dposition.y = tposition2.y;
                                direction.y = 1;
                            }
                            if (dposition.x < dposition.y)
                                direction.y = 0;
                            else
                                direction.x = 0;
                            var collide = false;
                            if (edge == 0)
                                collide = true;
                            else {
                                collide = (obj.max.x > obj2.min.x && obj.min.x < obj2.max.x) && (obj.max.y >= obj2.min.y && obj.min.y <= obj2.max.y);
                            }
                            if (player != null && obj instanceof Player) {
                                if (direction.x != 0) {
                                    player.onWall = true;
                                    player.wallDirection = -direction.x;
                                }
                            }
                            if (collide) {
                                if (direction.x != 0) {
                                    obj.velocity.x = 0;
                                }
                                if (direction.y != 0) {
                                    if (obj.velocity.y != 0 && (obj.velocity.y / Math.abs(obj.velocity.y) != direction.y))
                                        obj.velocity.y = 0;
                                    obj.onGround = (direction.y < 0);
                                }
                                obj.position.add(dposition.mul(direction));
                            }
                        }
                    }
                }
            }
            if (obj.velocity.x > obj.maxVelocity.x)
                obj.velocity.x = obj.maxVelocity.x;
            else if (obj.velocity.x < -obj.maxVelocity.x)
                obj.velocity.x = -obj.maxVelocity.x;
            if (obj.velocity.y > obj.maxVelocity.y)
                obj.velocity.y = obj.maxVelocity.y;
            else if (obj.velocity.y < -obj.maxVelocity.y)
                obj.velocity.y = -obj.maxVelocity.y;
            obj.position.add(obj.velocity.copy().mul(updateDt));
        }
        var matrix = mat3.makeIdentity();
        if (obj instanceof Player && player != null) {
            var range = 0.5 + (player.hp / player.maxHp) * 0.5 + Math.sin(time * 8) * 0.2 * (1 - (player.hp / player.maxHp));
            if (range > 1)
                range = 1;
            if (range < 0)
                range = 0;
            player.sprite.color.g = range;
            player.sprite.color.b = range;
        }
        else if (obj instanceof Rock) {
            var rock = obj;
            matrix.multiply(mat3.makeTranslate(-rock.radius * mpp, -rock.radius * mpp));
            matrix.multiply(mat3.makeRotation(rock.rotation));
            matrix.multiply(mat3.makeTranslate(rock.radius * mpp, rock.radius * mpp));
            obj.sprite.rotation = rock.rotation;
        }
        else if (obj instanceof Dead) {
            var dead = obj;
            matrix.multiply(mat3.makeTranslate(-dead.radius * mpp, -dead.radius * mpp));
            matrix.multiply(mat3.makeRotation(dead.rotation));
            matrix.multiply(mat3.makeTranslate(dead.radius * mpp, dead.radius * mpp));
            obj.sprite.rotation = dead.rotation;
            obj.sprite.color.a = (obj.time / obj.maxTime) * (obj.time / obj.maxTime);
        }
        else if (obj instanceof Enemy) {
            var enemy = obj;
            var range = 0.5 + (enemy.hp / enemy.maxHp) * 0.5 + Math.sin(time * 8) * 0.4 * (1 - (enemy.hp / enemy.maxHp));
            if (range > 1)
                range = 1;
            if (range < 0)
                range = 0;
            enemy.sprite.color.g = range;
            enemy.sprite.color.b = range;
        }
        matrix.multiply(mat3.makeTranslate(obj.position.x * mpp, obj.position.y * mpp));
        obj.sprite.matrix = matrix;
        /*
        if (obj instanceof Player && (<Player>obj).onWall)
            obj.sprite.color = new vec4([1.0, 0.0, 1.0, 1.0]);
        else if (obj.onGround)
            obj.sprite.color = new vec4([1.0, 1.0, 0.0, 1.0]);
        else if(!obj.isStatic)
            obj.sprite.color = new vec4([1.0, 0.0, 0.0, 1.0]);*/
        if (obj.remove) {
            if (obj.sprite != null) {
                context.passes[0].removeSprite(obj.sprite);
            }
        }
    }
    objects = objects.filter(function (value, index, array) {
        return !value.remove;
    });
    var toStyle = styles.filter(function (value) {
        if (player == null) {
            value.sprite.enabled = false;
            return false;
        }
        var a = Math.abs(value.x - player.position.x * mpp) < 900;
        value.sprite.enabled = a;
        return a;
    });
    for (var id in toStyle) {
        styles[id].update(time, updateDt);
    }
}
function render() {
    var now = new Date().getTime();
    var elapsed = (now - lastTime);
    elapsedTime += elapsed;
    lastTime = now;
    context.preRender();
    //context.render(mat3.makeIdentity());
    context.render(mat3.makeTranslate(-(camera.x) / worldBound.x, (camera.y) / worldBound.y)); //-camera.x * mpp / worldBound.x, camera.y * mpp / worldBound.y));
    context.postRender();
    fps++;
    if (elapsedTime >= 1000) {
        console.log(fps);
        fps = 0;
        elapsedTime -= 1000;
    }
    requestAnimationFrame(render);
}
//# sourceMappingURL=app.js.map