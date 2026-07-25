import { weekdayLabels, weekdays } from "@localia/types";
import type { OpeningHours } from "@localia/types";

export interface WeeklyHoursEditorProps {
  value: OpeningHours;
  onChange: (value: OpeningHours) => void;
}

/**
 * Editor de horario semanal — versión simplificada de este sprint: un solo
 * rango horario por día (la UX/UI Specification §11 define un widget más
 * rico con múltiples rangos y "copiar a todos los días", que queda para
 * cuando exista la pantalla de Configuración completa). Decisión de alcance
 * explícita, no un olvido — cubre el 100% de los comercios piloto que abren
 * un solo turno por día.
 */
export function WeeklyHoursEditor({ value, onChange }: WeeklyHoursEditorProps) {
  function updateDay(
    day: (typeof weekdays)[number],
    patch: Partial<OpeningHours["mon"]>,
  ) {
    onChange({ ...value, [day]: { ...value[day], ...patch } });
  }

  function copyMondayToAll() {
    const monday = value.mon;
    onChange(
      weekdays.reduce(
        (acc, day) => ({ ...acc, [day]: { ...monday } }),
        {} as OpeningHours,
      ),
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Horario de atención
        </p>
        <button
          type="button"
          onClick={copyMondayToAll}
          className="text-sm font-medium text-primary hover:text-primary-hover"
        >
          Copiar el lunes a todos los días
        </button>
      </div>

      <div className="flex flex-col gap-2 rounded-lg border border-gray-200 p-3 dark:border-gray-800">
        {weekdays.map((day) => {
          const schedule = value[day];

          return (
            <div key={day} className="flex flex-wrap items-center gap-3">
              <label className="flex w-36 items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={schedule.isOpen}
                  onChange={(e) => updateDay(day, { isOpen: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-800"
                />
                {weekdayLabels[day]}
              </label>

              {schedule.isOpen ? (
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={schedule.open}
                    onChange={(e) => updateDay(day, { open: e.target.value })}
                    className="rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 [color-scheme:light] dark:[color-scheme:dark]"
                    aria-label={`Hora de apertura del ${weekdayLabels[day]}`}
                  />
                  <span className="text-sm text-gray-400">a</span>
                  <input
                    type="time"
                    value={schedule.close}
                    onChange={(e) => updateDay(day, { close: e.target.value })}
                    className="rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 [color-scheme:light] dark:[color-scheme:dark]"
                    aria-label={`Hora de cierre del ${weekdayLabels[day]}`}
                  />
                </div>
              ) : (
                <span className="text-sm text-gray-400 dark:text-gray-500">
                  Cerrado
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
