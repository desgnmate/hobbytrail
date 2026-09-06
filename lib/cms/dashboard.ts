import "server-only";
import { cmsResources, getResourceDefinition } from "@/lib/cms/resources";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { CmsRecord, CmsResource } from "@/lib/cms/types";

export type CmsRecords = Record<CmsResource, CmsRecord[]>;

const emptyRecords = (): CmsRecords => ({ events: [], collections: [], guides: [], sponsors: [], testimonials: [], settings: [] });

export async function getCmsDashboardRecords(): Promise<CmsRecords> {
  if (!supabaseAdmin) return emptyRecords();
  const client = supabaseAdmin;

  const entries = await Promise.all(cmsResources.map(async (resource) => {
    const definition = getResourceDefinition(resource);
    let query = client.from(definition.table).select("*");
    if (resource === "settings") query = query.eq("id", "default");
    else if (resource === "sponsors") query = query.order("display_order", { ascending: true });
    else query = query.order("updated_at", { ascending: false });
    const { data } = await query.limit(resource === "settings" ? 1 : 100);
    return [resource, (data ?? []) as CmsRecord[]] as const;
  }));

  return entries.reduce((records, [resource, resourceRecords]) => {
    records[resource] = resourceRecords;
    return records;
  }, emptyRecords());
}
