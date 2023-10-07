import {useContext} from "react";
import {MovesContext, Move} from "@/src/services/move";
import PageContext from "@/app/board/edit/[slug]/context";
import Button from '@mui/material/Button';
import Announce from "@/app/components/ui/announce";
import Tiptap from "@/app/components/wysiwyg";
export default function BoardState(){
    const {moves, dispatch} = useContext(MovesContext);
    const {parent, apply, prepareEditor, book, turnColor} = useContext(PageContext);
    let childMoves = moves.filter((m:Move)=>m.parent===parent);
    // @ts-ignore
    let parentMove:Move = moves.find((m:Move)=>m.id===parent);

    let applyMove = (m:Move)=>{
        if (apply) {
            apply(m);
        }
    }
    const myTurn = book.perspective === turnColor;

    return (
        <>
            {
                childMoves.length===0 &&
                    <div>
                        <div className={"mb-2"}><Announce>We dont see any moves here </Announce></div>
                        <Button variant="outlined" onClick={()=>{ prepareEditor();}}>Add Move</Button>
                    </div>

            }
            {   childMoves.length >0 &&
                <div>
                    {myTurn && <Announce >Your saved moved</Announce>}
                    {!myTurn && <Announce >Your opponents  potential moves</Announce>}
                    <div>
                        {
                            childMoves.map(
                                (c:Move)=>
                                    <div key={c.id}>
                                        <Button onClick={()=>{applyMove(c)}}>{`${c.move[0]} → ${c.move[1]}`}</Button>
                                    </div>
                            )
                        }
                    </div>
                    {
                        !myTurn &&
                        <div>
                            <Button variant="outlined" onClick={()=>{ prepareEditor();}}>Add More</Button>
                        </div>
                    }
                </div>
            }
            {   parentMove &&
                <div className={"inline-block w-96 text-sm mt-4"}>
                    <div className={"mb-2"}>Add some notes for {`${parentMove.move[0]} → ${parentMove.move[1]}`}</div>
                    <Tiptap
                        onBlur={(data)=>{
                                parentMove.notes = data;
                                dispatch({type:"upsert", data:parentMove});
                            }
                        }
                        content={parentMove.notes}
                    />

                </div>
            }
        </>

    );
}