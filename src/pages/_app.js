// pages/_app.js
import { GoogleFonts } from 'next-google-fonts';
import '../app/globals.css';


function MyApp({ Component, pageProps }) {
    <GoogleFonts href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;700&display=swap" />
    return <Component {...pageProps} />;
}

export default MyApp;
