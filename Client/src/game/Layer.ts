class Layer extends egret.Sprite {
    public Data: Object = null
    constructor() {
        super();

    }
    public RemoveFromParent(): void {
        this.parent.removeChild(this);
    }
    public Enter(): void {
        this.visible = true;
    }
    public outer(): void {
        this.visible = false;
    }
}