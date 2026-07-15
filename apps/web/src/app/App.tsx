import { RouterProvider } from "react-router-dom";

import { QueryClientProvider } from "./providers/query-client-provider.tsx";
import { router } from "./router/router.tsx";

export function App() {
  return (
    <QueryClientProvider>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
