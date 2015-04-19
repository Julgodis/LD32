var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Tile = (function (_super) {
    __extends(Tile, _super);
    function Tile(position, size) {
        _super.call(this, position, size);
    }
    return Tile;
})(GameObject);
var TileSlope = (function (_super) {
    __extends(TileSlope, _super);
    function TileSlope(position, size, angle) {
        _super.call(this, position, size);
        this.angle = angle;
    }
    return TileSlope;
})(GameObject);
//# sourceMappingURL=tile.js.map