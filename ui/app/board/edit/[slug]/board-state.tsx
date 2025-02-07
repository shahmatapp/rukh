import {useContext} from "react";
import {Move, MovesContext} from "@/src/services/move";
import PageContext from "@/app/board/edit/[slug]/context";
import Button from '@mui/material/Button';
import Announce from "@/app/components/ui/announce";
import Tiptap from "@/app/components/wysiwyg/wysiwyg";
import {Card, CardActions, CardContent} from "@mui/material";
export default function BoardState(){
    const {parentMove, apply, prepareEditor, book, turnColor, childMoves} = useContext(PageContext);
    const {moveService} = useContext(MovesContext)

    let applyMove = (m:Move)=>{
        if (apply) {
            apply(m);
        }
    }

    const updateNotes = async (data:string)=>{
        parentMove!.notes = data;
        await moveService?.save({id:parentMove!.id, notes:data});
    }

    const myTurn = book.perspective === turnColor;

    return (
        <>
            {
                childMoves.length===0 &&
                    <Card>
                        <CardContent>
                            <div className={"mb-2"}><Announce>We dont see any moves here </Announce></div>
                        </CardContent>
                        <CardActions>
                            <Button size={"small"} variant="outlined" onClick={()=>{ prepareEditor();}}>Add Move</Button>
                        </CardActions>
                    </Card>

            }
            {   childMoves.length >0 &&
                <Card>
                    <CardContent>
                        {myTurn && <Announce >Your saved moved</Announce>}
                        {!myTurn && <Announce >Your opponents  potential moves</Announce>}
                        <div>
                            {
                                childMoves.map(
                                    (c:Move)=>
                                        <div key={c.id}>
                                            <Button onClick={()=>{applyMove(c)}}>{`${c.mov[0]} → ${c.mov[1]}`}</Button>
                                        </div>
                                )
                            }
                        </div>
                    </CardContent>
                    <CardActions>
                        {
                            !myTurn &&
                            <div>
                                <Button variant="outlined" onClick={()=>{ prepareEditor();}}>Add More</Button>
                            </div>
                        }
                    </CardActions>

                </Card>
            }
            {   parentMove &&
                <Card className={"text-sm mt-4"}>
                    <CardContent>
                        <div className={"mb-2"}>Add some notes
                            for {`${parentMove.mov[0]} → ${parentMove.mov[1]}`}</div>
                        <Tiptap
                            onBlur={updateNotes}
                            content={parentMove.notes}
                        />
                    </CardContent>
                </Card>
            }
        </>

    );
}