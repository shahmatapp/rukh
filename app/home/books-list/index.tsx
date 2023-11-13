import {useContext} from "react";
import {Book, BooksContext} from "@/src/services/book";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link'
export default function BookList(){

    const {books} = useContext(BooksContext);

    return(
        <List>
            {
                books.map((b:Book)=>{
                    return (
                        <ListItem key={b.id}>
                            <ListItemText>
                                <Link href={`/board/prac/${b.id}`}>{b.name}</Link>
                            </ListItemText>
                        </ListItem>
                    )
                })
            }
        </List>
    )
}