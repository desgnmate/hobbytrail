import { defineArrayMember, defineField, defineType } from "sanity";

export const collection = defineType({
  name: "collection",
  title: "Collection story",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (rule) => rule.required() }),
    defineField({ name: "curator", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "game", title: "Game or hobby", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "era", type: "string" }),
    defineField({ name: "format", type: "string" }),
    defineField({ name: "image", type: "image", options: { hotspot: true }, validation: (rule) => rule.required() }),
    defineField({ name: "summary", type: "text", rows: 3, validation: (rule) => rule.required().max(300) }),
    defineField({ name: "story", type: "array", of: [defineArrayMember({ type: "text", rows: 4 })] }),
    defineField({ name: "highlights", type: "array", of: [defineArrayMember({ type: "string" })] }),
    defineField({ name: "featured", type: "boolean", initialValue: false }),
  ],
  preview: { select: { title: "title", subtitle: "curator", media: "image" } },
});
