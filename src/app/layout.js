import "./globals.css";


export const metadata = {
  title: "Shottoaster",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
            {children}
      </body>
    </html>
  );
}
