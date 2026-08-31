import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "@/sanity/schemaTypes";
import { sanityDataset, sanityProjectId } from "@/lib/cms/config";

export default defineConfig({
  name: "default",
  title: "Hobby Trail Content Studio",
  projectId: sanityProjectId || "notconfigured",
  dataset: sanityDataset,
  basePath: "/studio",
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
});
