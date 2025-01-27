export default class ResponseEventEmitter{
    static instance: ResponseEventEmitter
    private _events: Record<string,Function> = {};

    constructor() {
        if(ResponseEventEmitter.instance!==null){
            return ResponseEventEmitter.instance
        }
    }
    subscribe( correlation_id: string, callback:Function){
        this._events[correlation_id]= callback;
    }
    emit(correlation_id: string, data: any){
        let callback = this._events[correlation_id];
        if(callback){
            callback(data);
        }
        delete  this._events[correlation_id]
    }
}