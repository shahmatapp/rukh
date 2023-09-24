import Button from "@mui/material/Button";
import {useContext} from "react";
import {MovesContext, Move} from "@/src/services/move";
import {v4 as uuid} from "uuid";
import PageContext from "@/app/board/[slug]/context";

interface Props{
    confirmMove:(m:Move)=>void,

}

export default function ConfirmMove({confirmMove}:Props){
    const {dispatch} = useContext(MovesContext);
    const moveOnPage = useContext(PageContext);
    const {fen, move, bookId, parent} = moveOnPage.move;
    let save =()=>{
        let m:Move = {fen, move, bookId, parent, id:uuid()}
        dispatch({type:"add",data:m})
        confirmMove(m);
    }

    return (
        <div>
            <Button variant="contained" disableElevation onClick={save}>
                Confirm
            </Button>
        </div>
    );
}