import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth-context";
import { AuthModal } from "@/components/auth-modal";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center neu-card p-10">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This page doesn't exist on HackRadar.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-2xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-95 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center neu-card p-10">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We couldn't load HackRadar right now.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-2xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-95"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-2xl neu-pressable px-5 py-2.5 text-sm font-semibold"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { property: "og:site_name", content: "HackRadar" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "HackRadar — Every hackathon, one feed" },
      { property: "og:title", content: "HackRadar — Every hackathon, one feed" },
      { name: "twitter:title", content: "HackRadar — Every hackathon, one feed" },
      { name: "description", content: "Browse hackathons and tech events from Devpost, Unstop, HackerEarth, Devfolio, MLH, Eventbrite and Hack2Skill — filtered by skill level, mode, and location." },
      { property: "og:description", content: "Browse hackathons and tech events from Devpost, Unstop, HackerEarth, Devfolio, MLH, Eventbrite and Hack2Skill — filtered by skill level, mode, and location." },
      { name: "twitter:description", content: "Browse hackathons and tech events from Devpost, Unstop, HackerEarth, Devfolio, MLH, Eventbrite and Hack2Skill — filtered by skill level, mode, and location." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/52e8ba7b-04d8-4abb-b9cc-22fa6f5bf471/id-preview-b63c853a--7c8a96cf-1044-4651-8305-8e357e40f39c.lovable.app-1783760033248.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/52e8ba7b-04d8-4abb-b9cc-22fa6f5bf471/id-preview-b63c853a--7c8a96cf-1044-4651-8305-8e357e40f39c.lovable.app-1783760033248.png" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              name: "HackRadar",
              url: "https://hackradar.lovable.app",
              description:
                "Aggregator of hackathons and tech events from every major platform.",
            },
            {
              "@type": "WebSite",
              name: "HackRadar",
              url: "https://hackradar.lovable.app",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://hackradar.lovable.app/browse?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            },
          ],
        }),
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Outlet />
          <AuthModal />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
