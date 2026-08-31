import type { ReactNode } from "react";

type PageTitle = string | readonly [string, string];

export function PageHero({ title, text, aside }: { title: PageTitle; text: string; aside?: ReactNode }) {
  const titleLines = typeof title === "string" ? [title] : title;

  return (
    <section className="page-hero">
      <div className="page-hero__content">
        <div>
          <h1 aria-label={titleLines.join(" ")}>{titleLines.map((line) => <span aria-hidden="true" key={line}>{line}</span>)}</h1>
          <p>{text}</p>
        </div>
        {aside && <div className="page-hero__aside">{aside}</div>}
      </div>
    </section>
  );
}
