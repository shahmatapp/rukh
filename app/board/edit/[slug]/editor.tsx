import {useContext} from "react";
import PageContext from "@/app/board/edit/[slug]/context";
import ConfirmMove from "@/app/board/edit/[slug]/confirm-move";
import {Move} from "@/src/services/move";
import Announce from "@/app/components/ui/announce";

interface Props{
    confirmMove:(m:Move)=>void,
    madeMove:boolean

}

export default function Editor({confirmMove, madeMove}:Props){
    const {unSavedMove} = useContext(PageContext);
    return (
      <>
          {!unSavedMove && !madeMove && <Announce>Make a move on the board</Announce>}
          {!unSavedMove && madeMove && <Announce>Continue making moves</Announce>}
          { unSavedMove &&
              <ConfirmMove confirmMove={(m)=> {
                    confirmMove(m)
                }
              }  />
          }
      </>
    );
}