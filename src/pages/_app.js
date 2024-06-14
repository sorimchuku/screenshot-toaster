// pages/_app.js
import React from 'react';
import App from 'next/app';
import "@/app/globals.css";
import TopBar from '@/components/TopBar';
import localFont from 'next/font/local';
import Head from 'next/head';
import { signInAndSetCookie } from '@/firebase';

const pretendard = localFont({ src: '../../public/fonts/PretendardVariable.woff2' });

export const metadata = {
    title: "Shottoaster",
    description: "simple screenshot toaster for developers",
};

function RootLayout({ children }) {
    return (
        <div className={pretendard.className} style={{ overflow: 'visible', maxHeight: '100vh', minHeight: '100vh', height: '100vh', minWidth: '1080px'}}>{children}</div>
    );
}


class MyApp extends App {
    componentDidMount() {
        signInAndSetCookie();
    }
    render() {
        const { Component, pageProps } = this.props;
        return (
            <RootLayout> {/* RootLayout 컴포넌트로 감싸줍니다. */}
            <Head>
                    <title>{metadata.title}</title>
                    <meta name="description" content={metadata.description} />
                    <meta name='viewport' content='height=device-height, width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=1' />
            </Head>
                <TopBar />
                <Component {...pageProps} />
            </RootLayout>
        );
    }
}

export default MyApp;
