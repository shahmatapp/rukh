"use client"; // This is a client component 👈🏽

import {MovesProvider, moveService, Move} from "@/src/services/move";
import EditBoard from "@/app/board/edit/[slug]/main";
import {Book, BookService} from "@/src/services/book";
import {useEffect, useState} from "react";
import {useSearchParams} from "next/navigation";

export default function Page({params}:{ params: { slug: string } }) {
    const [book, setBook] = useState<Book>();
    const [root, setRoot] = useState<Move>();
    const bookId = params.slug;
    const searchParams = useSearchParams()
    const rootId:string|undefined = searchParams.get("p") || undefined;
    useEffect(()=>{
        let p =[BookService.get(bookId)];

        if(rootId){
            p.push(moveService.get(rootId))
        }
        Promise.all(p).then(([book,root])=>{
            setBook(book as Book);
            setRoot(root as Move);
        })

    },[bookId, rootId])

    return (
        <>
        {book  ?
            <MovesProvider book={book as Book}>
                <EditBoard book={book as Book} root={root}/>
            </MovesProvider>
            :
            <div>Loading</div>
        }
        </>
    )
}
