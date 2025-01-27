import BaseService from "./base";
import {createContext, ReactNode, useEffect, useState} from 'react';
import {WrappedWS, useWS} from "@/src/contexts/websockets";

class BookService extends BaseService{

    constructor(ws: WrappedWS) {
        super("book", ws);

    }

}

interface Book{
    id:string,
    name:string,
    description:string,
    perspective:string
}

interface ContextProps{
    bookService: BookService | null
}
const BooksContext = createContext<ContextProps>({bookService: null });



function BooksProvider({children}: { children:ReactNode }){
    const ws = useWS();


    const [bookService, setBookService] = useState<BookService|null>(null);

    useEffect(() => {
        if (!ws) return;
        setBookService(new BookService(ws));

    }, [ws]);



    return (
        <BooksContext.Provider value={{bookService}}>
            {children}
        </BooksContext.Provider>
    );
}

export {
    BooksProvider, BooksContext, BookService
};
export type { Book };
