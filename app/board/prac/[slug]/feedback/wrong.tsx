import {Alert} from "@mui/material";
import {Move} from "@/src/services/move";
import {useState} from "react";
import Button from "@mui/material/Button";

interface Props{
    correctMove: Move
}
export default function InCorrectMoveFeedback({correctMove}:Props){

    const [showCorrectMove, setShowCorrectMove] = useState(false);
    return (
        <div>
            <Alert severity="error">Incorrect move !</Alert>
            <div> <a onClick={()=>{setShowCorrectMove(true);}}>Click</a> <span>to see the right move </span> </div>
            {
                showCorrectMove &&
                <Button >{`${correctMove.move[0]} → ${correctMove.move[1]}`}</Button>
            }
        </div>
    );
}