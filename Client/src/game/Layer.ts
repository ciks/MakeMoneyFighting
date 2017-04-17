class Layer extends egret.Sprite {
    public Data:Object=null
    constructor() {
        super();

    }
    public RemoveFromParent(): void {
        this.parent.removeChild(this);
    }
}