// pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps }
    }

    render() {
        return (
            <Html>
                <Head>
                    {/* Google Tag Manager */}
                    <script>
                        {`
                        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PWK28VFB');
                        `}
                    </script>
                    {/* End Google Tag Manager */}
                    <link href=' https://cdn.jsdelivr.net/gh/orioncactus/pretendard@1.1.0/dist/web/static/pretendard.css' rel="stylesheet" />
                </Head>
                <body>
                    {/* Google Tag Manager (noscript) */}
                    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PWK28VFB"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
                    {/* End Google Tag Manager (noscript) */}
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument