import BaseService from "@/src/services/base";
import {createContext, ReactNode, useEffect, useState} from "react";
import {Book} from "@/src/services/book";
import {useWS, WrappedWS} from "@/src/contexts/websockets";

interface Move{
    id?:string,
    parent?:string,
    fen:string,
    mov: string[],
    book_id:string,
    is_me:boolean,
    notes?:string,
}

class MoveService extends BaseService{

    constructor( ws: WrappedWS) {
        super("move", ws);
    }
}


interface ContextProps{
    book:Book|undefined,
    moveService: MoveService|null
}
const MovesContext = createContext<ContextProps>({book:undefined, moveService:null});


function MovesProvider({children, book}: { children:ReactNode, book:Book }){
    const ws = useWS();

    const [moveService, setMoveService] = useState<MoveService|null>(null);

    useEffect(() => {
        if (!ws) return;
        setMoveService(new MoveService(ws));

    }, [ws]);

    return (
        <MovesContext.Provider value={{book, moveService}}>
            {children}
        </MovesContext.Provider>
    );
}

export {
    MovesProvider, MovesContext
}

export type {Move}