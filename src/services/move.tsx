import BaseService,{D} from "@/src/services/base";
import {v4 as uuid} from "uuid";
import {createContext, Dispatch, ReactNode, useEffect, useReducer} from "react";

interface Move{
    id:string,
    san:string,
    parent?:string,
    fen:string
}

class MoveService extends BaseService{

    constructor() {
        super("Move");

    }
}

const moveService = new MoveService()

const MovesContext = createContext({moves:[], dispatch:(() => undefined) as Dispatch<any>});

function movesReducer(moves:Move[], action:D) {

    switch (action.type) {
        case 'load':{
            return action.data
        }
        case 'add': {
            let move = {...action.data, id:uuid()}
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

function MovesProvider({children}: { children:ReactNode }){
    const [moves, dispatch] = useReducer(movesReducer,[] as Move[]);
    useEffect(()=>{
        moveService.getAll().then((data)=>{
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
    MovesProvider
}