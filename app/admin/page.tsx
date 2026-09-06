import type { Metadata } from "next";
import { CmsDashboard } from "@/components/cms-dashboard";
import { CmsLogin } from "@/components/cms-login";
import { getCmsDashboardRecords } from "@/lib/cms/dashboard";
import { getCmsAuthStatus } from "@/lib/cms/supabase-auth";
import { isSupabaseAdminConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Content manager",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const auth = await getCmsAuthStatus();

  if (!auth.configured || !isSupabaseAdminConfigured) {
    return (
      <main className="studio-setup" id="main-content">
        <div>
          <p className="detail-kicker">CMS connection required</p>
          <h1>Connect the Hobby Trail CMS.</h1>
          <p>Add the Supabase URL, public key, and server key to the local and Vercel environments, then run the migration in <code>supabase/migrations</code>.</p>
        </div>
      </main>
    );
  }

  if (!auth.user || !auth.isAdmin) {
    const setupMessage = auth.membershipError
      ? "The CMS tables are not ready yet. Run the Supabase migration, then add your Auth user to cms_admins."
      : auth.user
        ? "Your Supabase account is not approved for the CMS yet."
        : undefined;
    return <CmsLogin setupMessage={setupMessage} />;
  }

  const records = await getCmsDashboardRecords();
  return <CmsDashboard initialRecords={records} userEmail={auth.user.email ?? "CMS editor"} />;
}
