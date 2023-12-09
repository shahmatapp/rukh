import React, {useContext, useState} from "react";
import {Book, BooksContext, bookService} from "@/src/services/book";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {ListItemSecondaryAction, Menu, MenuItem} from "@mui/material";
import IconButton from "@mui/material/IconButton";
export default function BookList(){

    const {books} = useContext(BooksContext);
    const [anchorEl, setAnchorEl] = useState<null| HTMLElement>(null);
    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const onDelete =  (book:Book)=>{
        let c = prompt("Type 'delete' to confirm");
        if(c?.toLowerCase()!="delete")
            return;
        bookService.remove(book.id).then(()=>{
            console.log("Repertoire deleted")
        });
    }

    return(
        <List>
            {
                books.map((b:Book, i)=>{
                    return (
                        <ListItem key={b.id} >
                            <ListItemText>
                                <span>{i+1}. </span><Link href={`/board/prac/${b.id}`}>{b.name}</Link>
                            </ListItemText>
                            <ListItemSecondaryAction>
                                <IconButton onClick={handleMenuClick}>
                                    <MoreVertIcon />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                >
                                    <MenuItem onClick={()=>{}}><span className={"text-sm"}>Edit Title/Description</span></MenuItem>
                                    <MenuItem onClick={()=>{}}><span className={"text-sm"}>Edit Repertoire</span></MenuItem>
                                    <MenuItem onClick={()=>{onDelete(b)}}> <span className={"text-red-500 text-sm"}>Delete</span></MenuItem>
                                </Menu>
                            </ListItemSecondaryAction>
                        </ListItem>
                    )
                })
            }
        </List>
    )
}