"use client"; // This is a client component 👈🏽
import './globals.css'
import { Inter } from 'next/font/google'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {WebSocketProvider} from "@/src/contexts/websockets";
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



  return (
    <html lang="en">
      <body className={inter.className +" bg-primary"}>
      <ThemeProvider theme={theme}>
        <WebSocketProvider>
          {children}
        </WebSocketProvider>
      </ThemeProvider>
      </body>
    </html>
  )
}
