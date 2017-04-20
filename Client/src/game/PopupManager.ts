class PopupManager {
    public static CurrentShowLayers: Array<Layer> = [];
    public static WaitShowLayer: Layer = null;
    public static currentLayer: Layer = null;

    private static _winIsManager: Object = {};

    private static _mask: egret.Shape = null;

    public static Show(clz: any, data: any = null, manager: boolean = true): any {
        var key: string = egret.getQualifiedClassName(clz);
        PopupManager._winIsManager[key] = manager;
        PopupManager.WaitShowLayer = ObjectPool.GetByClass(clz, false);
        if (PopupManager.currentLayer) {
            if (PopupManager.currentLayer == PopupManager.WaitShowLayer) {
                PopupManager.WaitShowLayer = null;
                return PopupManager.currentLayer;
            }
            key = egret.getQualifiedClassName(PopupManager.currentLayer);
            var currentLayerIsNanager: boolean = PopupManager._winIsManager[key];
            if (currentLayerIsNanager) {
                if (PopupManager.CurrentShowLayers.indexOf(PopupManager.currentLayer) < 0)
                    PopupManager.CurrentShowLayers.push(PopupManager.currentLayer);
                PopupManager.currentLayer.RemoveFromParent();
            }
        }
        if (PopupManager._mask == null) {
            PopupManager._mask = new egret.Shape();
            PopupManager._mask.touchEnabled = false;
            PopupManager._mask.graphics.beginFill(Color.White, 0.8);
            PopupManager._mask.graphics.drawRect(0, 0, GlobalSetting.STAGE_WIDTH, GlobalSetting.STAGE_HEIGHT);
            PopupManager._mask.graphics.endFill();
        }
        LayerManager.MainContainer.touchEnabled = false;
        LayerManager.MainContainer.touchChildren = false;
        GlobalSetting.STAGE.addChild(PopupManager._mask);
        if (PopupManager.WaitShowLayer) {
            PopupManager.WaitShowLayer.Data = data;
            PopupManager.WaitShowLayer.alpha = 0;
            GlobalSetting.STAGE.addChildAt(PopupManager.WaitShowLayer, 0);
            //TODO: checkResReady
            PopupManager.WaitLayerDoEnter();
            return PopupManager.WaitShowLayer;
        }
        return null;

    }
    public static WaitLayerDoEnter(): void {
        //TODO: checkResReady
        PopupManager.WaitShowLayer.RemoveFromParent();
        PopupManager.WaitShowLayer.alpha = 1;
        GlobalSetting.STAGE.addChild(PopupManager.WaitShowLayer);
        PopupManager.WaitShowLayer.x = 0;
        PopupManager.WaitShowLayer.y = 0;
        var key: string = egret.getQualifiedClassName(PopupManager.WaitShowLayer);

        var currentLayerIsManager: boolean = PopupManager._winIsManager[key];
        PopupManager.currentLayer = PopupManager.WaitShowLayer;
        PopupManager.WaitShowLayer.Enter();
    }
    public static hidden(instance: Object): void {
        var key: string = egret.getQualifiedClassName(instance);
        var layerInstance: Layer = ObjectPool.GetObjct(key, false);
        if (layerInstance) {
            layerInstance.outer();
            layerInstance.RemoveFromParent();
            if (PopupManager.CurrentShowLayers.lastIndexOf(layerInstance) >= 0) {
                PopupManager.CurrentShowLayers.splice(PopupManager.CurrentShowLayers.indexOf(layerInstance), 1);
            }
        }
        if (PopupManager.currentLayer == layerInstance) {
            if (PopupManager._mask && PopupManager._mask.parent)
                PopupManager._mask.parent.removeChild(PopupManager._mask);
            LayerManager.MainContainer.touchEnabled = true;
            LayerManager.MainContainer.touchChildren = true;
            PopupManager.currentLayer = null;
            if (PopupManager.CurrentShowLayers.length > 0) {
                PopupManager.currentLayer = PopupManager.CurrentShowLayers.pop();
            }
        }
        if (PopupManager.currentLayer) {
            LayerManager.MainContainer.touchEnabled = false;
            LayerManager.MainContainer.touchChildren = false;
            GlobalSetting.STAGE.addChild(PopupManager._mask);
            GlobalSetting.STAGE.addChild(PopupManager.currentLayer);
        } else {
            if (PopupManager._mask.parent)
                GlobalSetting.STAGE.removeChild(PopupManager._mask);
        }

    }
    public static IsShow(clz: any): boolean {
        var inst: any = PopupManager.GetWinInstance(clz);
        if (PopupManager.CurrentShowLayers.indexOf(inst) >= 0 || PopupManager.currentLayer == inst)
            return true;
        return false;
    }
    public static GetWinInstance(clz: any): any {
        return ObjectPool.GetByClass(clz, false);
    }
    public static RemoveAll(): void {
        while (PopupManager.currentLayer)
            PopupManager.hidden(PopupManager.currentLayer);
        while (PopupManager.CurrentShowLayers.length > 0)
            PopupManager.hidden(PopupManager.CurrentShowLayers.pop());
        PopupManager.currentLayer = null;
    }

}