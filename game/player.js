var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Player = (function (_super) {
    __extends(Player, _super);
    function Player(position, size) {
        _super.call(this, position, size);
        this.onWall = false;
        this.wallDirection = 0;
        this.grabRange = ppm * 5;
        this.jumpDown = false;
        this.moveDirection = 0;
        this.speed = new vec2([8, -8]);
        this.pushSpeed = new vec2([4, -7]);
        this.turnSpeed = 3;
        this.maxWallSpeed = new vec2([0, 1.8]);
        this.maxHp = 100;
        this.hp = this.maxHp;
        this.nextFrame = 0;
        this.currentAnimation = 0;
        this.currentFrame = 0;
        this.coordWidth = 1;
        this.coordHeight = 1;
        this.frameTime = [[1]];
        this.animationData = [1];
        this.animate = false;
    }
    Player.prototype.startAnimation = function (id) {
        this.currentAnimation = id;
        this.currentFrame = 0;
        this.animate = true;
    };
    Player.prototype.stopAnimation = function () {
        this.animate = false;
    };
    Player.prototype.update = function (time, dt) {
        if (time > this.nextFrame && this.animate) {
            this.currentFrame++;
            if (this.currentFrame >= this.animationData[this.currentAnimation])
                this.currentFrame = 0;
            this.nextFrame = time + this.frameTime[this.currentAnimation][this.currentFrame];
        }
        this.sprite.texCoords = new vec4([
            this.coordWidth * this.currentFrame,
            this.coordHeight * this.currentAnimation,
            this.coordWidth,
            this.coordHeight
        ]);
    };
    Player.prototype.updateInput = function () {
        this.moveDirection = 0;
        if (keyboard.isDown(65)) {
            this.moveDirection = -1;
            this.sprite.flip = this.onWall ? false : true;
        }
        else if (keyboard.isDown(68)) {
            this.moveDirection = 1;
            this.sprite.flip = this.onWall ? true : false;
        }
        if (Math.abs(this.velocity.x) >= Math.abs(this.velocity.y)) {
            if (this.currentAnimation != 1)
                this.startAnimation(1);
            if (Math.abs(this.velocity.x) < 0.2)
                this.startAnimation(0);
        }
        else {
            if (!this.onGround && this.currentAnimation != 3)
                this.startAnimation(3);
            if (this.onGround) {
                this.startAnimation(0);
            }
        }
        this.jumpDown = keyboard.isDown(87) || keyboard.isDown(32);
        if (this.jumpDown) {
            this.startAnimation(3);
        }
    };
    Player.prototype.walk = function (dt) {
        if (this.moveDirection != 0) {
            var currrentDirection = ((this.velocity.x > 0) ? 1 : (this.velocity.x < 0 ? -1 : 0));
            var speed = this.speed.x;
            if (currrentDirection != 0 && this.moveDirection != currrentDirection) {
                speed *= this.turnSpeed;
            }
            this.velocity.x += speed * this.moveDirection * dt;
            return true;
        }
        return false;
    };
    Player.prototype.groundUpdate = function (dt) {
        if (this.jumpDown)
            this.velocity.y = this.speed.y;
        else
            this.velocity.y = 0;
        if (!this.walk(dt))
            this.velocity.x *= 0.80;
    };
    Player.prototype.wallUpdate = function (dt) {
        if (this.jumpDown && this.velocity.y > 0) {
            this.velocity.y = this.pushSpeed.y;
            this.velocity.x = this.pushSpeed.x * -this.wallDirection;
        }
        else {
            if (this.velocity.y > this.maxWallSpeed.y)
                this.velocity.y = this.maxWallSpeed.y;
        }
        if (this.walk(dt))
            this.velocity.x *= 1.50;
    };
    Player.prototype.airUpdate = function (dt) {
        if (this.velocity.y < 0 && !this.jumpDown)
            this.velocity.y *= 0.95;
        if (!this.walk(dt))
            this.velocity.x *= 0.99;
    };
    return Player;
})(GameObject);
//# sourceMappingURL=player.js.map