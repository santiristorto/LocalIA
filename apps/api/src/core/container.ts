import { createAuthController } from "../modules/auth/auth.controller.js";
import { createAuthRouter } from "../modules/auth/auth.routes.js";
import { createMenuController } from "../modules/menu/menu.controller.js";
import { MenuCategoriesRepository } from "../modules/menu/menu-categories.repository.js";
import { MenuItemsRepository } from "../modules/menu/menu-items.repository.js";
import { createMenuRouter } from "../modules/menu/menu.routes.js";
import { MenuService } from "../modules/menu/menu.service.js";
import { createTenantsController } from "../modules/tenants/tenants.controller.js";
import { createTenantsRouter } from "../modules/tenants/tenants.routes.js";
import { TenantsRepository } from "../modules/tenants/tenants.repository.js";
import { TenantsService } from "../modules/tenants/tenants.service.js";
import { AiConversationsRepository } from "../modules/whatsapp/ai-conversations.repository.js";
import { AiMessagesRepository } from "../modules/whatsapp/ai-messages.repository.js";
import { CustomersRepository } from "../modules/whatsapp/customers.repository.js";
import { TenantWhatsappConfigRepository } from "../modules/whatsapp/tenant-whatsapp-config.repository.js";
import { createWhatsappController } from "../modules/whatsapp/whatsapp.controller.js";
import { createWhatsappRouter } from "../modules/whatsapp/whatsapp.routes.js";
import { WhatsappService } from "../modules/whatsapp/whatsapp.service.js";
import { createRequireTenantRole } from "./middlewares/require-tenant-role.js";

/**
 * Composition root — Backend Architecture Specification §5.
 *
 * Ensamblado explícito de dependencias, sin framework de DI: se instancian
 * los repositorios, después los servicios (recibiendo sus repositorios por
 * constructor), después los controladores (recibiendo sus servicios), y
 * finalmente los routers (recibiendo sus controladores). `app.ts` monta los
 * routers ya armados, sin conocer cómo se construyeron.
 */
const tenantsRepository = new TenantsRepository();
const tenantsService = new TenantsService(tenantsRepository);
const tenantsController = createTenantsController(tenantsService);
const tenantsRouter = createTenantsRouter(tenantsController);

const authController = createAuthController(tenantsService);
const authRouter = createAuthRouter(authController);

const menuCategoriesRepository = new MenuCategoriesRepository();
const menuItemsRepository = new MenuItemsRepository();
const menuService = new MenuService(
  menuCategoriesRepository,
  menuItemsRepository,
);
const menuController = createMenuController(menuService);
const requireTenantRole = createRequireTenantRole(tenantsService);
const menuRouter = createMenuRouter(menuController, requireTenantRole);

const customersRepository = new CustomersRepository();
const aiConversationsRepository = new AiConversationsRepository();
const aiMessagesRepository = new AiMessagesRepository();
const tenantWhatsappConfigRepository = new TenantWhatsappConfigRepository();
const whatsappService = new WhatsappService(
  customersRepository,
  aiConversationsRepository,
  aiMessagesRepository,
  tenantWhatsappConfigRepository,
);
const whatsappController = createWhatsappController(whatsappService);
const whatsappRouter = createWhatsappRouter(
  whatsappController,
  requireTenantRole,
);

export const container = {
  tenantsService,
  tenantsRouter,
  authRouter,
  menuRouter,
  whatsappRouter,
};
