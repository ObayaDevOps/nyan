import Image from "next/image";
import Link from "next/link";
import Seo from "../components/Seo";
import SideBar from "../components/sidebar";
export default function Home({ navigation }) {
  return (
    <>
      <Seo />
      <SideBar navigation={navigation} />
      <main className="home">
        <h1 className="sr-only">Nekosero</h1>
        <Link href="/">
          <Image
            src="/nekosero5.png"
            alt="Nekosero Brand Logo"
            width={250}
            height={250}
            priority
          />
        </Link>
        <div className="home-actions">
          <Link className="button" href="/events">
            See What&apos;s On ↗
          </Link>
          <Link className="button" href="/rental-interest">
            Come Join Us ↗
          </Link>
        </div>
      </main>
    </>
  );
}
export async function getStaticProps(context) {
  const { pageProps } = await import("../lib/content");
  return pageProps(context);
}
