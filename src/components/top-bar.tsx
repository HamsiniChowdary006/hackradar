import { Search } from "lucide-react";
import { NotificationsBell } from "./notifications-bell";
import { UserMenu } from "./user-menu";
import { ThemeToggle } from "./theme-toggle";

export function TopBar({
  search,
  onSearch,
}: {
  search?: string;
  onSearch?: (v: string) => void;
}) {
  return (
    <header className="sticky top-0 z-20 backdrop-blur-md bg-background/70 border-b border-border/50">
      <div className="px-4 md:px-8 py-4 flex items-center gap-3 md:gap-5 max-w-[1400px] mx-auto">
        <div className="flex-1 max-w-xl">
          <label htmlFor="global-search" className="sr-only">
            Search hackathons
          </label>
          <div className="neu-inset flex items-center gap-3 px-4 py-2.5">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" aria-hidden="true" />
            <input
              id="global-search"
              type="search"
              aria-label="Search hackathons, tags, cities"
              placeholder="Search hackathons, tags, cities..."
              value={search ?? ""}
              onChange={(e) => onSearch?.(e.target.value)}
              className="bg-transparent outline-none text-sm w-full placeholder:text-muted-foreground"
            />
          </div>
        </div>
        <ThemeToggle />
        <NotificationsBell />
        <UserMenu />
      </div>
    </header>
  );
}
