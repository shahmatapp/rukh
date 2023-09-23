
import {useState} from 'react';
import SummarizeIcon from '@mui/icons-material/Summarize';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import CreateBookModal from "@/app/home/create-book-modal";
import { BooksProvider } from '@/src/services/book';
import BookList from "@/app/home/books-list";


export default function Home() {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);



    return (
        <BooksProvider>
            <main className="min-h-screen p-24">
                <div className="grid grid-cols-4 gap-5">
                    <div>
                        <div className="header border-dashed border-0 border-b pb-3">
                            <span className="p-2 align-bottom mb-2"><SummarizeIcon color="primary" /></span>
                            <span>Books</span>
                            <span className="float-right">
                                <IconButton aria-label="add-book" onClick={handleOpen}>
                                    <AddIcon/>
                                </IconButton>
                            </span>
                            <CreateBookModal open={open} handleClose={handleClose} />
                        </div>
                        <BookList/>
                    </div>
                    <div className="col-span-3">

                    </div>
                </div>

            </main>
        </BooksProvider>
    )
}
