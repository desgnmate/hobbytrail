import { createClient } from "next-sanity";
import { isSanityConfigured, sanityApiVersion, sanityDataset, sanityProjectId } from "@/lib/cms/config";

export const sanityClient = isSanityConfigured
  ? createClient({
      projectId: sanityProjectId,
      dataset: sanityDataset,
      apiVersion: sanityApiVersion,
      useCdn: true,
      perspective: "published",
    })
  : null;
