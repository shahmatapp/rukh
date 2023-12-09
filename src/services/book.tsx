import BaseService,{D} from "./base";
import {createContext, Dispatch, ReactNode, useEffect, useReducer} from 'react';
import {moveService, Move} from "@/src/services/move";
interface Book{
    id:string,
    name:string,
    description:string,
    perspective:string
}

const BooksContext = createContext({books:[], dispatch:(() => undefined) as Dispatch<D>});

function booksReducer(books:Book[], action:D) {
    
    switch (action.type) {
        case 'load':{
            return action.data
        }
        case 'add': {
            let book = {...action.data};
            bookService.save(book).then(()=>{
                console.log("Book added");
            });
            return [...books, book];
        }
        case 'delete': {
            let book = {...action.data};
            bookService.remove(book.id).then(()=>{
                console.log("Repertoire deleted")
            });
            return books.filter(t => t.id !== book.id);
        }
        default: {
          throw Error('Unknown action: ' + action.type);
        }
      }
}

function BooksProvider({children}: { children:ReactNode }){
    const [books, dispatch] = useReducer(booksReducer,[] as Book[]);
    useEffect(()=>{
        bookService.getAll().then((data)=>{
            dispatch({type:'load',data})
        })
    },[])
    return (
        <BooksContext.Provider value={{books, dispatch}}>
            {children}
        </BooksContext.Provider>
    );
}
class BookServiceSingleTon extends BaseService{

    constructor() {
        super("Books");

    }

    async remove(key: string): Promise<void> {
        let moves  = await  moveService.getAll();
        let bookMoves = (moves as  Move[]).filter((m)=>m.bookId==key)
        for (let move of bookMoves){
            if(move.id){
                await moveService.remove(move.id);
            }
        }
        await super.remove(key);
    }
}

const bookService = new BookServiceSingleTon()

export {
    BooksProvider, BooksContext, bookService
};
export type { Book };
