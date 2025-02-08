import Button from "@mui/material/Button";
import {useContext} from "react";
import {Move, MovesContext} from "@/src/services/move";
import PageContext from "@/app/board/edit/[slug]/context";
import {Card, CardActions, CardContent} from "@mui/material";

interface Props{
    confirmMove:(m:Move)=>void,

}

export default function ConfirmMove({confirmMove}:Props){
    const ctx = useContext(PageContext);
    const {moveService} = useContext(MovesContext);
    // @ts-ignore
    const { unSavedMove:{fen, mov, book_id, parent, is_me}, childMoves} = ctx ;

    const moveExists = childMoves.find(m=>m.mov[0]===mov[0] && m.mov[1] === mov[1]);

    let save =()=>{
        let m:Move = {fen, mov, book_id, parent, is_me}
        moveService?.save(m).then((d)=>{
            m.id = (d as Move).id
            confirmMove(m);
        });

    }

    return (
        <Card>
            <CardContent>
                <div className={"mb-2"}><Button>{`${mov[0]} → ${mov[1]}`}</Button></div>
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