import Link from "next/link";
import { BrandMark } from "../components/BrandMark";

export default function NotFound() {
  return (
    <section className="not-found-page">
      <BrandMark locale="en" />
      <span className="not-found-code">404</span>
      <h1>This page could not be found.</h1>
      <p>
        Choose a language to return to the Marea Dental website.
      </p>
      <div className="button-row">
        <Link className="button button-dark" href="/ka">
          ქართული
        </Link>
        <Link className="button button-coral" href="/en">
          English
        </Link>
      </div>
    </section>
  );
}
