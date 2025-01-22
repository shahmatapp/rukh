import BaseService,{D} from "@/src/services/base";
import {createContext, Dispatch, ReactNode, useEffect, useReducer} from "react";
import {Book} from "@/src/services/book";

interface Move{
    id?:string,
    parent?:string,
    fen:string,
    move: string[],
    bookId:string,
    isMe:boolean,
    notes?:string,
}

class MoveService extends BaseService{

    constructor() {
        super("Moves");

    }
}

const moveService = new MoveService()

interface ContextProps{
    moves:Move[],
    book:Book|undefined,
    dispatch: Dispatch<D>
}
const MovesContext = createContext<ContextProps>({moves:[],book:undefined, dispatch:(() => undefined) as Dispatch<D>});

function movesReducer(moves:Move[], action:D) {

    switch (action.type) {
        case 'load':{
            return action.data
        }
        case 'upsert': {
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

function MovesProvider({children, book}: { children:ReactNode, book:Book }){
    const [moves, dispatch] = useReducer(movesReducer,[] as Move[]);
    useEffect(()=>{
        moveService.getAll().then((data)=>{
            data = (data as Move[]).filter(d=>d.bookId==book.id);
            dispatch({type:'load',data})
        })
    },[book])
    return (
        <MovesContext.Provider value={{moves,book, dispatch}}>
            {children}
        </MovesContext.Provider>
    );
}

export {
    MovesProvider, MovesContext, moveService
}

export type {Move}