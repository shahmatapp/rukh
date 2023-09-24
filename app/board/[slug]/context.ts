import { createContext } from 'react';
import {Move} from "@/src/services/move";

const PageContext = createContext({} as {move:Move});

export default PageContext