import { defineField, defineType } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({ name: "quote", type: "text", rows: 5, validation: (rule) => rule.required().max(420) }),
    defineField({ name: "name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "role", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "organization", type: "string" }),
    defineField({ name: "audience", type: "string", options: { list: ["Attendee", "Vendor", "Partner"], layout: "radio" }, validation: (rule) => rule.required() }),
    defineField({ name: "approved", title: "Publication permission confirmed", type: "boolean", initialValue: false, description: "Only enable after written client approval or a signed release." }),
    defineField({ name: "featured", type: "boolean", initialValue: false }),
  ],
  preview: { select: { title: "name", subtitle: "role" } },
});
