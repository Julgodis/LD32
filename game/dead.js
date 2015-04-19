var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Dead = (function (_super) {
    __extends(Dead, _super);
    function Dead(position, size, radius) {
        _super.call(this, position, size);
        this.rotation = 0;
        this.radius = radius;
        this.fixedAngle = 0.9;
        this.maxTime = 5.0;
        this.time = this.maxTime;
    }
    return Dead;
})(GameObject);
//# sourceMappingURL=dead.js.map