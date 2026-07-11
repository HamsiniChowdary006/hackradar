import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { FileText } from "lucide-react";

const CANONICAL = "https://hackradar.lovable.app/blog/showcase-hackathon-experience";
const TITLE = "How to list a hackathon on your resume and LinkedIn";
const DESCRIPTION =
  "A developer's guide to showcasing hackathon experience on your resume and LinkedIn — what to highlight, how to phrase it, and templates you can copy.";

export const Route = createFileRoute("/blog/showcase-hackathon-experience")({
  head: () => ({
    meta: [
      { title: `${TITLE} — HackRadar` },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: CANONICAL },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: TITLE,
          description: DESCRIPTION,
          author: { "@type": "Organization", name: "HackRadar" },
          publisher: { "@type": "Organization", name: "HackRadar" },
          mainEntityOfPage: CANONICAL,
        }),
      },
    ],
  }),
  component: BlogPost,
});

function BlogPost() {
  const [search, setSearch] = useState("");
  return (
    <AppShell search={search} onSearch={setSearch}>
      <article className="max-w-3xl space-y-8">
        <header className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl grid place-items-center neu-card-sm text-primary">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1">
              Guide
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{TITLE}</h1>
          </div>
        </header>

        <div className="neu-card p-6 md:p-8 space-y-5 text-base leading-relaxed">
          <p>
            Hackathons are one of the fastest ways to prove you can ship real software under
            pressure — but only if you talk about them well. Here's how to turn a weekend
            build into a line on your resume that hiring managers actually notice.
          </p>

          <section className="space-y-3">
            <h2 className="text-xl font-bold">Where to put hackathons on your resume</h2>
            <p className="text-sm text-muted-foreground">
              For students and early-career developers, hackathons deserve their own section —
              usually right after Projects. For experienced engineers, fold winning entries
              into your Projects or Achievements section. Never bury them under Hobbies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold">What to highlight</h2>
            <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1.5">
              <li>Event name, host organization, and date</li>
              <li>Problem you tackled and the concrete solution you built</li>
              <li>Your specific role and the technical stack you used</li>
              <li>Outcomes: placement, prizes, users onboarded, demo link, GitHub repo</li>
              <li>Team size — recruiters read collaboration as a signal, not a weakness</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold">Resume template you can copy</h2>
            <pre className="neu-inset p-4 rounded-2xl text-xs overflow-x-auto whitespace-pre-wrap">
{`AI Frontier Hack 2026 — 2nd place / 240 teams                Feb 2026
Built "TriageAI", a real-time triage assistant for ER nurses, with a team of 4.
• Shipped a Next.js + FastAPI prototype in 36 hours; owned the backend and LLM prompt layer.
• Integrated OpenAI + Twilio to route critical alerts under 2s latency.
• Judged by clinicians from Stanford Health; invited to the accelerator shortlist.`}
            </pre>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold">How to list a hackathon on LinkedIn</h2>
            <p className="text-sm text-muted-foreground">
              LinkedIn gives you two great surfaces. Add the event under
              <strong> Experience</strong> with your role ("Hackathon Participant — Backend
              Lead"), and cross-link the project in the <strong>Projects</strong> section
              with the repo and demo URL. If you placed, add it to
              <strong> Honors &amp; Awards</strong> too — that section shows up in search.
            </p>
            <p className="text-sm text-muted-foreground">
              Write the description in the same voice as your resume, but a touch more
              personal — one sentence on why the problem mattered goes a long way.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold">Find your next hackathon</h2>
            <p className="text-sm text-muted-foreground">
              The best way to build a strong hackathon track record is to enter more of them.
              <Link to="/browse" className="text-primary font-semibold hover:underline">
                {" "}Browse every hackathon HackRadar tracks
              </Link>
              {" "}across Devpost, Unstop, HackerEarth, Devfolio, MLH, Eventbrite and
              Hack2Skill — filtered by skill level, mode, and city.
            </p>
          </section>
        </div>
      </article>
    </AppShell>
  );
}
