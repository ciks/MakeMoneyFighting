class MyEvent{
    public CallStack:string=null;
    public Type:string=null;
    public Datas:Object={};
    
    public constructor(type:string){
        this.Type=type;
    }
    public AddItem(property:string,value:any):void{
        this.Datas[property]=value;
    }
    public GetItem(property:string):any{
        if(this.HasItem(property)){
            return this.Datas[property];
        }
    }
    public HasItem(property:string):any{
        return this.Datas.hasOwnProperty(property);
    }
    public RemoveItem(property:string):boolean{
        if(this.HasItem(property)){
            delete this.Datas[property];
            return true;
        }
        return false;
    }
    public Destory():void{
        this.CallStack=null;
        for(var item in this.Datas){
            delete this.Datas[item];
        }
    }
    public send():void{
        EventManager.DispatchEvent(this);
    }

    public static GetEvent(type:string):MyEvent{
        return EventManager.GetEvent(type);
    }
    public static SendEvent(type:string):void{
        EventManager.Dispatch(type);
    }
}