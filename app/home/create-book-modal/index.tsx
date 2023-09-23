import React, {useContext, useState} from 'react';
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import {BooksContext, BookService} from "@/src/services/book";
interface Props{
    open:boolean,
    handleClose:any,
}
export default function CreateBookModal({open=false, handleClose,}:Props){
    const [bookName,setBookName] = useState("");
    const {dispatch} = useContext(BooksContext);
    let createBook= ()=>{
        dispatch({type:'add',data:{name:bookName}});
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
            <DialogTitle>Create a Book</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Give a title.
                </DialogContentText>
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
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={createBook}>Create</Button>
            </DialogActions>
        </Dialog>
    );
}