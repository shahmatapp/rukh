import {Alert} from "@mui/material";
import Button from "@mui/material/Button";
import {useContext} from "react";
import PageContext from "@/app/board/prac/[slug]/context";

export default function CorrectMoveFeedback(){

    const {makeMove} = useContext(PageContext);
    return (
        <div>
            <Alert severity="success">Correct Move !</Alert>
            <div>
                <div>Make a move for black</div>
                <div><Button variant={"outlined"} onClick={makeMove}>Move</Button></div>
            </div>
        </div>
    );
}