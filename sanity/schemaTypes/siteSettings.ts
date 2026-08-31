import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Public brand name", type: "string", initialValue: "Hobby Trail", validation: (rule) => rule.required() }),
    defineField({ name: "description", title: "Site description", type: "text", rows: 3 }),
    defineField({ name: "ticketCtaLabel", title: "Ticket CTA label", type: "string", initialValue: "Buy tickets" }),
    defineField({ name: "contactEmail", title: "Public contact email", type: "email" }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "object",
      fields: [
        defineField({ name: "instagram", type: "url" }),
        defineField({ name: "youtube", type: "url" }),
        defineField({ name: "discord", type: "url" }),
      ],
    }),
  ],
});
