"use client"

import {useEffect, useState} from "react";
import {Book, bookService} from "@/src/services/book";
import {MovesProvider} from "@/src/services/move";
import PracticeBoard from "@/app/board/prac/[slug]/board";

export default function Practice({params}:{ params: { slug: string } }){
    const [book, setBook] = useState<Book>()
    const bookId = params.slug;
    useEffect(()=>{
        bookService.get(bookId).then((b)=>{
            setBook(b as Book);
        });
    },[bookId])


    return (
       <>
           {book ?
                <MovesProvider book={book as Book}>
                    <PracticeBoard/>
                </MovesProvider>   :
               <div>Loading</div>
           }
       </>

    );
}