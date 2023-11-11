
import {useState} from 'react';
import SummarizeIcon from '@mui/icons-material/Summarize';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import CreateBookModal from "@/app/home/create-book-modal";
import { BooksProvider } from '@/src/services/book';
import BookList from "@/app/home/books-list";
import {Card, CardContent, CardHeader} from "@mui/material";


export default function Home() {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);



    return (
        <BooksProvider>
            <main className="min-h-screen sm:p-10 p-2 place-content-center flex">
                <div className="flex-initial w-96">
                    <Card variant={"elevation"}>
                        <CardHeader
                            title={<div>
                                <span className="p-2"><SummarizeIcon color="primary" fontSize={"medium"}/></span>
                                <span className={"align-bottom text-base"}>Repertoire</span>
                            </div>}
                            action={
                                <IconButton aria-label="add-book" onClick={handleOpen}>
                                    <AddIcon/>
                                </IconButton>
                            }
                        />
                        <CreateBookModal open={open} handleClose={handleClose} />

                        <CardContent>
                            <BookList/>
                        </CardContent>

                    </Card>
                    <div className="col-span-3">

                    </div>
                </div>

            </main>
        </BooksProvider>
    )
}
