import EventEmitter from "./event-emitter";
import { v4 as uuidv4 } from 'uuid';

let WS: WebSocket;
let eventEmitter = new EventEmitter();

const initAPI =()=>{
    return new Promise((resolve,_)=>{
        if(WS){
            WS = new WebSocket("ws://localhost:8080/ws");
            WS.onopen = () => {
                console.log("Connected to Axum WebSocket server.");
                resolve("ok");
            };
            WS.onclose = () => {
                console.log("Disconnected from server.");
            };

            WS.onmessage = (event) => {
                console.log("got response");
                const {Ok:{data, correlation_id}} = JSON.parse(event.data);
                eventEmitter.emit(correlation_id, data);
            };
        }


    })

}

const getWS = ()=>({
  send:(payload:{model:string,action:string, payload:Record<any,any>}, callback:Function)=>{
      let correlation_id = uuidv4();
      WS.send(JSON.stringify({...payload, correlation_id}));
      eventEmitter.subscribe(correlation_id, callback);
  }
});

export {initAPI, getWS}



