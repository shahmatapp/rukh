import {useContext} from "react";
import {MovesContext, Move} from "@/src/services/move";
import PageContext from "@/app/board/[slug]/context";
import Button from '@mui/material/Button';
export default function BoardState(){
    const {moves} = useContext(MovesContext);
    const {move, apply, prepareEditor} = useContext(PageContext);

    let childMoves = moves.filter((m:Move)=>m.parent===move.parent);

    let applyMove = (m:Move)=>{
        if (apply) {
            apply(m);
        }
    }

    return (
        <>
            {
                childMoves.length===0 &&
                    <div>
                        <h2 className={"text-2xl mb-1"}>We dont see any moves here </h2>
                        <div className={"mb-2"}> A new frontier! </div>
                        <Button variant="outlined" onClick={()=>{ prepareEditor();}}>Add Move</Button>
                    </div>

            }
            {   childMoves.length >0 &&
                <div>
                    <div>Moves from here</div>
                    <div>
                        {
                            childMoves.map((c:Move)=><div key={c.id}><a onClick={()=>{applyMove(c)}}>{`${c.move[0]} → ${c.move[1]}`}</a></div>)
                        }
                    </div>
                </div>
            }
        </>

    );
}