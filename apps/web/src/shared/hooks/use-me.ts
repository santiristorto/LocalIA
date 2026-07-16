import { useQuery } from "@tanstack/react-query";

import { fetchMe } from "../lib/api-client.ts";

/** `useMe` — datos del usuario autenticado, resueltos por el backend a partir del JWT. */
export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
  });
}
