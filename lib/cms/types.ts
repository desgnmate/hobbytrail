export type CmsResource = "events" | "collections" | "guides" | "sponsors" | "testimonials" | "settings";

export type CmsRecord = Record<string, unknown> & { id: string };
