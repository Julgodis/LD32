var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Rock = (function (_super) {
    __extends(Rock, _super);
    function Rock(position, size, radius) {
        _super.call(this, position, size);
        this.rotation = 0;
        this.radius = radius;
        this.fixedAngle = 0.9;
    }
    return Rock;
})(GameObject);
//# sourceMappingURL=rock.js.map