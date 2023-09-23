"use client"; // This is a client component 👈🏽
import Home from './home'
import {useEffect, useState} from "react";
import {initDB} from "@/src/services/db";
export default function Index() {
    const [isReady, setIsReady]= useState(false);
    useEffect(()=>{
        initDB().then(()=>{
            setIsReady(true)
        })
    });
    return (
        isReady? <Home/> :<div>Loading</div>
    )
}
