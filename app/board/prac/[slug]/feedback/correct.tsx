import {Alert, Card, Button, CardContent, CardActions} from "@mui/material";
import {useContext} from "react";
import PageContext from "@/app/board/prac/[slug]/context";
import Announce from "@/app/components/ui/announce";

export default function CorrectMoveFeedback(){

    const {makeMove} = useContext(PageContext);
    return (
        <Card variant={"elevation"}>

            <Alert severity="success">Correct Move !</Alert>
            <CardContent>
                <Announce>Make a move for black</Announce>

            </CardContent>
            <CardActions>
                <div><Button size={"small"} variant={"outlined"} onClick={makeMove}>Move</Button></div>
            </CardActions>
        </Card>
    );
}