class HeartBeat {
    private static _listeners: Array<BeatItem> = new Array<BeatItem>();
    private static _functionCallList: Array<BeatItem> = new Array<BeatItem>();
    private static MAX_EXECUTE_COUNT: number = 20;
    private static _isInit: boolean = false;

    private static _nowTime: number = 0;
    private static _realFrame: number = 0;
    private static _item: BeatItem = null;
    private static _endCall: boolean = false;

    public static AddListener(thisArg: any, respone: Function, heartRate: number = 1, repeat: number = -1, delay: number = 0, params: Array<any> = null, nowExecute: boolean = false): boolean {
        if (respone == null || HeartBeat.IsContainerListener(thisArg, respone))
            return false;
        var item: BeatItem = ObjectPool.GetByClass(BeatItem);
        item.SetData(thisArg, respone, heartRate, repeat, delay, params);
        HeartBeat._listeners.push(item);
        if (nowExecute) {
            item.loopcount++;
            if (item.param && item.param.length > 0) {
                item.func.apply(item.thisArg, item.param);
            } else {
                if (item.func.length == 0) {
                    item.func.call(item.thisArg);
                } else {
                    item.func.call(item.thisArg, item.del);
                }
            }
        }
        GlobalSetting.STAGE.addEventListener(egret.Event.ENTER_FRAME, HeartBeat.onEnterFrame, HeartBeat);
        return true;
    }
    private static onEnterFrame(event: Event): void {
        var i: number = 0;
        var j: number = 0;
        var length: number = 0;
        var item: BeatItem = null;

        length = HeartBeat._listeners.length - 1;
        for (i = length; i > 0; --i) {
            item = HeartBeat._listeners[i];
            item.index++;
            if (item.del) {
                HeartBeat._listeners.splice(i, 1);
                ObjectPool.RecycleClass(item);
                continue;
            }
            if (item.count <= 1 || item.index % item.count == 0) {
                item.loopcount++;
                if (item.loop > 0 && item.loop <= item.loopcount) {
                    item.del = true;
                }
                HeartBeat._functionCallList.unshift(item);
            }
        }

        length = HeartBeat._functionCallList.length;
        for (i = 0; i < length; ++i) {
            item = HeartBeat._functionCallList.pop();
            if (item.param && item.param.length > 0) {
                item.func.apply(item.thisArg, item.param);
            } else {
                if (item.func.length == 0) {
                    item.func.call(item.thisArg);
                } else {
                    item.func.call(item.thisArg, item.del);
                }
            }
        }
        if (HeartBeat._listeners.length == 0) {
            GlobalSetting.STAGE.removeEventListener(egret.Event.ENTER_FRAME, HeartBeat.onEnterFrame, HeartBeat);
        }
    }
    public static RemoveListener(thisArg: any, respone: Function): void {
        for (var i = 0; i < HeartBeat._listeners.length; ++i) {
            if (HeartBeat._listeners[i].func == respone && HeartBeat._listeners[i].thisArg == thisArg) {
                HeartBeat._listeners[i].del = true;
                break;
            }
        }
    }
    public static IsContainerListener(thisArg: any, respone: Function): boolean {
        for (var i = 0; i < HeartBeat._listeners.length; ++i) {
            if (HeartBeat._listeners[i].func == respone && HeartBeat._listeners[i].thisArg == thisArg) {
                return true;
            }
        }
        return false;
    }

}
class BeatItem {
    public func: Function = null;
    public thisArg: any = null;
    public count: number = 0;
    public index: number = 0;
    public loop: number = 0;
    public loopcount: number = 0;
    public delay: number = 0;
    public del: boolean = false;
    public tranceMsg: string = null;
    public param: Array<any> = null;

    public SetData(thisArg: any, respone: Function, heartRate: number, repeat: number, delay: number, params: Array<any>): void {
        this.thisArg = thisArg;
        this.func = respone;
        this.count = heartRate;
        this.loop = repeat;
        this.delay = delay;
        this.index = 0;
        this.loopcount = 0;
        this.del = false;
        this.param = params;
    }
}