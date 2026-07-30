export interface AvatarProps {
  name: string;
  size?: "sm" | "md";
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();

  return `${parts[0]![0]}${parts[parts.length - 1]![0]}`.toUpperCase();
}

/**
 * Avatar — no estaba en el inventario original del sistema de diseño
 * (UX/UI Specification §9), se agregó porque el Topbar del Employee Center
 * lo necesita directamente. Solo iniciales por ahora (sin foto de perfil).
 */
export function Avatar({ name, size = "md" }: AvatarProps) {
  const dimensions = size === "sm" ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm";

  return (
    <span
      className={`inline-flex ${dimensions} items-center justify-center rounded-full bg-primary font-semibold text-white`}
      aria-hidden="true"
      title={name}
    >
      {getInitials(name)}
    </span>
  );
}
