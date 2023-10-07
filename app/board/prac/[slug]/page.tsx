"use client"

import {useEffect, useState} from "react";
import {Book, BookService} from "@/src/services/book";
import {MovesProvider} from "@/src/services/move";
import PracticeBoard from "@/app/board/prac/[slug]/board";

export default function Practice({params}:{ params: { slug: string } }){
    const [book, setBook] = useState<Book>()
    const bookId = params.slug;
    useEffect(()=>{
        BookService.get(bookId).then((b)=>{
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