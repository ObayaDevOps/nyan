import SideBar from "../components/sidebar";
import Seo from "../components/Seo";
import ContactForm from "../components/ContactForm";
export default function Rental({ navigation, content }) {
  return (
    <>
      <Seo title={`${content.title} | Nekosero`} path="/rental-interest" />
      <SideBar navigation={navigation} showNavIcon />
      <main>
        <header
          className="rental-hero"
          style={{
            backgroundImage: `url(${JSON.stringify(content.image?.url || "/nekosero5.png")})`,
          }}
        >
          <div>
            <h1>{content.title}</h1>
            <p>{content.subTitle}</p>
          </div>
        </header>
        <section className="rental-content">
          <h2>{content.pageName}</h2>
          {[
            content.paragraphText1,
            content.paragraphText2,
            content.paragraphText3,
          ]
            .filter(Boolean)
            .map((text, i) => (
              <p key={i}>{text}</p>
            ))}
          <details className="inquiry rental-inquiry">
            <summary aria-label="Register rental interest">
              Register Interest
            </summary>
            <ContactForm type="rental" />
          </details>
        </section>
      </main>
    </>
  );
}
export async function getStaticProps(context) {
  const { pageProps, getRental } = await import("../lib/content");
  return pageProps(context, { content: await getRental(!!context.preview) });
}
