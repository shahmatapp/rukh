// WebSocketContext.tsx
import {createContext, useContext, useEffect, useState} from "react";
import EventEmitter from "@/src/services/event-emitter";
import {v4 as uuidv4} from "uuid";


export interface WrappedWS {
    send: (
        payload: { model: string; action: string; payload: Record<any, any> },
        callback: (data: any) => void
    ) => void;
}

const WebSocketContext = createContext<WrappedWS | null>(null);
let eventEmitter = new EventEmitter();

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
    const [ws] = useState<WrappedWS | null>(null);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [wrappedWS, setWrappedWS] = useState<WrappedWS | null>(null);

    useEffect(() => {
        if (!ws) {
            const socket = new WebSocket("ws://localhost:8080/ws");
            socket.onopen = () => {
                console.log("Connected to Axum WebSocket server.");
                setSocket(socket);
            };
            socket.onclose = () => {
                console.log("Disconnected from server.");
            };

            socket.onmessage = (event) => {
                let response = JSON.parse(event.data);
                if(response["Ok"]){
                    const {Ok:{data, correlation_id}} = response;
                    eventEmitter.emit(correlation_id, data);
                }
                else{
                    console.error(response);
                }

            };

        }
    }, [ws]);

    useEffect(() => {

        if(socket && ! wrappedWS){
            let WS: WrappedWS = {
                send:(payload:{model:string,action:string, payload:Record<any,any>}, callback:Function)=>{
                    let correlation_id = uuidv4();
                    socket.send(JSON.stringify({...payload, correlation_id}));
                    eventEmitter.subscribe(correlation_id, callback);
                }
            }
            setWrappedWS(WS);
        }

    }, [socket, wrappedWS]);

    return <WebSocketContext.Provider value={wrappedWS}>
        {children}
    </WebSocketContext.Provider>;

}

export function useWS() {
    return useContext(WebSocketContext);
}
