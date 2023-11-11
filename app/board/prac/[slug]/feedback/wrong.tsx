import {Alert, Card, CardContent} from "@mui/material";
import {Move} from "@/src/services/move";
import {useState} from "react";
import Button from "@mui/material/Button";

interface Props{
    correctMove: Move
}
export default function InCorrectMoveFeedback({correctMove}:Props){

    const [showCorrectMove, setShowCorrectMove] = useState(false);
    return (
        <Card>
            <Alert severity="error">Incorrect move !</Alert>
            <CardContent>
                <div> <Button onClick={()=>{setShowCorrectMove(true);}}>Click</Button> <span>to see the right move </span> </div>
                {
                    showCorrectMove &&
                    <Button >{`${correctMove.move[0]} → ${correctMove.move[1]}`}</Button>
                }
            </CardContent>

        </Card>
    );
}