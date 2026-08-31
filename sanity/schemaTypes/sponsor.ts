import { defineField, defineType } from "sanity";

export const sponsor = defineType({
  name: "sponsor",
  title: "Sponsor",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "tier", type: "string", options: { list: ["Presenting", "Major", "Community"], layout: "radio" }, validation: (rule) => rule.required() }),
    defineField({ name: "logo", type: "image", description: "Use an approved transparent PNG or SVG-equivalent asset.", validation: (rule) => rule.required() }),
    defineField({ name: "url", title: "Sponsor website", type: "url" }),
    defineField({ name: "description", type: "text", rows: 3 }),
    defineField({ name: "active", type: "boolean", initialValue: true }),
    defineField({ name: "order", type: "number", initialValue: 10 }),
  ],
  preview: { select: { title: "name", subtitle: "tier", media: "logo" } },
});
