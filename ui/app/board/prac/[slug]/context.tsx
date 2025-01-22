import {createContext} from "react";
import {Move} from "@/src/services/move";

interface Props{
    makeMove:()=>void,
    childMoves:Move[]
}

const PageContext = createContext({} as Props);

export default PageContext