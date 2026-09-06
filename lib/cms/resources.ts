import type { CmsResource } from "@/lib/cms/types";

export const cmsResources = ["events", "collections", "guides", "sponsors", "testimonials", "settings"] as const satisfies readonly CmsResource[];

type FieldType = "string" | "array" | "boolean" | "number" | "json";

type ResourceDefinition = {
  table: string;
  fields: Record<string, FieldType>;
  required: string[];
};

export const resourceDefinitions: Record<CmsResource, ResourceDefinition> = {
  events: {
    table: "events",
    fields: {
      slug: "string", title: "string", start_date: "string", end_date: "string", game: "string", category: "string",
      level: "string", venue_name: "string", address: "string", city: "string", fee: "string", capacity: "string",
      status: "string", ticket_status: "string", ticket_url: "string", image: "string", description: "string",
      bring: "array", published: "boolean", featured: "boolean",
    },
    required: ["title", "start_date", "end_date", "game", "category", "level", "venue_name", "address", "city", "fee", "capacity", "description"],
  },
  collections: {
    table: "collections",
    fields: {
      slug: "string", title: "string", curator: "string", game: "string", era: "string", format: "string", image: "string",
      summary: "string", story: "array", highlights: "array", published: "boolean", featured: "boolean",
    },
    required: ["title", "curator", "game", "summary"],
  },
  guides: {
    table: "guides",
    fields: {
      slug: "string", title: "string", category: "string", read_time: "string", image: "string", summary: "string", intro: "string",
      sections: "json", published_at: "string", published: "boolean", featured: "boolean",
    },
    required: ["title", "category", "read_time", "summary", "intro"],
  },
  sponsors: {
    table: "sponsors",
    fields: {
      name: "string", tier: "string", logo: "string", url: "string", description: "string", active: "boolean", display_order: "number", published: "boolean",
    },
    required: ["name", "tier"],
  },
  testimonials: {
    table: "testimonials",
    fields: {
      quote: "string", name: "string", role: "string", organization: "string", audience: "string", approved: "boolean", featured: "boolean", published: "boolean",
    },
    required: ["quote", "name", "role", "audience"],
  },
  settings: {
    table: "site_settings",
    fields: {
      id: "string", title: "string", description: "string", ticket_cta_label: "string", contact_email: "string", social_links: "json",
    },
    required: ["title", "ticket_cta_label"],
  },
};

export const resourceLabels: Record<CmsResource, string> = {
  events: "Events",
  collections: "Collections",
  guides: "Guides",
  sponsors: "Sponsors",
  testimonials: "Testimonials",
  settings: "Site settings",
};

export function isCmsResource(value: string): value is CmsResource {
  return cmsResources.includes(value as CmsResource);
}

export function getResourceDefinition(resource: CmsResource) {
  return resourceDefinitions[resource];
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

function cleanValue(value: unknown, type: FieldType) {
  if (type === "boolean") return value === true || value === "true";
  if (type === "number") {
    const number = typeof value === "number" ? value : Number(value);
    return Number.isFinite(number) ? number : 0;
  }
  if (type === "array") {
    if (!Array.isArray(value)) return [];
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (type === "json") {
    if (value && typeof value === "object") return value;
    if (typeof value === "string") {
      try { return JSON.parse(value); } catch { return {}; }
    }
    return {};
  }
  if (typeof value !== "string") return value == null ? null : String(value);
  const trimmed = value.trim();
  return trimmed || null;
}

export function sanitizePayload(resource: CmsResource, input: Record<string, unknown>, partial = false) {
  const definition = getResourceDefinition(resource);
  const payload: Record<string, unknown> = {};

  for (const [field, type] of Object.entries(definition.fields)) {
    if (partial && !(field in input)) continue;
    payload[field] = cleanValue(input[field], type);
  }

  if (resource !== "settings" && !payload.slug && typeof payload.title === "string") payload.slug = slugify(payload.title);
  if (resource === "settings") payload.id = typeof payload.id === "string" && payload.id ? payload.id : "default";
  if (resource === "guides" && !Array.isArray(payload.sections)) payload.sections = [];
  if (resource === "settings" && (!payload.social_links || typeof payload.social_links !== "object")) payload.social_links = {};

  const missing = partial
    ? definition.required.filter((field) => field in payload && (payload[field] === null || payload[field] === ""))
    : definition.required.filter((field) => payload[field] === null || payload[field] === "");
  if (missing.length) throw new Error(`Missing required fields: ${missing.join(", ")}`);
  if (!Object.keys(payload).length) throw new Error("No editable fields were supplied.");

  return payload;
}
