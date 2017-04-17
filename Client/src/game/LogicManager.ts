class LogicManager {
    private static _instance: LogicManager=null;
    public static GetInstance():LogicManager{
        if(this._instance==null){
            this._instance=new LogicManager();
        }
        return this._instance;
    }
    public Run(){
        
    }
}