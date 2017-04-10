class LoadingUI extends egret.Sprite {
	private _textField: egret.TextField;

	public constructor() {
		super();
	}
	private createView(): void {
		this._textField = new egret.TextField();
		this.addChild(this._textField);
		this._textField.y = 300;
		this._textField.width = 480;
		this._textField.height = 100;
		this._textField.textAlign = "center";
	}

	public SetProgress(current: number, total: number) {
		this._textField.text = `Loading...${current}/${total}`;
	}

}