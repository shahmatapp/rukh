import React, {useContext, useRef, useState} from 'react';
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import {BooksContext} from "@/src/services/book";
import {v4 as uuid} from "uuid";
import Tiptap from "@/app/components/wysiwyg/wysiwyg";
import {Checkbox, FormControlLabel, FormGroup} from "@mui/material";
interface Props{
    open:boolean,
    handleClose:any,
}

interface RefProps{
    getHTML:()=>string
}

export default function CreateBookModal({open=false, handleClose,}:Props){
    const [bookName,setBookName] = useState("");
    const [isPerspectiveWhite, setIsPerspectiveWhite] = useState(true)
    const {dispatch} = useContext(BooksContext);
    const ref = useRef<RefProps>();
    let createBook= ()=>{
        let description = ref.current?.getHTML();
        dispatch({type:'add',data:{name:bookName,id:uuid(),description, perspective: isPerspectiveWhite ?'w':'b'}});
        handleClose();
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            className={"modal"}
            fullWidth={true}
            maxWidth={"sm"}
        >
            <DialogTitle>Create a Repertoire</DialogTitle>
            <DialogContent>
                <FormGroup>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Title"
                        type="text"
                        value={bookName}
                        fullWidth
                        variant="standard"
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setBookName(event.target.value);
                        }}
                    />

                    <Tiptap placeholder={"Describe ur Repertoire"} className={"h-40"} ref={ref}/>

                    <FormControlLabel  control={<Checkbox checked={isPerspectiveWhite} onChange={(event)=>{ setIsPerspectiveWhite(event.target.checked); }} />} label="White" />
                </FormGroup>




            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={createBook}>Create</Button>
            </DialogActions>
        </Dialog>
    );
}