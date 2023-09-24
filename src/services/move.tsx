import BaseService,{D} from "@/src/services/base";
import {createContext, Dispatch, ReactNode, useEffect, useReducer} from "react";

interface Move{
    id?:string,
    parent?:string,
    fen:string,
    move: string[],
    bookId:string
}

class MoveService extends BaseService{

    constructor() {
        super("Moves");

    }
}

const moveService = new MoveService()

const MovesContext = createContext({moves:[], dispatch:(() => undefined) as Dispatch<D>});

function movesReducer(moves:Move[], action:D) {

    switch (action.type) {
        case 'load':{
            return action.data
        }
        case 'add': {
            let move = {...action.data}
            moveService.save(move).then(()=>{
                console.log("Move added");
            });
            return [...moves, move];
        }
        case 'deleted': {
            return moves.filter(t => t.id !== action.data.id);
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}

function MovesProvider({children, bookId}: { children:ReactNode, bookId:string }){
    const [moves, dispatch] = useReducer(movesReducer,[] as Move[]);
    useEffect(()=>{
        moveService.getAll().then((data)=>{
            data = (data as Move[]).filter(d=>d.bookId==bookId);
            dispatch({type:'load',data})
        })
    },[])
    return (
        <MovesContext.Provider value={{moves, dispatch}}>
            {children}
        </MovesContext.Provider>
    );
}

export {
    MovesProvider, MovesContext
}

export type {Move}