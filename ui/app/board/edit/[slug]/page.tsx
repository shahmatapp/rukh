"use client"; // This is a client component 👈🏽

import {MovesProvider} from "@/src/services/move";
import EditBoard from "@/app/board/edit/[slug]/main";
import {Book, BooksContext, BooksProvider} from "@/src/services/book";
import {useContext, useEffect, useState} from "react";

function PageComponent({bookId}:{bookId:string}) {
    const [book, setBook] = useState<Book>();
    const {bookService} = useContext(BooksContext);

    useEffect(()=>{
        if(bookService){
            bookService.get(bookId).then((book)=>{
                setBook(book as Book);
            });
        }
    },[bookId, bookService])

    return (
        <>
        {book  ?
            <MovesProvider book={book as Book}>
                <EditBoard/>
            </MovesProvider>
            :
            <div>Loading</div>
        }
        </>
    )
}

export default function Page({params}:{ params: { slug: string } }){
    return (
        <BooksProvider>
            <PageComponent bookId={params.slug}/>
        </BooksProvider>
    );
}