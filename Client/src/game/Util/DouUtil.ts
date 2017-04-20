class DaoUtil{
    public static Write(moduleName:string,key:string,value:string):void{
        egret.localStorage.setItem(moduleName+""+key,value);
    }
    public static Read(moduleName:string,key):string{
        return egret.localStorage.getItem(moduleName+""+key);
    }
    public static Delete(moduleName:string,key:string):void{
        egret.localStorage.removeItem(moduleName+""+key);
    }
}