import { useState } from "react";
import { Plus, UtensilsCrossed } from "lucide-react";

import { Button, EmptyState, Loading, Modal, PageTitle } from "@localia/ui";

import { useTenant } from "../../../app/providers/use-tenant.ts";
import { MenuCategoryForm } from "../components/menu-category-form.tsx";
import { MenuCategorySection } from "../components/menu-category-section.tsx";
import { MenuItemForm } from "../components/menu-item-form.tsx";
import {
  useCreateMenuCategory,
  useDeleteMenuCategory,
  useMenuCategories,
  useUpdateMenuCategory,
} from "../hooks/use-menu-categories.ts";
import {
  useCreateMenuItem,
  useDeleteMenuItem,
  useMenuItems,
  useToggleMenuItemAvailability,
  useUpdateMenuItem,
} from "../hooks/use-menu-items.ts";
import type { MenuItem } from "../types/menu.ts";

type ModalState =
  | { type: "create-category" }
  | { type: "edit-category"; categoryId: string }
  | { type: "create-item"; categoryId: string }
  | { type: "edit-item"; item: MenuItem }
  | null;

/**
 * `MenuPage` — Sprint 4. El dueño arma su catálogo (categorías + ítems) y
 * lo edita, con toggle de disponibilidad por ítem. Solo `owner`/`manager`
 * ven las acciones de escritura — coincide con lo que ya exige el backend
 * (`requireTenantRole`, ver `menu.routes.ts`); ocultarlas acá es una mejora
 * de UX, no el mecanismo de autorización real.
 */
export function MenuPage() {
  const { role } = useTenant();
  const canWrite = role === "owner" || role === "manager";

  const { data: categories, isLoading: isLoadingCategories } =
    useMenuCategories();
  const { data: items, isLoading: isLoadingItems } = useMenuItems();

  const createCategory = useCreateMenuCategory();
  const updateCategory = useUpdateMenuCategory();
  const deleteCategory = useDeleteMenuCategory();
  const createItem = useCreateMenuItem();
  const updateItem = useUpdateMenuItem();
  const deleteItem = useDeleteMenuItem();
  const toggleItemAvailability = useToggleMenuItemAvailability();

  const [modal, setModal] = useState<ModalState>(null);

  const isLoading = isLoadingCategories || isLoadingItems;

  if (isLoading) {
    return <Loading label="Cargando el menú…" />;
  }

  const categoriesList = categories ?? [];
  const itemsList = items ?? [];

  function closeModal() {
    setModal(null);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageTitle
        title="Menú"
        subtitle="Armá tu catálogo de categorías e ítems, y controlá qué está disponible."
        action={
          canWrite &&
          categoriesList.length > 0 && (
            <Button
              variant="primary"
              onClick={() => setModal({ type: "create-category" })}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Nueva categoría
            </Button>
          )
        }
      />

      {categoriesList.length === 0 ? (
        <EmptyState
          icon={<UtensilsCrossed className="h-7 w-7" aria-hidden="true" />}
          title="Todavía no armaste tu menú"
          description="Creá tu primera categoría para empezar a cargar ítems."
          action={
            canWrite && (
              <Button
                variant="primary"
                onClick={() => setModal({ type: "create-category" })}
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Nueva categoría
              </Button>
            )
          }
        />
      ) : (
        <div className="flex flex-col gap-5">
          {categoriesList.map((category) => (
            <MenuCategorySection
              key={category.id}
              category={category}
              items={itemsList.filter(
                (item) => item.categoryId === category.id,
              )}
              canWrite={canWrite}
              onEditCategory={() =>
                setModal({ type: "edit-category", categoryId: category.id })
              }
              onDeleteCategory={() => {
                if (confirm(`¿Borrar la categoría "${category.name}"?`)) {
                  deleteCategory.mutate(category.id);
                }
              }}
              onAddItem={() =>
                setModal({ type: "create-item", categoryId: category.id })
              }
              onToggleItemAvailability={(itemId, isAvailable) =>
                void toggleItemAvailability(itemId, isAvailable)
              }
              onEditItem={(item) => setModal({ type: "edit-item", item })}
              onDeleteItem={(itemId) => {
                if (confirm("¿Borrar este ítem del menú?")) {
                  deleteItem.mutate(itemId);
                }
              }}
            />
          ))}
        </div>
      )}

      {modal?.type === "create-category" && (
        <Modal title="Nueva categoría" onClose={closeModal}>
          <MenuCategoryForm
            isSubmitting={createCategory.isPending}
            errorMessage={createCategory.error?.message}
            onSubmit={(input) =>
              createCategory.mutate(input, { onSuccess: closeModal })
            }
            onCancel={closeModal}
          />
        </Modal>
      )}

      {modal?.type === "edit-category" && (
        <Modal title="Editar categoría" onClose={closeModal}>
          <MenuCategoryForm
            category={categoriesList.find((c) => c.id === modal.categoryId)}
            isSubmitting={updateCategory.isPending}
            errorMessage={updateCategory.error?.message}
            onSubmit={(input) =>
              updateCategory.mutate(
                { categoryId: modal.categoryId, input },
                { onSuccess: closeModal },
              )
            }
            onCancel={closeModal}
          />
        </Modal>
      )}

      {modal?.type === "create-item" && (
        <Modal title="Nuevo ítem" onClose={closeModal}>
          <MenuItemForm
            categories={categoriesList}
            defaultCategoryId={modal.categoryId}
            isSubmitting={createItem.isPending}
            errorMessage={createItem.error?.message}
            onSubmit={(input) =>
              createItem.mutate(input, { onSuccess: closeModal })
            }
            onCancel={closeModal}
          />
        </Modal>
      )}

      {modal?.type === "edit-item" && (
        <Modal title="Editar ítem" onClose={closeModal}>
          <MenuItemForm
            item={modal.item}
            categories={categoriesList}
            isSubmitting={updateItem.isPending}
            errorMessage={updateItem.error?.message}
            onSubmit={(input) =>
              updateItem.mutate(
                { itemId: modal.item.id, input },
                { onSuccess: closeModal },
              )
            }
            onCancel={closeModal}
          />
        </Modal>
      )}
    </div>
  );
}
