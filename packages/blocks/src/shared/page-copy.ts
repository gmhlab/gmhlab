/**
 * Copy contracts shared by the page blocks. The blocks render structure; any
 * sentence in an organisation's own voice — a hero subtitle, a "work with us"
 * appeal, a contact address — arrives through these types, so the published
 * package names no one.
 */

/** A link rendered as a button. `variant` defaults to the primary button. */
export type PageAction = {
  label: string;
  href: string;
  variant?: "default" | "secondary" | "outline";
};

/** A closing call to action: a heading, a short paragraph, and its buttons. */
export type PageCta = {
  heading: string;
  body?: string;
  actions?: PageAction[];
};
