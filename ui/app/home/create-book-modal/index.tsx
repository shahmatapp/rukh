import React, {useContext, useEffect, useRef, useState} from 'react';
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import {Book, BooksContext} from "@/src/services/book";
import Tiptap from "@/app/components/wysiwyg/wysiwyg";
import {Checkbox, FormControlLabel, FormGroup} from "@mui/material";
interface Props{
    open:boolean,
    handleClose:any,
    book: null|Book,
    onUpsertBook: Function
}

interface RefProps{
    getHTML:()=>string
}

export default function CreateBookModal({open=false, handleClose, book, onUpsertBook}:Props){

    const [bookName,setBookName] = useState<string>(book?.name || "");
    const [isPerspectiveWhite, setIsPerspectiveWhite] = useState<boolean>(book?.perspective=='w' || true)
    const {bookService} = useContext(BooksContext);
    const ref = useRef<RefProps>();
    let createBook= async ()=>{
        let description = ref.current?.getHTML();
        let id = book==null ? undefined : book.id;
        let data = {name:bookName,id,description, perspective: isPerspectiveWhite ?'w':'b'}
        await bookService?.save(data);
        handleClose();
        onUpsertBook();
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
                        value={bookName || book?.name || ""}
                        fullWidth
                        variant="standard"
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setBookName(event.target.value);
                        }}
                    />

                    <Tiptap placeholder={"Describe ur Repertoire"} className={"h-40"} ref={ref} content={book?.description}/>

                    <FormControlLabel  control={<Checkbox checked={isPerspectiveWhite} disabled={book!=null} onChange={(event)=>{ setIsPerspectiveWhite(event.target.checked); }} />} label="White" />
                </FormGroup>




            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={createBook}>{book == null ?"Create" : "Update"}</Button>
            </DialogActions>
        </Dialog>
    );
}