
import Script from 'next/script';
import './globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Next.js App with NextAuth',
  description: 'Next.js authentication with NextAuth.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
        <Script 
         src="https://sdk.cashfree.com/js/v3/cashfree-2023.03.07.js"
        strategy="lazyOnload" // or "afterInteractive" based on your needs
      />
      <body>
        {/* Wrap your app in the SessionProvider */}
        {/* <SessionProviderWrapper> */}
          {children}
          {/* </SessionProviderWrapper> */}
      </body>
    </html>
  );
}
