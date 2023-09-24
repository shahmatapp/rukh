import BaseService,{D} from "./base";
import {createContext, Dispatch, ReactNode, useEffect, useReducer} from 'react';
interface Book{
    id:string,
    name:string,
    perspective:string
}

const BooksContext = createContext({books:[], dispatch:(() => undefined) as Dispatch<D>});

function booksReducer(books:Book[], action:D) {
    
    switch (action.type) {
        case 'load':{
            return action.data
        }
        case 'add': {
            let book = {...action.data}
            BookService.save(book).then(()=>{
                console.log("Book added");
            });
            return [...books, book];
        }
        case 'deleted': {
          return books.filter(t => t.id !== action.data.id);
        }
        default: {
          throw Error('Unknown action: ' + action.type);
        }
      }
}

function BooksProvider({children}: { children:ReactNode }){
    const [books, dispatch] = useReducer(booksReducer,[] as Book[]);
    useEffect(()=>{
        BookService.getAll().then((data)=>{
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
}

const BookService = new BookServiceSingleTon()

export {
    BooksProvider, BooksContext
};
export type { Book };
