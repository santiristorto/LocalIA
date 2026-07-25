import { RouterProvider } from "react-router-dom";

import { AuthProvider } from "./providers/auth-provider.tsx";
import { QueryClientProvider } from "./providers/query-client-provider.tsx";
import { ThemeProvider } from "./providers/theme-provider.tsx";
import { router } from "./router/router.tsx";

export function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
