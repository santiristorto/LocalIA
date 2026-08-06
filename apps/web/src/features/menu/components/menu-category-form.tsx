import { useState } from "react";
import type { FormEvent } from "react";

import { Button, FormField, Input, Textarea } from "@localia/ui";

import type { CreateMenuCategoryInput, MenuCategory } from "../types/menu.ts";

export interface MenuCategoryFormProps {
  category?: MenuCategory;
  isSubmitting: boolean;
  errorMessage?: string;
  onSubmit: (input: CreateMenuCategoryInput) => void;
  onCancel: () => void;
}

/**
 * Formulario de categoría (crear/editar) — mismo componente para los dos
 * casos, mismo criterio que el resto de los formularios de la app
 * (`category` presente = edición).
 */
export function MenuCategoryForm({
  category,
  isSubmitting,
  errorMessage,
  onSubmit,
  onCancel,
}: MenuCategoryFormProps) {
  const [name, setName] = useState(category?.name ?? "");
  const [description, setDescription] = useState(category?.description ?? "");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit({ name, description });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <FormField label="Nombre" id="category-name">
        <Input
          id="category-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej. Entradas"
          required
        />
      </FormField>

      <FormField label="Descripción" id="category-description">
        <Textarea
          id="category-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          placeholder="Opcional"
        />
      </FormField>

      {errorMessage && (
        <p role="alert" aria-live="polite" className="text-sm text-danger">
          {errorMessage}
        </p>
      )}

      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          Guardar
        </Button>
      </div>
    </form>
  );
}
