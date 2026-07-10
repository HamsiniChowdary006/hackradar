import { Bell, Check, Radio } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { markAllRead, markRead, notificationsQuery } from "@/lib/notifications";
import { useHydrated } from "@/lib/use-hydrated";

export function NotificationsBell() {
  const { user, openAuth } = useAuth();
  const qc = useQueryClient();
  const hydrated = useHydrated();
  const { data = [] } = useQuery(notificationsQuery(user?.id));
  const unread = data.filter((n) => !n.is_read).length;

  if (!user) {
    return (
      <button
        onClick={() => openAuth("signin")}
        aria-label="Notifications"
        className="w-11 h-11 rounded-2xl grid place-items-center neu-pressable text-foreground"
      >
        <Bell className="w-4 h-4" />
      </button>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          aria-label="Notifications"
          className="w-11 h-11 rounded-2xl grid place-items-center neu-pressable text-foreground relative"
        >
          <Bell className="w-4 h-4" />
          {hydrated && unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold grid place-items-center">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 p-0 neu-card border-0 shadow-neu">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
          <div className="font-semibold text-sm">Notifications</div>
          {unread > 0 && (
            <button
              onClick={async () => {
                await markAllRead(user.id);
                qc.invalidateQueries({ queryKey: ["notifications"] });
              }}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <Check className="w-3 h-3" /> Mark all read
            </button>
          )}
        </div>
        <div className="max-h-96 overflow-y-auto">
          {data.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              You're all caught up 🎉
            </div>
          ) : (
            data.map((n) => (
              <button
                key={n.id}
                onClick={async () => {
                  if (!n.is_read) {
                    await markRead(n.id);
                    qc.invalidateQueries({ queryKey: ["notifications"] });
                  }
                }}
                className={
                  "w-full text-left px-4 py-3 border-b border-border/40 last:border-0 hover:bg-muted/40 transition flex gap-3 " +
                  (n.is_read ? "opacity-70" : "")
                }
              >
                <div className="w-8 h-8 rounded-full neu-card-sm grid place-items-center shrink-0 text-primary">
                  <Radio className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm leading-snug">{n.message}</div>
                  <div className="text-[11px] text-muted-foreground mt-1">
                    {hydrated ? relativeTime(n.created_at) : ""}
                  </div>
                </div>
                {!n.is_read && (
                  <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                )}
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function relativeTime(iso: string) {
  const d = new Date(iso);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
