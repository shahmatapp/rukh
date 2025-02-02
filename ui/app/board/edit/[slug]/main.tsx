"use client"; // This is a client component 👈🏽

import ChessBoard from "../../../components/chessboard";
import {Chess,SQUARES} from "chess.js";
import {useContext, useEffect, useState} from "react";
let chess = new Chess();
import {Move, MovesContext} from "@/src/services/move";

import PageContext from "@/app/board/edit/[slug]/context";
import BoardState from "@/app/board/edit/[slug]/board-state";
import Editor from "@/app/board/edit/[slug]/editor";
import Button from "@mui/material/Button";
import {useSearchParams} from "next/navigation";
import {Stack} from "@mui/material";


export default function EditBoard() {
    const searchParams = useSearchParams()
    const rootId:string|undefined = searchParams.get("p") || undefined;

    const [fen, setFen] = useState(chess.fen())
    const [lastMove, setLastMove] = useState([] as string[]);
    const [parent, setParent] = useState<string|undefined>(rootId)
    const [parentMove, setParentMove] = useState<Move|undefined>()
    const [isEditable, setIsEditable] = useState(false);
    const [showEditor, setShowEditor] = useState(false);
    const [unSavedMove, setUnSavedMove] = useState<Move|null>(null);
    const [madeMove, setMadeMove] = useState(false)
    const {moveService, book} = useContext(MovesContext);
    const [childMoves, setChildMoves] = useState<Move[]>([]);

    if (!book) {
        throw new Error("Book is undefined, but it should never be on this page.");
    }

    useEffect(()=>{
        // the root is passed from practice . its meant to be the starting point where we append moves
        if(moveService && parent){
            moveService.get(parent).then((data)=>{
                let root = data as Move;
                chess.load(root?.fen);
                setFen(root?.fen);
                applyMove(root.move[0],root.move[1]);
                setParentMove(root)
            })

        }

    }, [parent, moveService]);

    useEffect(() => {
        if(moveService){
            moveService.query({bookId: book.id, parent}).then((data)=>{
                setChildMoves(data as Move[]);
            })
        }
    }, [parent, moveService]);

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
        applyMove(orig, dest);
        setUnSavedMove({fen,move:[orig,dest],bookId:book.id, parent, isMe: chess.turn()!==book.perspective})

    }

    let applyMove = (orig:string,dest:string)=>{
        let move = chess.move({from:orig,to:dest});
        if (move) {
            let fen = chess.fen();
            setFen(fen);
            setLastMove([move.from, move.to]);
            setIsEditable(false);
            return true;
        }
        return false;
    }

    let confirmMove=(move:Move)=>{
        setParent(move.id);
        setUnSavedMove(null);
        setIsEditable(true);
        setMadeMove(true);
    }

    let undoMove =()=>{
        let move = chess.undo();
        if(move){
            let fen = chess.fen();
            setFen(fen);
            setLastMove([move.from, move.to]);
        }
        setUnSavedMove(null);
        setIsEditable(true);
    }

    let ctx ={
        unSavedMove,
        turnColor:chess.turn(),
        book,
        apply:(move:Move)=>{
            applyMove(move.move[0], move.move[1]);
            setParent(move.id);
        },
        undoMove,
        prepareEditor:()=>{
            setIsEditable(true);
            setShowEditor(true);
        },
        childMoves,
        parentMove
    }

    return (
        <PageContext.Provider value={ctx}>
                <main className="p-10 flex place-content-center">
                    <div className={"flex-initial mr-10"}>
                        <ChessBoard
                            turnColor={turnColor()}
                            movable={ calcMovable()}
                            onMove={onMove}
                            fen={fen}
                            lastMove={lastMove}
                            viewOnly={!isEditable}
                            coordinates={true}
                        />
                    </div>

                    <div className={"flex-initial w-80"}>
                        {showEditor ? <Editor confirmMove={confirmMove} madeMove={madeMove}/> : <BoardState/>}

                        <div className={"mt-2"}>
                            <Stack direction="row" spacing={2} >
                                <Button size={"small"} variant={"outlined"} href={"/"} color={"warning"} className={"bg-white"}>Exit</Button>
                                <Button size={"small"} variant={"outlined"} href={`/board/prac/${book?.id}`} className={"bg-white"}> Practice </Button>
                            </Stack>
                        </div>

                    </div>
                </main>
        </PageContext.Provider>

    )

}
