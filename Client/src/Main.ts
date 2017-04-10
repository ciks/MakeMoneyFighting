class Main extends eui.UILayer {
    private _loadingView: LoadingUI;
    private _isThemeLoadEnd: boolean = false;
    private _isResourceLoadEnd: boolean = false;

    protected createChildren(): void {
        super.createChildren();

        var assetAdapter = new AssetAdapter();
        this.stage.registerImplementation("eui.IAssetAdapter", assetAdapter);
        this.stage.registerImplementation("eui.IthemeAdapter", new ThemeAdapter());

        this._loadingView = new LoadingUI();
        this.stage.addChild(this._loadingView);

        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");

    }

    private onConfigComplete(event: RES.ResourceEvent) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);

        var theme = new eui.Theme("resource/default.thm.json", this.stage);
        theme.addEventListener(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);

        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    }
    private onThemeLoadComplete(): void {
        this._isThemeLoadEnd = true;
        this.createScene();
    }

    private onResourceLoadComplete(event: RES.ResourceEvent): void {
        if (event.groupName == "preload") {
            this.stage.removeChild(this._loadingView);

            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);

            this._isResourceLoadEnd = true;
            this.createScene();
        }
    }
    private onResourceProgress(event: RES.ResourceEvent): void {
        if (event.groupName == "preload") {
            this._loadingView.SetProgress(event.itemsLoaded, event.itemsTotal);
        }
    }
    private onResourceLoadError(event: RES.ResourceEvent): void {
        console.warn("Url:" + event.resItem.url + "has failed to load");
    }
    private onItemLoadError(event: RES.ResourceEvent): void {
        console.warn("Group:" + event.groupName + "has failed to load");
        //TODO:
        //ignore loading failed item
        this.onResourceLoadComplete(event);
    }
    private createScene() {
        if (this._isThemeLoadEnd && this._isResourceLoadEnd) {
            this.startCreateScene();
        }
    }

    private startCreateScene() {
        var button = new eui.Button();
        button.label = "Click";
        button.horizontalCenter = 0;
        button.verticalCenter = 0;
        this.addChild(button);
        button.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick, this);
    }
    private onButtonClick(e: egret.TouchEvent) {
        var panel = new eui.Panel();
        panel.title="Title";
        panel.horizontalCenter=0;
        panel.verticalCenter=0;
        this.addChild(panel);
    }
}