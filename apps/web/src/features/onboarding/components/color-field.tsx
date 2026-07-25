export interface ColorFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

/** Selector de color de marca — picker nativo + input hexadecimal sincronizado. */
export function ColorField({
  id,
  label,
  value,
  onChange,
  error,
}: ColorFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="color"
          value={/^#[0-9A-Fa-f]{6}$/.test(value) ? value : "#4F46E5"}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-12 cursor-pointer rounded-md border border-gray-300 dark:border-gray-700"
          aria-label={`${label} — selector visual`}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#4F46E5"
          aria-invalid={Boolean(error)}
          className="w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        />
      </div>
      {error && (
        <p role="alert" aria-live="polite" className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
