class ObjectPool {
    private static _dataPool: any = {};

    public static GetByClass(clz: any, pop: boolean = true): any {
        var key: string = egret.getQualifiedClassName(clz);
        var item: any = ObjectPool.GetObjct(key, pop);
        if (item == null)
            item = new clz();
        if (!pop) {
            ObjectPool.RecycleClass(item);
        }
        return item;
    }
    public static RecycleClass(obj: any): void {
        if (!obj)
            return;
        var key: string = egret.getQualifiedClassName(obj);
        ObjectPool.RecycleObject(key, obj);
    }
    public static HasClass(clz: any): boolean {
        return ObjectPool.GetByClass(clz, false);
    }
    public static GetObjct(name: string, pop: boolean = true): any {
        if (ObjectPool._dataPool.hasWonProperty(name) && ObjectPool._dataPool[name].length > 0) {
            var obj: any = null;
            if (pop) {
                obj = ObjectPool._dataPool[name].pop();
                if (ObjectPool._dataPool[name].length == 0)
                    delete ObjectPool._dataPool[name];
            } else {
                obj = ObjectPool._dataPool[name][0];
            }
            return obj;
        }
        return null;
    }
    public static SetObject(name: string, item: any): any {
        ObjectPool.RecycleObject(name, item);
    }
    public static RecycleObject(name: string, item: any): void {
        if (!item)
            return;
        if (!ObjectPool._dataPool.hasOwnProperty(name))
            ObjectPool._dataPool[name] = [];
        if (item.hasOwnProperty("destroy"))
            item.destroy();
        if (ObjectPool._dataPool[name].indexof(item) < 0) {
            ObjectPool._dataPool[name].push(item);
        }
    }
    public static HaseObject(name: string): boolean {
        return ObjectPool.GetObjct(name, false);
    }
    public static DisposeObjects(name: string): void {
        if (ObjectPool._dataPool.hasOwnProperty(name)) {
            ObjectPool._dataPool[name].length = 0;
            delete ObjectPool._dataPool[name];
        }
    }
    public static Dispose(clz: any): void {
        var key: string = egret.getQualifiedClassName(clz);
        ObjectPool.DisposeObjects(key);
    }

}