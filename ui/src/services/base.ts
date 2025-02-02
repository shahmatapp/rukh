import {WrappedWS} from "@/src/contexts/websockets";


class BaseService{
    model:string;
    ws: WrappedWS
    constructor(model:string, ws: WrappedWS ){
        this.model = model;
        this.ws= ws;
    }

    save(row:Record<any, any>){
        return new Promise((resolve, _)=>{
            this.ws.send({
                model:this.model,
                action: row['id'] ?  "update" :"create",
                payload: row
            }, resolve);
        })


    }

    async remove(key:string){
        return new Promise(async (resolve,_)=>{
            this.ws.send({
                model:this.model,
                action:"delete",
                payload:{id:key}
            },resolve);
        });
    }

    async get(key:string){
        return new Promise(async (resolve,_)=>{
            this.ws.send({
                model:this.model,
                action:"get",
                payload:{id:key}
            },resolve);
        });

    }

    query(payload={}){
        return new Promise(async (resolve,_)=>{
            this.ws.send({
                model:this.model,
                action:"list",
                payload
            },resolve);
        })
    }

}


export default BaseService;

