import { createContext } from 'react';
import {Move} from "@/src/services/move";
import {Book} from "@/src/services/book";

interface Props{
    unSavedMove:Move|null,
    turnColor:string,
    book:Book,
    parentMove: Move | undefined,
    apply?:(move:Move)=>void,
    undoMove:()=>void,
    prepareEditor:()=>void,
    childMoves:Move[]
}

const PageContext = createContext({} as Props);

export default PageContext