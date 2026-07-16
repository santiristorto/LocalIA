import { RouterProvider } from "react-router-dom";

import { AuthProvider } from "./providers/auth-provider.tsx";
import { QueryClientProvider } from "./providers/query-client-provider.tsx";
import { router } from "./router/router.tsx";

export function App() {
  return (
    <QueryClientProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
}
