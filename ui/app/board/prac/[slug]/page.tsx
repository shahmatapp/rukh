"use client"

import {useContext, useEffect, useState} from "react";
import {Book, BooksContext, BooksProvider} from "@/src/services/book";
import {MovesProvider} from "@/src/services/move";
import PracticeBoard from "@/app/board/prac/[slug]/board";

const  PracticeComponent = ({bookId}:{bookId:string})=>{
    const [book, setBook] = useState<Book>()
    const {bookService} = useContext(BooksContext);

    const loadBook = ()=>{
        if(bookService){
            bookService.get(bookId).then((b)=>{
                setBook(b as Book);
            });
        }
    }

    useEffect(() => {
        loadBook();
    }, [bookService]);

    return (
       <>
           {book ?
               <MovesProvider book={book as Book}>
                   <PracticeBoard/>
               </MovesProvider>
                 :
               <div>Loading</div>
           }
       </>

    );
}

export default function Practice({params}:{ params: { slug: string } }){
    return (
        <BooksProvider>
            <PracticeComponent bookId={params.slug} />
        </BooksProvider>
    );
}