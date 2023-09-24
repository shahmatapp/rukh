"use client"; // This is a client component 👈🏽

import {MovesProvider} from "@/src/services/move";
import MainBoard from "@/app/board/[slug]/main";

export default function Page({params}:{ params: { slug: string } }) {

    const bookId = params.slug;
    return (
        <MovesProvider bookId={bookId}>
            <MainBoard bookId={bookId}/>
        </MovesProvider>
    )
}
