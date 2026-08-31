import { defineArrayMember, defineField, defineType } from "sanity";

export const page = defineType({
  name: "page",
  title: "Page content",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (rule) => rule.required() }),
    defineField({ name: "description", title: "SEO description", type: "text", rows: 3 }),
    defineField({ name: "heroTitle", type: "string" }),
    defineField({ name: "heroText", type: "text", rows: 3 }),
    defineField({ name: "body", type: "array", of: [defineArrayMember({ type: "block" }), defineArrayMember({ type: "image", options: { hotspot: true } })] }),
  ],
});
