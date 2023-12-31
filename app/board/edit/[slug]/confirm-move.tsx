import Button from "@mui/material/Button";
import {useContext} from "react";
import {MovesContext, Move} from "@/src/services/move";
import {v4 as uuid} from "uuid";
import PageContext from "@/app/board/edit/[slug]/context";
import {Card, CardActions, CardContent} from "@mui/material";

interface Props{
    confirmMove:(m:Move)=>void,

}

export default function ConfirmMove({confirmMove}:Props){
    const {dispatch, moves} = useContext(MovesContext);
    const ctx = useContext(PageContext);
    // @ts-ignore
    const {fen, move, bookId, parent, isMe} = ctx.unSavedMove ;

    const moveExists = moves.filter((m)=>m.parent===parent).find(m=>m.move[0]===move[0] && m.move[1] === move[1]);

    let save =()=>{
        let m:Move = {fen, move, bookId, parent, isMe, id:uuid()}
        dispatch({type:"upsert",data:m})
        confirmMove(m);
    }

    return (
        <Card>
            <CardContent>
                <div className={"mb-2"}><Button>{`${move[0]} → ${move[1]}`}</Button></div>
            </CardContent>

            <CardActions>
                {!moveExists && <>
                    <span className={"mr-2"}>
                        <Button variant="outlined" disableElevation onClick={save}>
                        Save
                        </Button>
                    </span>
                    <span>
                        <Button variant="outlined" color={"warning"} disableElevation onClick={ctx.undoMove}>
                            Undo
                        </Button>
                    </span>
                </>}

                {
                    moveExists &&
                    <span >
                        <Button variant="outlined" disableElevation onClick={()=>confirmMove(moveExists)}>
                        Continue
                        </Button>
                    </span>
                }


            </CardActions>


        </Card>
    );
}