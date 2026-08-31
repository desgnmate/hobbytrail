import { defineCliConfig } from "sanity/cli";
import { sanityDataset, sanityProjectId } from "@/lib/cms/config";

export default defineCliConfig({
  api: {
    projectId: sanityProjectId || "notconfigured",
    dataset: sanityDataset,
  },
});
