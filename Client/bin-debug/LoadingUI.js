var LoadingUI = (function (_super) {
    __extends(LoadingUI, _super);
    function LoadingUI() {
        _super.call(this);
    }
    var d = __define,c=LoadingUI,p=c.prototype;
    p.createView = function () {
        this._textField = new egret.TextField();
        this.addChild(this._textField);
        this._textField.y = 300;
        this._textField.width = 480;
        this._textField.height = 100;
        this._textField.textAlign = "center";
    };
    p.SetProgress = function (current, total) {
        this._textField.text = "Loading..." + current + "/" + total;
    };
    return LoadingUI;
}(egret.Sprite));
egret.registerClass(LoadingUI,'LoadingUI');
//# sourceMappingURL=LoadingUI.js.map