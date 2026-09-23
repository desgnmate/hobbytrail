import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, GearSix } from "@phosphor-icons/react/dist/ssr";
import { CmsDashboard } from "@/components/cms-dashboard";
import { CmsLogin } from "@/components/cms-login";
import { getCmsDashboardRecords } from "@/lib/cms/dashboard";
import { getCmsAuthStatus } from "@/lib/cms/supabase-auth";
import { isSupabaseAdminConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Hobby Trail CMS — Administration",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const auth = await getCmsAuthStatus();

  if (!auth.configured || !isSupabaseAdminConfigured) {
    return (
      <div className="cms-setup-page" id="main-content">
        <div className="cms-setup-card">
          <div className="cms-setup-icon">
            <GearSix size={28} weight="duotone" />
          </div>
          <span className="cms-setup-kicker">Configuration Required</span>
          <h1 className="cms-setup-title">Connect Supabase to activate CMS</h1>
          <p className="cms-setup-desc">
            To manage events, collections, guides, and site settings, configure your Supabase project credentials in your environment:
          </p>

          <div className="cms-setup-keys">
            <div className="cms-setup-key">
              <code>NEXT_PUBLIC_SUPABASE_URL</code>
              <span>Project API URL</span>
            </div>
            <div className="cms-setup-key">
              <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
              <span>Client publishable key</span>
            </div>
            <div className="cms-setup-key">
              <code>SUPABASE_SERVICE_ROLE_KEY</code>
              <span>Server admin key</span>
            </div>
          </div>

          <p className="cms-setup-note">
            Then run the SQL migration in <code>supabase/migrations/20260904000000_hobby_trail_cms.sql</code> to create the tables.
          </p>

          <div className="cms-setup-footer">
            <Link href="/" className="cms-btn cms-btn--secondary">
              <ArrowLeft size={16} weight="bold" />
              <span>Return to website</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!auth.user || !auth.isAdmin) {
    const setupMessage = auth.membershipError
      ? "The CMS tables are not initialized yet. Run the Supabase migration, then add your Auth user to cms_admins."
      : auth.user
        ? "Your account is not registered in the cms_admins table. Ask an existing admin for access."
        : undefined;
    return <CmsLogin setupMessage={setupMessage} />;
  }

  const records = await getCmsDashboardRecords();
  return <CmsDashboard initialRecords={records} userEmail={auth.user.email ?? "CMS Editor"} />;
}
