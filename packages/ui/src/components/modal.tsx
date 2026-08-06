import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import { X } from "lucide-react";

export interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Modal — diálogo accesible, montado vía Portal directo a `document.body`
 * (Sprint 4). Sin librería externa (Frontend Architecture Specification: no
 * agregar dependencias salvo que sean estrictamente necesarias).
 *
 * Lo que resuelve, explícitamente:
 * - Overlay real que bloquea la interfaz: `fixed inset-0` tanto en el
 *   overlay como en el contenedor (no `absolute` dependiendo de un
 *   ancestro posicionado), scroll del body bloqueado mientras está abierto,
 *   y foco atrapado dentro del panel (Tab/Shift+Tab no puede salir).
 * - `Escape` cierra; click en el overlay cierra; click dentro del panel no
 *   propaga (el overlay nunca ve ese click).
 * - Panel centrado, ancho acotado (`max-w-[560px]`), con scroll propio si
 *   el contenido no entra en el viewport (header fijo, cuerpo scrolleable).
 * - Animación de entrada/salida (fade + scale sutil), montada vía
 *   `requestAnimationFrame` para que la transición de "cerrado → abierto"
 *   sea real (si el estado inicial y el de la primera pintura son iguales,
 *   no hay nada que animar).
 *
 * La causa de que un modal anterior pareciera "no bloquear nada" no estaba
 * acá — Tailwind no generaba las clases de este componente porque
 * `packages/ui` no estaba en el `content` de `apps/web/tailwind.config.ts`
 * (ver ese archivo). Ya corregido, pero esta reescritura además suma lo que
 * pediste explícitamente (foco atrapado, Escape, animación).
 */
export function Modal({ title, onClose, children }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const firstFocusable =
      panelRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    firstFocusable?.focus();

    return () => {
      previouslyFocused?.focus();
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 bg-gray-950/60 backdrop-blur-[2px] transition-opacity duration-200 ease-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(event) => event.stopPropagation()}
        className={`relative flex max-h-[85vh] w-full max-w-[560px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-gray-950/10 transition-all duration-200 ease-out dark:border-gray-800 dark:bg-gray-900 dark:shadow-black/40 ${
          isVisible
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-2 scale-95 opacity-0"
        }`}
      >
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <h2
            id="modal-title"
            className="text-base font-semibold tracking-tight text-gray-900 dark:text-gray-50"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:hover:bg-gray-800 dark:hover:text-gray-300"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="min-h-0 overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
