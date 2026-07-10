import { useEffect, useState } from "react";

/** Returns true only after the component has mounted on the client.
 *  Use this to gate time-dependent or storage-dependent UI to avoid
 *  server/client hydration mismatches. */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
