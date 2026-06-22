/**
 * Navigation primitives shared across the LexiPath shells. Composed from shadcn
 * primitives (`Tabs`, `Link`) + the LexiPath design tokens. These never fetch
 * data — pages pass nav items, the active id, and the user summary down.
 */

export {
  type NavItem,
  type NavSection,
  type UserSummary,
  type ShellAction,
  getInitials,
} from "./types";

export { Breadcrumb, type BreadcrumbItem, type BreadcrumbProps } from "./breadcrumb";
export { NavTabs, type NavTabItem, type NavTabsProps } from "./nav-tabs";
export { AdminSidebar, type AdminSidebarProps } from "./admin-sidebar";
