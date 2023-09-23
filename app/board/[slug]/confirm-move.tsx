import Button from "@mui/material/Button";

interface Props{
    confirmMove:()=>void
}

export default function ConfirmMove({confirmMove}:Props){

    return (
        <div>
            <Button variant="contained" disableElevation onClick={confirmMove}>
                Confirm
            </Button>
        </div>
    );
}