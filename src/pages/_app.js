import Script from "next/script";
import "@/styles/globals.css";
import Head from "next/head";
import localFont from "next/font/local";
const heading = localFont({
  src: "../fonts/unbounded-400.woff2",
  weight: "400",
  variable: "--heading-font",
  display: "swap",
});
const rentalText = localFont({
  src: "../fonts/unbounded-300.woff2",
  weight: "300",
  variable: "--rental-font",
  display: "swap",
});
const text = localFont({
  src: "../fonts/inter-400.woff2",
  variable: "--text-font",
  display: "swap",
});
export default function App({ Component, pageProps }) {
  return (
    <div className={`${heading.variable} ${rentalText.variable} ${text.variable}`}>
      <Script
        src="https://cloud.umami.is/script.js"
        data-website-id="0e1e9375-cc65-4765-bc9e-f7923eb47aa4"
        strategy="afterInteractive"
      />
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </Head>
      {pageProps.preview && (
        <aside className="preview">
          Draft preview —{" "}
          <form action="/api/exit-preview" method="get">
            <button>Exit preview</button>
          </form>
        </aside>
      )}
      <Component {...pageProps} />
    </div>
  );
}
