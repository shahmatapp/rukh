import {useContext} from "react";
import PageContext from "@/app/board/edit/[slug]/context";
import ConfirmMove from "@/app/board/edit/[slug]/confirm-move";
import {Move} from "@/src/services/move";
import Announce from "@/app/components/ui/announce";
import {Card, CardContent} from "@mui/material";

interface Props{
    confirmMove:(m:Move)=>void,
    madeMove:boolean

}

const announceCard = (str:string)=>{
    return (
        <Card>
            <CardContent>
                <Announce>{str}</Announce>
            </CardContent>
        </Card>
    )
}
export default function Editor({confirmMove, madeMove}:Props){
    const {unSavedMove} = useContext(PageContext);
    return (
      <>
          {!unSavedMove && !madeMove && announceCard("Make a move on the board")}
          {!unSavedMove && madeMove && announceCard("Continue making moves")}
          { unSavedMove &&
              <ConfirmMove confirmMove={(m)=> {
                    confirmMove(m)
                }
              }  />
          }
      </>
    );
}