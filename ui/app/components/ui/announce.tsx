import SportsIcon from '@mui/icons-material/Sports';
import {ReactNode} from "react";

interface Props{
    children: ReactNode;
}
export default function Announce({children}:Props){
    return <div><span className={"text-primary mr-2"}><SportsIcon fontSize={"large"}/></span><span>{children}</span></div>;
}