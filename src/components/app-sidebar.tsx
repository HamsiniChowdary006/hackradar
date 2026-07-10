import { Link, useRouterState } from "@tanstack/react-router";
import { Radar, Home, Compass, Bookmark, Plus, Info, HelpCircle } from "lucide-react";

const nav = [
  { to: "/", label: "Home", icon: Home },
  { to: "/browse", label: "Browse", icon: Compass },
  { to: "/saved", label: "Saved", icon: Bookmark },
  { to: "/about", label: "About", icon: Info },
  { to: "/help", label: "Help", icon: HelpCircle },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed top-0 left-0 h-screen w-72 p-6 flex-col z-30">
        <Link to="/" className="flex items-center gap-3 mb-10">
          <div className="w-11 h-11 rounded-2xl grid place-items-center neu-card-sm">
            <Radar className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="text-lg font-bold tracking-tight">HackRadar</div>
            <div className="text-xs text-muted-foreground">Every hackathon, one feed</div>
          </div>
        </Link>

        <nav className="flex flex-col gap-2 flex-1">
          {nav.map((item) => {
            const active = pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={
                  "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all " +
                  (active
                    ? "bg-primary text-primary-foreground shadow-neu-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60")
                }
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <Link
          to="/submit"
          className="mt-4 flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm shadow-neu-sm hover:opacity-95 transition"
        >
          <Plus className="w-4 h-4" />
          Submit a Hackathon
        </Link>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 px-3 pb-3 pt-2">
        <div className="neu-card-sm flex items-center justify-around px-2 py-2">
          {[...nav.slice(0, 3), { to: "/submit" as const, label: "Submit", icon: Plus }].map(
            (item) => {
              const active = pathname === item.to;
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={
                    "flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-[11px] font-medium " +
                    (active ? "text-primary" : "text-muted-foreground")
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            },
          )}
        </div>
      </nav>
    </>
  );
}
