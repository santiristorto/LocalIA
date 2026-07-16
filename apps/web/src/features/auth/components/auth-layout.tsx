import type { ReactNode } from "react";

export interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

/**
 * AuthLayout — UX/UI Specification §2/§3: card centrada (max-width 400px)
 * sobre fondo neutro claro. Compartido por Login, Registro, Recuperar y
 * Restablecer contraseña, para no repetir la estructura cuatro veces.
 */
export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6 font-sans">
      <div className="w-full max-w-[400px] rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <p className="text-lg font-semibold text-primary-dark">LocalIA</p>
          <h1 className="mt-3 text-xl font-semibold text-gray-900">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>

        {children}

        {footer && (
          <div className="mt-6 text-center text-sm text-gray-500">{footer}</div>
        )}
      </div>
    </main>
  );
}
