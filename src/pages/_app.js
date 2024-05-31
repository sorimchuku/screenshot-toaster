// pages/_app.js
import { NextGoogleFonts } from 'next-google-fonts';
import '../app/globals.css';


function MyApp({ Component, pageProps }) {
    <NextGoogleFonts href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;700&display=swap" />
    return <Component {...pageProps} />;
}

export default MyApp;
