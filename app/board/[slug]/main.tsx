"use client"; // This is a client component 👈🏽

import ChessBoard from "../../components/chessboard";
import {Chess,SQUARES} from "chess.js";
import {useState} from "react";
let chess = new Chess();
import {Move} from "@/src/services/move";

import ConfirmMove from "@/app/board/[slug]/confirm-move";
import PageContext from "@/app/board/[slug]/context";
import BoardState from "@/app/board/[slug]/board-state";
import {Book} from "@/src/services/book";

export default function MainBoard({book}:{book:Book}) {

    const [fen, setFen] = useState(chess.fen())
    const [lastMove, setLastMove] = useState([] as string[]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [parent, setParent] = useState<string|undefined>(undefined)
    const [isEditable, setIsEditable] = useState(false);
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
        if (applyMove(orig, dest)){
            setShowConfirm(true);
        }
    }

    let applyMove = (orig:string,dest:string)=>{
        let move = chess.move({from:orig,to:dest});
        if (move) {
            setFen(chess.fen());
            setLastMove([move.from, move.to]);
            return true;
        }
        return false;
    }

    let confirmMove=(move:Move)=>{
        setShowConfirm(false);
        setParent(move.id);
    }

    let ctx ={
        move:{fen,move:lastMove,bookId:book.id, parent, isMe: chess.turn()!==book.perspective},
        apply:(move:Move)=>{
            applyMove(move.move[0], move.move[1]);
            setParent(move.id);
        },
        prepareEditor:()=>{
            setIsEditable(true);
        }
    }

    console.log("rendered");
    return (
        <PageContext.Provider value={ctx}>
                <main className="grid grid-cols-3 gap-5 p-10">
                    <div className={"col-span-1"}></div>
                    <div className={"col-span-1"}>
                        <ChessBoard
                            turnColor={turnColor()}
                            movable={ calcMovable()}
                            onMove={onMove}
                            fen={fen}
                            lastMove={lastMove}
                            viewOnly={!isEditable}
                        />
                    </div>
                    <div>
                        <BoardState/>
                        { showConfirm &&
                            <ConfirmMove confirmMove={confirmMove} />
                        }
                    </div>
                </main>
        </PageContext.Provider>

    )

}
