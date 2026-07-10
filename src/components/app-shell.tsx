import { type ReactNode } from "react";
import { AppSidebar } from "./app-sidebar";
import { TopBar } from "./top-bar";

export function AppShell({
  children,
  search,
  onSearch,
}: {
  children: ReactNode;
  search?: string;
  onSearch?: (v: string) => void;
}) {
  return (
    <div className="min-h-screen w-full flex bg-background text-foreground">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0 md:pl-72 pb-20 md:pb-0">
        <TopBar search={search} onSearch={onSearch} />
        <main className="flex-1 px-4 md:px-8 py-6 md:py-8 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
