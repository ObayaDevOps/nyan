import dynamic from "next/dynamic";
import Head from "next/head";
const Studio = dynamic(() => import("../../components/StudioClient"), {
  ssr: false,
  loading: () => <p>Loading editor…</p>,
});
export default function StudioPage() {
  return (
    <>
      <Head>
        <title>Editor Studio | Nekosero</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div className="studio">
        <Studio />
      </div>
    </>
  );
}
