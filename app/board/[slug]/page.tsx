"use client"; // This is a client component 👈🏽

import ChessBoard from "../../components/chessboard";
import {Chess,SQUARES} from "chess.js";
import {useState} from "react";
let chess = new Chess();
import {MovesProvider} from "@/src/services/move";
import ConfirmMove from "@/app/board/[slug]/confirm-move";

export default function Page({params}:{ params: { slug: string } }) {

    const [fen, setFen] = useState(chess.fen())
    const [lastMove, setLastMove] = useState([] as string[]);
    const [showConfirm, setShowConfirm] = useState(false);
    let calcMovable = ()=>{
        const dests = new Map();

        SQUARES.forEach(s => {
            const ms = chess.moves({ square: s, verbose: true })
            if (ms.length) dests.set(s, ms.map(m => m.to))
        })
        return {
            free: false,
            dests,
            color: "both"
        }
    }

    const turnColor =()=>{
        return chess.turn() === "w" ? "white" : "black"
    }
    let onMove=(orig:string,dest:string)=>{
        let move = chess.move({from:orig,to:dest});
        if (move) {
            setFen(chess.fen());
            setLastMove([move.from, move.to]);
            setShowConfirm(true);
        }

    }

    let confirmMove=()=>{
        setShowConfirm(false);
    }

    return (
        <MovesProvider>
            <main className="flex min-h-screen flex-col items-center justify-between p-24">
                <ChessBoard
                    turnColor={turnColor()}
                    movable={ calcMovable()}
                    onMove={onMove}
                    fen={fen}
                    lastMove={lastMove}
                    viewOnly={showConfirm}
                />
                { showConfirm &&
                    <ConfirmMove confirmMove={confirmMove}/>
                }
            </main>
        </MovesProvider>

    )
}
