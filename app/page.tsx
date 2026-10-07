/* Native images keep the supplied SVG logos and art-directed photos at their intrinsic sizes. */
/* eslint-disable @next/next/no-img-element */
import { RequestAccessForm } from "./request-access-form";
import { siteName } from "./site";

const platforms = [
  { name: "Spotify", file: "spotify.svg", width: 96, height: 29 },
  { name: "Apple Podcasts", file: "apple-podcast.svg", width: 78, height: 29 },
  { name: "Google Podcasts", file: "google-podcasts.svg", width: 125, height: 18 },
  { name: "Pocket Casts", file: "pocket-casts.svg", width: 129, height: 26 },
];

export default function Home() {
  return (
    <div className="page">
      <div className="shell">
        <header className="brand">
          <img src="/images/logo.svg" width="135" height="56" alt={siteName} />
        </header>
        <main className="panel">
          <div className="copy">
            <h1>
              <span className="headline-accent">Publish your podcasts</span>{" "}
              <span className="headline-plain">everywhere.</span>
            </h1>
            <p className="lede">
              Upload your audio to Pod with a single click. We’ll then distribute your podcast to Spotify, Apple Podcasts, Google Podcasts, Pocket Casts and more!
            </p>
          </div>
          <RequestAccessForm />
          <section className="platforms" aria-labelledby="platforms-title">
            <h2 id="platforms-title" className="sr-only">Podcast platforms</h2>
            <ul>
              {platforms.map(platform => (
                <li key={platform.file}>
                  <img src={`/images/${platform.file}`} width={platform.width} height={platform.height} alt={platform.name} />
                </li>
              ))}
            </ul>
          </section>
        </main>
        <div className="visual" aria-hidden="true">
          <picture>
            <source media="(min-width: 68.75rem)" srcSet="/images/desktop/image-host.jpg" />
            <source media="(min-width: 48rem)" srcSet="/images/tablet/image-host.jpg" />
            <img className="host" src="/images/mobile/image-host.jpg" alt="" />
          </picture>
          <img className="dots" src="/images/bg-pattern-dots.svg" width="232" height="104" alt="" />
        </div>
      </div>
      <footer className="credit">
        <span>Challenge by <a href="https://www.frontendmentor.io/challenges/pod-request-access-landing-page-eyTmdkLSG">Frontend Mentor</a>.</span>{" "}
        <span>Built by <a href="https://royeradames.com">Royer Adames</a>.</span>
      </footer>
    </div>
  );
}
