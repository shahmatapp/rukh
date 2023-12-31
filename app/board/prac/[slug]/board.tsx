import {useState, useRef, useContext} from "react";
import ChessBoard from "@/app/components/chessboard";
import {Chess, Move as ChessMove, SQUARES} from "chess.js";
import {Move, MovesContext} from "@/src/services/move"
import Feedback from "@/app/board/prac/[slug]/feedback/feedback";
import PageContext from "@/app/board/prac/[slug]/context";
let chess = new Chess();

interface RefProps{
    eval:(a:string, b:string)=>Move|boolean,
    undo:()=>void
}
export default function PracticeBoard(){
    const ref = useRef<RefProps>();
    const {moves, book} = useContext(MovesContext);
    const [parent, setParent] = useState<string|undefined>(undefined)
    const [fen, setFen] = useState(chess.fen())
    const [lastMove, setLastMove] = useState([] as string[]);
    const [isViewOnly, setViewOnly] = useState(chess.turn() != book?.perspective);

    const childMoves:Move[] = moves.filter((m:Move)=>m.parent===parent);
    const turnColor =()=>{
        return chess.turn() === "w" ? "white" : "black"
    }

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

    const applyMove = (orig:string|undefined,dest:string|undefined)=>{
        let fen = chess.fen();
        setFen(fen);
        setLastMove(orig && dest ? [orig, dest] :[]);
        setViewOnly(chess.turn() != book?.perspective);
    }
    const onMove =(orig:string,dest:string)=>{
        let move:ChessMove|null = chess.move({from:orig,to:dest});

        if (move) {
            applyMove(move.from, move.to);
        }

        let appliedMove = ref.current?.eval(orig,dest);
        if(!appliedMove){
            move = chess.undo();
            setTimeout(()=>{
                applyMove(move?.from, move?.to);
            },500)
        }else{
            setParent((appliedMove as Move).id);
        }

    }


    let ctx ={
        makeMove:()=>{
            let random = Math.floor(Math.random() * childMoves.length );
            let move = childMoves[random];
            chess.move({from:move.move[0],to:move.move[1]});
            applyMove(move.move[0], move.move[1]);
            setParent(move.id);
            ref.current?.undo();
        },
        childMoves
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
                        viewOnly={isViewOnly}
                        coordinates={true}

                    />
                </div>
                <div className={"flex-initial w-80"}>
                    <Feedback ref={ref} parent={parent}/>
                </div>
            </main>
        </PageContext.Provider>

    );
}