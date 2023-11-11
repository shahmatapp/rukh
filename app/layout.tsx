"use client"; // This is a client component 👈🏽
import './globals.css'
import { Inter } from 'next/font/google'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {useEffect, useState} from "react";
import {initDB} from "@/src/services/db";
const inter = Inter({ subsets: ['latin'] });

const theme = createTheme({
  palette: {
    primary: {
      main:'#082f49'
    },
    secondary:{
      main:"#09090b"
    },
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const [isReady, setIsReady]= useState(false);
  useEffect(()=>{
    initDB().then(()=>{
      setIsReady(true)
    })
  });

  return (
    <html lang="en">
      <body className={inter.className +" bg-primary"}>
        { isReady ?
            <ThemeProvider theme={theme}>
              {children}
            </ThemeProvider>
            :
            <div>Loading</div>
        }
      </body>
    </html>
  )
}
