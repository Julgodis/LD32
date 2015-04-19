var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Enemy = (function (_super) {
    __extends(Enemy, _super);
    function Enemy(position, size) {
        _super.call(this, position, size);
        this.playAttack = 0;
        this.doJump = 0;
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
    Enemy.prototype.startAnimation = function (id) {
        this.currentAnimation = id;
        this.currentFrame = 0;
        this.animate = true;
    };
    Enemy.prototype.stopAnimation = function () {
        this.animate = false;
    };
    Enemy.prototype.update = function (time, dt) {
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
    return Enemy;
})(GameObject);
//# sourceMappingURL=enemy.js.map