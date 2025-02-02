import {forwardRef, useContext, useImperativeHandle, useState} from "react";
import {Move, MovesContext} from "@/src/services/move";
import InCorrectMoveFeedback from "@/app/board/prac/[slug]/feedback/wrong";
import PageContext from "@/app/board/prac/[slug]/context";
import {Alert, Button, Card, CardActions, CardContent} from "@mui/material";

interface Props{
    parent:undefined|string
}

const Feedback = forwardRef(({parent}:Props,ref)=>{
    const {book} = useContext(MovesContext)
    const {childMoves} = useContext(PageContext);
    const [isCorrectMove, setIsCorrectMove] = useState<boolean|undefined>();
    const [correctMove, setCorrectMove] = useState<Move>();

    useImperativeHandle(ref, () => ({
        eval(orig:string,dest:string) {
            let move:Move|any = childMoves[0]; // users move will only have one child
            if(!move){
                throw "should have found a move"
            }
            setCorrectMove(move);
            if(move.mov[0] == orig && move.mov[1]==dest){
                setIsCorrectMove(true);
                return move;
            }
            setIsCorrectMove(false);
            return false;
        },
        undo(){
            setIsCorrectMove(undefined);
        }

    }));

    return (
        <>
            {
                !parent  && childMoves.length==0 &&
                <Card>
                    <Alert severity="warning">No moves in the repertoire !</Alert>
                    <CardActions>
                        <Button size={"small"}  variant={"outlined"} href={`/board/edit/${book?.id}`}>Go to editor</Button>
                    </CardActions>
                </Card>
            }
            {
                parent && childMoves.length==0 &&
                <Card>
                    <Alert severity="warning">No more moves in the repertoire !</Alert>
                    <CardActions>
                        <Button size={"small"}  variant={"outlined"} href={`/board/edit/${book?.id}?p=${parent}`}>Go to editor</Button>
                    </CardActions>
                </Card>
            }
            {
                childMoves.length >0 && isCorrectMove==false && correctMove && <InCorrectMoveFeedback correctMove={correctMove}/>
            }
        </>
    );
});

Feedback.displayName = 'Feedback';
export default Feedback;