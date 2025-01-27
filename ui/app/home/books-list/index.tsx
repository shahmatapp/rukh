import React, {useContext, useEffect, useState} from "react";
import {Book, BooksContext} from "@/src/services/book";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {ListItemSecondaryAction, Menu, MenuItem} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { useRouter } from 'next/navigation'

interface Props{
    onEditTitleDesc:Function
}

export default function BookList({onEditTitleDesc}:Props){
    const router = useRouter();
    const {bookService} = useContext(BooksContext);
    const [anchorEl, setAnchorEl] = useState<null| HTMLElement>(null);
    const [books, setBooks] = useState<Book[]>([])
    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const loadBooks = ()=>{
        if(bookService){
            bookService.getAll().then(data=>{
                setBooks(data as Book[]);
            })
        }
    }
    useEffect(() => {
       loadBooks();
    }, [bookService]);

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const onDelete =  (book:Book)=>{
        let c = prompt("Type 'delete' to confirm");
        if(c?.toLowerCase()!="delete")
            return;
        bookService?.remove(book.id).then(()=>{
           loadBooks();
        });
        handleMenuClose();
    }

    const editTitleDesc = (book:Book)=>{
        handleMenuClose();
        onEditTitleDesc(book);
    }

    const editBoard = (book:Book)=>{
        handleMenuClose();
        router.push(`/board/edit/${book?.id}`);
    }

    return(
        <List dense={true}>
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
                                    <MenuItem onClick={()=>{editTitleDesc(b)}}><span className={"text-sm"}>Edit Title/Description</span></MenuItem>
                                    <MenuItem onClick={()=>{ editBoard(b)}}><span className={"text-sm"}>Edit Repertoire</span></MenuItem>
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