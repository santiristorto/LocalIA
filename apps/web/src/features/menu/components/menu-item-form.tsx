import { useState } from "react";
import type { FormEvent } from "react";

import {
  Button,
  FormField,
  Input,
  Select,
  Switch,
  Textarea,
} from "@localia/ui";

import type {
  CreateMenuItemInput,
  MenuCategory,
  MenuItem,
} from "../types/menu.ts";
import { MenuItemImageUploadField } from "./menu-item-image-upload-field.tsx";

export interface MenuItemFormProps {
  item?: MenuItem;
  categories: MenuCategory[];
  defaultCategoryId?: string;
  isSubmitting: boolean;
  errorMessage?: string;
  onSubmit: (input: CreateMenuItemInput) => void;
  onCancel: () => void;
}

/** Formulario de ítem (crear/editar) — mismo componente para los dos casos. */
export function MenuItemForm({
  item,
  categories,
  defaultCategoryId,
  isSubmitting,
  errorMessage,
  onSubmit,
  onCancel,
}: MenuItemFormProps) {
  const [categoryId, setCategoryId] = useState(
    item?.categoryId ?? defaultCategoryId ?? categories[0]?.id ?? "",
  );
  const [name, setName] = useState(item?.name ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [price, setPrice] = useState(item ? String(item.price) : "");
  const [imageUrl, setImageUrl] = useState(item?.imageUrl ?? "");
  const [isAvailable, setIsAvailable] = useState(item?.isAvailable ?? true);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit({
      categoryId,
      name,
      description,
      price: Number(price),
      imageUrl,
      isAvailable,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <FormField label="Categoría" id="item-category">
        <Select
          id="item-category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField label="Nombre" id="item-name">
        <Input
          id="item-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej. Milanesa napolitana"
          required
        />
      </FormField>

      <FormField label="Descripción" id="item-description">
        <Textarea
          id="item-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          placeholder="Opcional"
        />
      </FormField>

      <FormField label="Precio" id="item-price">
        <Input
          id="item-price"
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="0.00"
          required
        />
      </FormField>

      <MenuItemImageUploadField value={imageUrl} onChange={setImageUrl} />

      <div className="flex items-center gap-3">
        <Switch
          checked={isAvailable}
          onChange={setIsAvailable}
          label="Disponible"
        />
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {isAvailable ? "Disponible" : "No disponible"}
        </span>
      </div>

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
