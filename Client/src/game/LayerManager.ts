class LayerManager {
    private static _instanceDict: Object = {};

    public static MainContainer: egret.DisplayObjectContainer = null;
    public static CurrentLeyer: Layer = null;
    public static WaitChangeLayer: Layer = null;

    public static Change(clz: any, data: any = null): void {
        PopupManager.RemoveAll();
        if (LayerManager.MainContainer == null) {
            LayerManager.MainContainer = new egret.DisplayObjectContainer();
            GlobalSetting.STAGE.addChild(LayerManager.MainContainer);
            LayerManager.MainContainer.x = GlobalSetting.STAGE_WIDTH / 2;
            LayerManager.MainContainer.y = GlobalSetting.STAGE_HEIGHT / 2;
        }
        var key:string=egret.getQualifiedClassName(clz);
        if(LayerManager._instanceDict.hasOwnProperty(key)){
            LayerManager.WaitChangeLayer=LayerManager._instanceDict[key];
        }else{
            LayerManager.WaitChangeLayer=new clz();
            LayerManager._instanceDict[key]=LayerManager.WaitChangeLayer;
        }
        if(LayerManager.WaitChangeLayer==LayerManager.CurrentLeyer){
            LayerManager.WaitChangeLayer=null;
            return;
        }
        if(LayerManager.WaitChangeLayer){
            LayerManager.WaitChangeLayer.alpha=0;
            LayerManager.WaitChangeLayer.Data=data;
            LayerManager.MainContainer.addChildAt(LayerManager.WaitChangeLayer,0);
        }
        //TODO:CheckResReady
    }
    public static WaitLayerDoEnter(): void {
        if(LayerManager.CurrentLeyer && LayerManager.WaitChangeLayer!=LayerManager.CurrentLeyer){
            LayerManager.CurrentLeyer.outer();
        }

        LayerManager.WaitChangeLayer.RemoveFromParent();
        LayerManager.WaitChangeLayer.alpha=1;
        LayerManager.WaitChangeLayer.anchorOffsetX=0.5;
        LayerManager.WaitChangeLayer.anchorOffsetY=0.5;
        LayerManager.CurrentLeyer=LayerManager.WaitChangeLayer;
        LayerManager.CurrentLeyer.Enter();
        LayerManager.WaitChangeLayer=null;
    }
    //TODO: ReceivePacket ReceiveEvent
}