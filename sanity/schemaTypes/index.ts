import { collection } from "@/sanity/schemaTypes/collection";
import { event } from "@/sanity/schemaTypes/event";
import { guide } from "@/sanity/schemaTypes/guide";
import { page } from "@/sanity/schemaTypes/page";
import { siteSettings } from "@/sanity/schemaTypes/siteSettings";
import { sponsor } from "@/sanity/schemaTypes/sponsor";
import { testimonial } from "@/sanity/schemaTypes/testimonial";
import { venue } from "@/sanity/schemaTypes/venue";

export const schemaTypes = [siteSettings, event, venue, sponsor, testimonial, collection, guide, page];
