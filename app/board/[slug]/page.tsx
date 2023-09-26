"use client"; // This is a client component 👈🏽

import {MovesProvider} from "@/src/services/move";
import MainBoard from "@/app/board/[slug]/main";
import {Book, BookService} from "@/src/services/book";
import {useEffect, useState} from "react";

export default function Page({params}:{ params: { slug: string } }) {
    const [book, setBook] = useState<Book>()
    const bookId = params.slug;
    useEffect(()=>{
        BookService.get(bookId).then((b)=>{
            setBook(b as Book);
        });
    },[bookId])

    return (
        <>
        {book  ?
            <MovesProvider book={book as Book}>
                <MainBoard book={book as Book}/>
            </MovesProvider>
            :
            <div>Loading</div>
        }
        </>
    )
}
