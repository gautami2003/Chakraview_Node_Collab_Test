// import { Geist, Geist_Mono, Lato } from "next/font/google";
import { Lato } from "next/font/google";
import "./styles/globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ToastContainer } from 'react-toastify';

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const lato = Lato({
  weight: ['400'],
  variable: "--font-lato",
  subsets: ["latin"],
});

export const metadata = {
  title: "Chakraview School Bus Tracking",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${lato.variable}`}>
      <head>
      </head>
      {/* <body className={`${geistSans.variable} ${geistMono.variable}`}> */}
      <body>
        <ToastContainer position="bottom-left" />
        {children}
      </body>
    </html>
  );
}
