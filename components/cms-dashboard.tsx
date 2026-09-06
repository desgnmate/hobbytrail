"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useId, useMemo, useRef, useState } from "react";
import {
  ArrowSquareOut,
  ArrowsClockwise,
  BookOpenText,
  CalendarDots,
  CardsThree,
  GearSix,
  Handshake,
  MagnifyingGlass,
  PencilSimple,
  Plus,
  Quotes,
  SignOut,
  Trash,
  X,
  type Icon,
} from "@phosphor-icons/react";
import type { CmsRecord, CmsResource } from "@/lib/cms/types";
import { cmsResources, resourceLabels } from "@/lib/cms/resources";

type CmsRecords = Record<CmsResource, CmsRecord[]>;
type FieldKind = "text" | "textarea" | "url" | "datetime-local" | "select" | "checkbox" | "number";
type FieldSpec = { name: string; label: string; kind?: FieldKind; help?: string; options?: string[] };

const fieldSpecs: Record<CmsResource, FieldSpec[]> = {
  events: [
    { name: "title", label: "Title" }, { name: "slug", label: "Slug", help: "Lowercase URL slug. Leave blank to generate it from the title." },
    { name: "start_date", label: "Start date and time", kind: "datetime-local" }, { name: "end_date", label: "End date and time", kind: "datetime-local" },
    { name: "game", label: "Game or hobby" }, { name: "category", label: "Category", kind: "select", options: ["Tournament", "League", "Trading", "Community", "Workshop", "Gaming", "Creator", "Collectibles"] },
    { name: "level", label: "Audience / skill level" }, { name: "venue_name", label: "Venue" }, { name: "address", label: "Street address" }, { name: "city", label: "City or suburb" },
    { name: "fee", label: "Entry fee" }, { name: "capacity", label: "Capacity" }, { name: "status", label: "Event status", kind: "select", options: ["Open", "Filling fast", "Sold out"] },
    { name: "ticket_status", label: "Ticket status", kind: "select", options: ["On sale", "Free registration", "Coming soon", "Sold out", "Sales closed"] },
    { name: "ticket_url", label: "Ticket or registration URL", kind: "url" }, { name: "image", label: "Image URL", kind: "url" },
    { name: "description", label: "Description", kind: "textarea" }, { name: "bring", label: "What to bring", kind: "textarea", help: "One item per line." },
    { name: "published", label: "Published", kind: "checkbox" }, { name: "featured", label: "Featured on the homepage", kind: "checkbox" },
  ],
  collections: [
    { name: "title", label: "Title" }, { name: "slug", label: "Slug" }, { name: "curator", label: "Curator" }, { name: "game", label: "Game or hobby" },
    { name: "era", label: "Era" }, { name: "format", label: "Format" }, { name: "image", label: "Image URL", kind: "url" }, { name: "summary", label: "Summary", kind: "textarea" },
    { name: "story", label: "Story paragraphs", kind: "textarea", help: "One paragraph per line." }, { name: "highlights", label: "Highlights", kind: "textarea", help: "One highlight per line." },
    { name: "published", label: "Published", kind: "checkbox" }, { name: "featured", label: "Featured on the homepage", kind: "checkbox" },
  ],
  guides: [
    { name: "title", label: "Title" }, { name: "slug", label: "Slug" }, { name: "category", label: "Category", kind: "select", options: ["Collecting", "Play", "Care", "Gaming", "Creators", "Events"] },
    { name: "read_time", label: "Reading time" }, { name: "image", label: "Image URL", kind: "url" }, { name: "summary", label: "Summary", kind: "textarea" },
    { name: "intro", label: "Introduction", kind: "textarea" }, { name: "sections", label: "Guide sections", kind: "textarea", help: "One section per line: Heading | Body" },
    { name: "published_at", label: "Published date", kind: "datetime-local" }, { name: "published", label: "Published", kind: "checkbox" }, { name: "featured", label: "Featured on the homepage", kind: "checkbox" },
  ],
  sponsors: [
    { name: "name", label: "Name" }, { name: "tier", label: "Tier", kind: "select", options: ["Presenting", "Major", "Community"] }, { name: "logo", label: "Logo URL", kind: "url" },
    { name: "url", label: "Website URL", kind: "url" }, { name: "description", label: "Description", kind: "textarea" }, { name: "display_order", label: "Display order", kind: "number" },
    { name: "active", label: "Active", kind: "checkbox" }, { name: "published", label: "Published", kind: "checkbox" },
  ],
  testimonials: [
    { name: "quote", label: "Quote", kind: "textarea" }, { name: "name", label: "Name" }, { name: "role", label: "Role" }, { name: "organization", label: "Organization" },
    { name: "audience", label: "Audience", kind: "select", options: ["Attendee", "Vendor", "Partner"] }, { name: "approved", label: "Publication permission confirmed", kind: "checkbox" },
    { name: "featured", label: "Featured on the homepage", kind: "checkbox" }, { name: "published", label: "Published", kind: "checkbox" },
  ],
  settings: [
    { name: "title", label: "Public brand name" }, { name: "description", label: "Site description", kind: "textarea" }, { name: "ticket_cta_label", label: "Ticket CTA label" },
    { name: "contact_email", label: "Public contact email" }, { name: "social_links", label: "Social links JSON", kind: "textarea", help: 'Example: { "instagram": "https://…", "youtube": "https://…" }' },
  ],
};

const resourceIcons: Record<CmsResource, Icon> = {
  events: CalendarDots,
  collections: CardsThree,
  guides: BookOpenText,
  sponsors: Handshake,
  testimonials: Quotes,
  settings: GearSix,
};

const resourceDescriptions: Record<CmsResource, string> = {
  events: "Schedule, venue details, ticket links, and event visibility.",
  collections: "Collector stories, binder highlights, and featured showcases.",
  guides: "Practical articles that help visitors enjoy the hobby.",
  sponsors: "Partner profiles, logos, links, and display order.",
  testimonials: "Approved attendee, vendor, and partner stories.",
  settings: "Global brand copy, public contact details, and social links.",
};

function singularLabel(resource: CmsResource) {
  return resource === "settings" ? "settings" : resourceLabels[resource].replace(/s$/, "").toLowerCase();
}

function blankRecord(resource: CmsResource): CmsRecord {
  const now = new Date();
  const soon = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  const record: CmsRecord = { id: "" };
  for (const field of fieldSpecs[resource]) {
    record[field.name] = field.kind === "checkbox" ? false : field.kind === "number" ? 10 : field.name === "published_at" ? now.toISOString() : "";
  }
  if (resource === "events") { record.start_date = now.toISOString(); record.end_date = soon.toISOString(); record.status = "Open"; record.ticket_status = "Coming soon"; record.bring = []; }
  if (resource === "guides") record.sections = [];
  if (resource === "settings") { record.id = "default"; record.title = "Hobby Trail"; record.ticket_cta_label = "Buy tickets"; record.social_links = {}; }
  return record;
}

function formatInputValue(value: unknown, field: FieldSpec) {
  if (field.kind === "checkbox") return Boolean(value);
  if (field.kind === "datetime-local" && value) return new Date(String(value)).toISOString().slice(0, 16);
  if (field.name === "sections" && Array.isArray(value)) return value.map((section) => `${String(section.heading ?? "")} | ${String(section.body ?? "")}`).join("\n");
  if (Array.isArray(value)) return value.join("\n");
  if (field.name === "social_links" && value && typeof value === "object") return JSON.stringify(value, null, 2);
  return value == null ? "" : String(value);
}

function recordTitle(record: CmsRecord, resource: CmsResource) {
  if (resource === "testimonials") return String(record.name ?? "Untitled testimonial");
  if (resource === "sponsors") return String(record.name ?? "Untitled sponsor");
  if (resource === "settings") return "Public site settings";
  return String(record.title ?? "Untitled record");
}

function recordSubtitle(record: CmsRecord, resource: CmsResource) {
  if (resource === "events") return `${String(record.city ?? "No city")} · ${String(record.status ?? "Draft")}`;
  if (resource === "collections") return `${String(record.curator ?? "No curator")} · ${String(record.game ?? "No game")}`;
  if (resource === "guides") return `${String(record.category ?? "No category")} · ${String(record.read_time ?? "No reading time")}`;
  if (resource === "sponsors") return `${String(record.tier ?? "No tier")} · ${record.active ? "Active" : "Inactive"}`;
  if (resource === "testimonials") return `${String(record.audience ?? "No audience")} · ${record.approved ? "Approved" : "Needs approval"}`;
  return "Single source of truth for global copy";
}

function CmsEditor({ resource, record, onSaved, onCancel }: { resource: CmsResource; record: CmsRecord; onSaved: (record: CmsRecord) => void; onCancel: () => void }) {
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const dialogRef = useRef<HTMLFormElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const isNew = !record.id;
  const editorHeading = isNew ? `Create ${singularLabel(resource)}` : recordTitle(record, resource);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousActive = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusableSelector = "button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex=\"-1\"])";
    const focusFirstField = () => dialog?.querySelector<HTMLElement>("input:not([type=checkbox]), textarea, select, button")?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCancel();
        return;
      }
      if (event.key !== "Tab" || !dialog) return;
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    focusFirstField();
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previousActive?.focus();
    };
  }, [onCancel]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const payload: Record<string, unknown> = {};

    for (const field of fieldSpecs[resource]) {
      if (field.kind === "checkbox") payload[field.name] = form.get(field.name) === "on";
      else if (field.name === "bring" || field.name === "story" || field.name === "highlights") payload[field.name] = String(form.get(field.name) ?? "").split("\n").map((item) => item.trim()).filter(Boolean);
      else if (field.name === "sections") {
        payload.sections = String(form.get(field.name) ?? "").split("\n").map((line) => { const [heading, ...body] = line.split("|"); return { heading: heading?.trim() ?? "", body: body.join("|").trim() }; }).filter((section) => section.heading && section.body);
      } else if (field.name === "social_links") {
        try { payload.social_links = JSON.parse(String(form.get(field.name) ?? "{}")); } catch { setMessage("Social links must be valid JSON."); setPending(false); return; }
      } else if (field.kind === "datetime-local") {
        const value = String(form.get(field.name) ?? "");
        payload[field.name] = value ? new Date(value).toISOString() : "";
      } else if (field.kind === "number") payload[field.name] = Number(form.get(field.name) ?? 0);
      else payload[field.name] = String(form.get(field.name) ?? "");
    }

    try {
      const response = await fetch(`/api/cms/${resource}${isNew ? "" : `/${record.id}`}`, { method: isNew ? "POST" : "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json() as { record?: CmsRecord; error?: string };
      if (!response.ok || !result.record) { setMessage(result.error ?? "Unable to save this record."); return; }
      onSaved(result.record);
    } catch { setMessage("The CMS could not be reached. Try again in a moment."); }
    finally { setPending(false); }
  }

  return (
    <div className="cms-modal" data-lenis-prevent onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel(); }}>
      <form
        ref={dialogRef}
        className="cms-editor cms-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        aria-busy={pending}
        data-lenis-prevent
        onMouseDown={(event) => event.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className="cms-editor__header">
          <div>
            <p className="detail-kicker">{isNew ? "New record" : "Edit record"}</p>
            <h2 id={titleId}>{editorHeading}</h2>
            <p className="cms-editor__description" id={descriptionId}>Add the details below. Save as a draft while you review, then publish when it is ready.</p>
          </div>
          <button className="cms-icon-button" type="button" onClick={onCancel} aria-label="Close editor"><X size={20} weight="bold" /></button>
        </div>
        <div className="cms-modal__body" data-lenis-prevent>
          <div className="cms-editor__fields">
            {fieldSpecs[resource].map((field) => {
              const value = formatInputValue(record[field.name], field);
              if (field.kind === "checkbox") return <label className="cms-field cms-field--check" key={field.name}><input name={field.name} type="checkbox" defaultChecked={Boolean(value)} /><span>{field.label}</span></label>;
              if (field.kind === "select") return <label className="cms-field" key={field.name}><span>{field.label}</span><select name={field.name} defaultValue={String(value)}>{field.options?.map((option) => <option key={option} value={option}>{option}</option>)}</select>{field.help && <small>{field.help}</small>}</label>;
              const multiline = field.kind === "textarea";
              return <label className={`cms-field${multiline ? " cms-field--wide" : ""}`} key={field.name}><span>{field.label}</span>{multiline ? <textarea name={field.name} defaultValue={String(value)} rows={field.name === "sections" ? 7 : 4} /> : <input name={field.name} type={field.kind ?? "text"} defaultValue={String(value)} />}{field.help && <small>{field.help}</small>}</label>;
            })}
          </div>
          {message && <p className="cms-form-message" role="alert">{message}</p>}
        </div>
        <div className="cms-editor__actions">
          <button className="button button--yellow" type="submit" disabled={pending}>{pending ? "Saving…" : "Save changes"}</button>
          <button className="cms-quiet-button" type="button" onClick={onCancel} disabled={pending}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export function CmsDashboard({ initialRecords, userEmail }: { initialRecords: CmsRecords; userEmail: string }) {
  const [records, setRecords] = useState(initialRecords);
  const [resource, setResource] = useState<CmsResource>("events");
  const [editing, setEditing] = useState<CmsRecord | null>(null);
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const activeRecords = records[resource];
  const ActiveIcon = resourceIcons[resource];
  const filteredRecords = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return activeRecords.filter((record) => {
      const matchesQuery = !normalizedQuery || `${recordTitle(record, resource)} ${recordSubtitle(record, resource)}`.toLowerCase().includes(normalizedQuery);
      const matchesStatus = status === "all" || (status === "published" ? Boolean(record.published) : !record.published);
      return matchesQuery && (resource === "settings" || matchesStatus);
    });
  }, [activeRecords, query, resource, status]);

  async function refresh(currentResource = resource) {
    setMessage("Refreshing content…");
    try {
      const response = await fetch(`/api/cms/${currentResource}`, { cache: "no-store" });
      const result = await response.json() as { records?: CmsRecord[]; error?: string };
      if (!response.ok || !result.records) { setMessage(result.error ?? "Unable to refresh records."); return; }
      setRecords((current) => ({ ...current, [currentResource]: result.records }));
      setMessage("Content is up to date.");
    } catch {
      setMessage("The CMS could not be reached. Try again in a moment.");
    }
  }

  async function logout() {
    await fetch("/api/cms/auth/logout", { method: "POST" });
    window.location.reload();
  }

  async function remove(record: CmsRecord) {
    if (!window.confirm(`Delete ${recordTitle(record, resource)}? This cannot be undone.`)) return;
    const response = await fetch(`/api/cms/${resource}/${record.id}`, { method: "DELETE" });
    const result = await response.json() as { error?: string };
    if (!response.ok) { setMessage(result.error ?? "Unable to delete this record."); return; }
    setRecords((current) => ({ ...current, [resource]: current[resource].filter((item) => item.id !== record.id) }));
    setEditing(null);
    setMessage("Record deleted.");
  }

  function handleSaved(saved: CmsRecord) {
    setRecords((current) => ({ ...current, [resource]: current[resource].some((item) => item.id === saved.id) ? current[resource].map((item) => item.id === saved.id ? saved : item) : [saved, ...current[resource]] }));
    setEditing(null);
    setMessage("Changes saved. Published pages will refresh on their next request.");
  }

  function selectResource(nextResource: CmsResource) {
    setResource(nextResource);
    setEditing(null);
    setMessage("");
    setQuery("");
    setStatus("all");
  }

  function createRecord() {
    setEditing(blankRecord(resource));
    setMessage("");
  }

  return (
    <main className="cms-shell" id="main-content">
      <header className="cms-appbar">
        <Link className="cms-brand" href="/" aria-label="Hobby Trail website">
          <Image src="/assets/brand/logo-wordmark.png" alt="Hobby Trail" width={973} height={408} />
          <span><strong>Content manager</strong><small>Website administration</small></span>
        </Link>
        <div className="cms-account"><span>{userEmail}</span><button className="cms-icon-button" type="button" onClick={logout} aria-label="Sign out" title="Sign out"><SignOut size={19} weight="bold" /></button></div>
      </header>
      <div className="cms-app-layout">
        <aside className="cms-sidebar">
          <p className="cms-sidebar__label">Content</p>
          <nav className="cms-tabs" aria-label="CMS content types">
            {cmsResources.map((item) => {
              const ResourceIcon = resourceIcons[item];
              return <button className={resource === item ? "is-active" : ""} key={item} type="button" onClick={() => selectResource(item)}><ResourceIcon size={20} weight={resource === item ? "fill" : "bold"} /><span>{resourceLabels[item]}</span></button>;
            })}
          </nav>
          <Link className="cms-view-site" href="/" target="_blank"><ArrowSquareOut size={18} weight="bold" /> View live site</Link>
        </aside>
        <section className="cms-main">
          <header className="cms-page-header">
            <div className="cms-page-header__title"><span><ActiveIcon size={24} weight="fill" /></span><div><p className="detail-kicker">Hobby Trail CMS</p><h1>{resourceLabels[resource]}</h1><p>{resourceDescriptions[resource]}</p></div></div>
            {resource !== "settings" && <button className="button button--yellow cms-create-button" type="button" onClick={createRecord}><Plus size={18} weight="bold" /> New {singularLabel(resource)}</button>}
          </header>
          <div className="cms-toolbar">
            <label className="cms-search"><MagnifyingGlass size={19} weight="bold" /><span className="sr-only">Search {resourceLabels[resource]}</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${resourceLabels[resource].toLowerCase()}…`} /></label>
            {resource !== "settings" && <label className="cms-filter"><span className="sr-only">Filter by publishing status</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">All statuses</option><option value="published">Published</option><option value="draft">Drafts</option></select></label>}
            <button className="cms-quiet-button" type="button" onClick={() => refresh()} aria-label={`Refresh ${resourceLabels[resource]}`}><ArrowsClockwise size={17} weight="bold" /> Refresh</button>
          </div>
          {message && <p className="cms-inline-message" role="status" aria-live="polite">{message}</p>}
          <div className="cms-content-panel">
            {filteredRecords.length ? <div className="cms-record-list">{filteredRecords.map((record) => <article className={`cms-record ${record.published || resource === "settings" ? "is-published" : ""}`} key={record.id}><div className="cms-record__copy"><h2>{recordTitle(record, resource)}</h2><p>{recordSubtitle(record, resource)}</p></div><div className="cms-record__actions"><span>{resource === "settings" ? "Live" : record.published ? "Published" : "Draft"}</span><button className="cms-icon-button" type="button" onClick={() => setEditing(record)} aria-label={`Edit ${recordTitle(record, resource)}`} title="Edit"><PencilSimple size={18} weight="bold" /></button>{resource !== "settings" && <button className="cms-icon-button cms-icon-button--danger" type="button" onClick={() => remove(record)} aria-label={`Delete ${recordTitle(record, resource)}`} title="Delete"><Trash size={18} weight="bold" /></button>}</div></article>)}</div> : <div className="cms-empty"><span><ActiveIcon size={28} weight="duotone" /></span><strong>{activeRecords.length ? "No matching records" : `No ${resourceLabels[resource].toLowerCase()} yet`}</strong><p>{activeRecords.length ? "Try a different search or publishing status." : "Create the first record and keep it as a draft until it is ready."}</p>{!activeRecords.length && resource !== "settings" && <button className="button button--yellow" type="button" onClick={createRecord}><Plus size={18} weight="bold" /> Create {singularLabel(resource)}</button>}</div>}
          </div>
        </section>
      </div>
      {editing && <CmsEditor resource={resource} record={editing} onSaved={handleSaved} onCancel={() => setEditing(null)} />}
    </main>
  );
}
