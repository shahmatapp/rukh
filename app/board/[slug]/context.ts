import { createContext } from 'react';
import {Move} from "@/src/services/move";

interface Props{
    move:Move
    apply?:(move:Move)=>void
    prepareEditor:()=>void
}

const PageContext = createContext({} as Props);

export default PageContext