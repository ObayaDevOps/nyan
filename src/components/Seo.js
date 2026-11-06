import Head from "next/head";
export default function Seo({
  title = "Nekosero",
  description = "A creative shopping, dining, brewing, fashion, and contemporary arts space.",
  path = "/",
  image = "/neko-logo_f5fiok.png",
}) {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://www.nekosero.ug";
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={new URL(path, origin).href} />
      <meta property="og:url" content={new URL(path, origin).href} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta
        property="og:image"
        content={new URL(image || "/neko-logo_f5fiok.png", origin).href}
      />
    </Head>
  );
}
