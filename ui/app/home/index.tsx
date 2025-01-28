
import {useContext, useEffect, useState} from 'react';
import SummarizeIcon from '@mui/icons-material/Summarize';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import CreateBookModal from "@/app/home/create-book-modal";
import {BooksProvider, Book, BooksContext} from '@/src/services/book';
import BookList from "@/app/home/books-list";
import {Card, CardContent, CardHeader} from "@mui/material";

const HomeComponent = ()=>{
    const {bookService} = useContext(BooksContext);
    const [open, setOpen] = useState(false);
    const [modalBook, setModalBook] = useState<null | Book>(null);
    const [books, setBooks] = useState<Book[]>([])


    const handleOpen = (book:null | Book) => {
        setOpen(true)
        setModalBook(book);
    };
    const handleClose = () => {
        setOpen(false);
        setModalBook(null)
    };

    const deleteBook =(id:string)=>{
        bookService?.remove(id).then(()=>{
            loadBooks();
        });
    }

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

    const onUpsertBook =()=>{
        loadBooks();
    }

    return (

        <main className="min-h-screen sm:p-10 p-2 place-content-center flex">
            <div className="flex-initial w-96">
                <Card variant={"elevation"}>
                    <CardHeader
                        title={<div>
                            <span className="p-2"><SummarizeIcon color="primary" fontSize={"medium"}/></span>
                            <span className={"align-bottom text-base"}>Repertoire</span>
                        </div>}
                        action={
                            <IconButton aria-label="add-book" onClick={()=>{handleOpen(null)}}>
                                <AddIcon/>
                            </IconButton>
                        }
                    />
                    <CreateBookModal open={open} handleClose={handleClose} book={modalBook} onUpsertBook={onUpsertBook}/>

                    <CardContent>
                        <BookList onEditTitleDesc={handleOpen} books={books} deleteBook={deleteBook}/>
                    </CardContent>

                </Card>
                <div className="col-span-3">

                </div>
            </div>

        </main>

    )
}
export default function Home() {

    return (
        <BooksProvider>
            <HomeComponent/>
        </BooksProvider>
    )
}
