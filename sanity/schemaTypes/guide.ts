import { defineArrayMember, defineField, defineType } from "sanity";

export const guide = defineType({
  name: "guide",
  title: "Guide",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (rule) => rule.required() }),
    defineField({ name: "category", type: "string", options: { list: ["Collecting", "Play", "Care", "Gaming", "Creators", "Events"] }, validation: (rule) => rule.required() }),
    defineField({ name: "readTime", title: "Read time", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "image", type: "image", options: { hotspot: true }, validation: (rule) => rule.required() }),
    defineField({ name: "summary", type: "text", rows: 3, validation: (rule) => rule.required().max(300) }),
    defineField({ name: "intro", type: "text", rows: 4, validation: (rule) => rule.required() }),
    defineField({
      name: "sections",
      type: "array",
      of: [defineArrayMember({ type: "object", fields: [defineField({ name: "heading", type: "string", validation: (rule) => rule.required() }), defineField({ name: "body", type: "text", rows: 6, validation: (rule) => rule.required() })] })],
    }),
    defineField({ name: "publishedAt", type: "datetime", initialValue: () => new Date().toISOString() }),
    defineField({ name: "featured", type: "boolean", initialValue: false }),
  ],
  preview: { select: { title: "title", subtitle: "category", media: "image" } },
});
