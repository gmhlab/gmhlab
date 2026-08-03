import clsx from "clsx";
import { ReactNode } from "react";
import { AnchorOrButton, type AnchorOrButtonProps } from "@gmhlab/ui";
import "./sidebars.css";

export type SidebarProps = {
  /** Brand / logo slot pinned to the top of the rail. */
  brand?: ReactNode;
  /** Slot pinned to the bottom of the rail (user menu, legal links, …). */
  footer?: ReactNode;
  /** Nav content — typically SidebarSection / SidebarItem. */
  children?: ReactNode;
  /** Accessible name for the nav landmark. */
  label?: string;
  className?: string;
};

/**
 * A vertical app-navigation rail: brand on top, scrollable nav in the middle,
 * footer pinned to the bottom. Sticky and full-height when its parent lays it
 * out as a row (see `template-app-shell` in blocks), collapsing to a static
 * full-width bar on small screens.
 */
export function Sidebar({
  brand,
  footer,
  children,
  label = "Primary",
  className,
}: SidebarProps) {
  return (
    <aside className={clsx("sidebar", className)}>
      {brand && <div className="sidebar-brand">{brand}</div>}
      <nav className="sidebar-nav" aria-label={label}>
        {children}
      </nav>
      {footer && <div className="sidebar-footer">{footer}</div>}
    </aside>
  );
}

export type SidebarSectionProps = {
  /** Optional uppercase micro-label above the section's items. */
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
};

/** Groups SidebarItems under an optional micro-label. */
export function SidebarSection({
  title,
  children,
  className,
}: SidebarSectionProps) {
  return (
    <div className={clsx("sidebar-section", className)}>
      {title && <p className="sidebar-section-title">{title}</p>}
      <div className="sidebar-section-items">{children}</div>
    </div>
  );
}

export type SidebarItemProps = AnchorOrButtonProps & {
  /** Leading icon slot. */
  icon?: ReactNode;
  /** Marks the item as the current page. */
  selected?: boolean;
  className?: string;
};

/**
 * A single nav entry. Renders a link when `href` is given, a button
 * otherwise (same AnchorOrButton contract as the primitives).
 */
export function SidebarItem({
  icon,
  selected = false,
  className,
  children,
  ...props
}: SidebarItemProps) {
  return (
    <AnchorOrButton
      aria-current={selected && "href" in props ? "page" : undefined}
      {...props}
      className={clsx(
        "sidebar-item",
        selected && "sidebar-item-selected",
        className,
      )}
    >
      {icon && (
        <span className="sidebar-item-icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="sidebar-item-label">{children}</span>
    </AnchorOrButton>
  );
}
