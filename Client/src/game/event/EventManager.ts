class EventManager {
    public static PREFIX: string = "PKT_";

    public static PacketEventList: Object = {};
    public static PacketCachePool: Object = {};
    public static PacketSendCacheList: Array<any> = [];
    //TODO:Packet;

    private static _commEventList: Object = {};
    private static _eventCachePool: Object = {};
    private static _eventSendCacheList: Array<MyEvent> = [];

    public static GetEvent(type: string): MyEvent {
        var eventArray: Array<MyEvent> = EventManager._eventCachePool[type];
        if (eventArray == null) {
            eventArray = [];
            EventManager._eventCachePool[type] = eventArray;
        }
        if (eventArray.length == 0) {
            return new MyEvent(type);
        }
        return eventArray.pop();
    }

    public static ReleaseEvent(e: MyEvent): void {
        var eventArray: Array<MyEvent> = EventManager._eventCachePool[e.Type];
        if (eventArray = null) {
            eventArray = [];
            EventManager._eventCachePool[e.Type] = eventArray;
        }
        e.Destory();
        eventArray.push(e);
    }
    public static DispatchEvent(e: MyEvent): void {
        if (e != null) {
            EventManager._eventSendCacheList.push(e);
            HeartBeat.AddListener(EventManager,EventManager.onFireDispatchEvent);
        }
    }
    public static Dispatch(type:string):void{
        EventManager.DispatchEvent(EventManager.GetEvent(type));
    }
    private static onFireDispatchEvent():void {
        if (EventManager._eventSendCacheList.length > 0) {
            var e: MyEvent = EventManager._eventSendCacheList.shift();
            var listenerList: Array<any> = EventManager._commEventList[e.Type];
            if (listenerList != null) {
                for (var i: number = listenerList.length - 1; i > 0; i--) {
                    listenerList[i]["func"].call(listenerList[i]["owner"],e);
                }
            }
            EventManager.ReleaseEvent(e);
            if(EventManager._eventSendCacheList.length==0){
                HeartBeat.RemoveListener(EventManager,EventManager.onFireDispatchEvent);
            }
        }
    }

    public static AddEventListener(eventType: string, response: Function, thisArg: any): void {
        if (response == null || EventManager.IsContainerEventListener(eventType, response, thisArg)) {
            return;
        }
        var listenerList: Array<any> = EventManager._commEventList[eventType];
        if (listenerList == null) {
            listenerList = new Array<any>();
            EventManager._commEventList[eventType] = listenerList;
        }
        listenerList.push({ func: response, owner: thisArg });
    }

    public static RemoveEventListener(eventType: string, response: Function, thisArg: any): void {
        var listenerList: Array<any> = EventManager._commEventList[eventType];
        if (listenerList != null) {
            for (var i: number = 0; i < listenerList.length; i++) {
                if (listenerList[i]["func"] == response && listenerList[i]["owner"] == thisArg) {
                    listenerList.splice(i, 1);
                    return;
                }
            }
        }
    }

    private static IsContainerEventListener(eventType: string, response: Function, thisArg: any): boolean {
        var listenerList: Array<any> = EventManager._commEventList[eventType];
        if (listenerList != null) {
            for (var i: number = 0; i < listenerList.length; i++) {
                if (listenerList[i]["func"] == response && listenerList[i]["owner"] == thisArg) {

                    return true;
                }
            }
        }
        return false;
    }

}