import { defineArrayMember, defineField, defineType } from "sanity";

const ticketStatuses = ["On sale", "Free registration", "Coming soon", "Sold out", "Sales closed"];

export const event = defineType({
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title", maxLength: 96 }, validation: (rule) => rule.required() }),
    defineField({ name: "startDate", title: "Start date and time", type: "datetime", validation: (rule) => rule.required() }),
    defineField({ name: "endDate", title: "End date and time", type: "datetime", validation: (rule) => rule.required() }),
    defineField({ name: "game", title: "Game or hobby", type: "string", description: "Examples: Pokémon TCG, collectibles, retro gaming, creator workshop", validation: (rule) => rule.required() }),
    defineField({ name: "category", type: "string", options: { list: ["Tournament", "League", "Trading", "Community", "Workshop", "Gaming", "Creator", "Collectibles"] }, validation: (rule) => rule.required() }),
    defineField({ name: "level", title: "Audience / skill level", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "venue", type: "reference", to: [{ type: "venue" }] }),
    defineField({ name: "venueName", title: "Venue name override", type: "string", hidden: ({ document }) => Boolean(document?.venue) }),
    defineField({ name: "address", title: "Address override", type: "string", hidden: ({ document }) => Boolean(document?.venue) }),
    defineField({ name: "city", title: "City override", type: "string", description: "Use Melbourne or a Melbourne suburb.", hidden: ({ document }) => Boolean(document?.venue) }),
    defineField({ name: "fee", type: "string", description: "Use Free or a complete price such as AUD 15", validation: (rule) => rule.required() }),
    defineField({ name: "capacity", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "status", type: "string", options: { list: ["Open", "Filling fast", "Sold out"], layout: "radio" }, initialValue: "Open", validation: (rule) => rule.required() }),
    defineField({ name: "ticketStatus", type: "string", options: { list: ticketStatuses, layout: "radio" }, initialValue: "Coming soon", validation: (rule) => rule.required() }),
    defineField({
      name: "ticketUrl",
      title: "Verified ticket or registration URL",
      type: "url",
      validation: (rule) => rule.custom((value, context) => {
        const status = context.document?.ticketStatus;
        if ((status === "On sale" || status === "Free registration") && !value) return "A verified URL is required while tickets or registration are live.";
        return true;
      }),
    }),
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
    defineField({ name: "description", type: "text", rows: 4, validation: (rule) => rule.required().max(360) }),
    defineField({ name: "bring", title: "What to bring", type: "array", of: [defineArrayMember({ type: "string" })] }),
    defineField({ name: "featured", type: "boolean", initialValue: false }),
  ],
  preview: { select: { title: "title", subtitle: "startDate", media: "image" } },
});
