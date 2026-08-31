import { defineField, defineType } from "sanity";

export const venue = defineType({
  name: "venue",
  title: "Venue",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "address", type: "string", description: "Use a complete street address in Melbourne, Victoria, Australia.", validation: (rule) => rule.required() }),
    defineField({ name: "city", type: "string", description: "Melbourne suburb or local district.", validation: (rule) => rule.required() }),
    defineField({ name: "mapUrl", title: "Map URL", type: "url" }),
    defineField({ name: "accessibilityNotes", title: "Accessibility notes", type: "text", rows: 3 }),
  ],
  preview: { select: { title: "name", subtitle: "city" } },
});
