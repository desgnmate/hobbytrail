"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import {
  ArrowSquareOut,
  ArrowsClockwise,
  BookOpenText,
  CalendarDots,
  CardsThree,
  Check,
  DiscordLogo,
  Eye,
  FacebookLogo,
  GearSix,
  Handshake,
  InstagramLogo,
  Lock,
  LockOpen,
  MagnifyingGlass,
  PencilSimple,
  Plus,
  Quotes,
  SignOut,
  Trash,
  TwitterLogo,
  X,
  YoutubeLogo,
  type Icon,
} from "@phosphor-icons/react";
import type { CmsRecord, CmsResource } from "@/lib/cms/types";
import { resourceLabels, slugify } from "@/lib/cms/resources";

export type CmsRecords = Record<CmsResource, CmsRecord[]>;

type FieldKind = "text" | "textarea" | "url" | "datetime-local" | "select" | "checkbox" | "number";
type FieldSpec = {
  name: string;
  label: string;
  kind?: FieldKind;
  required?: boolean;
  help?: string;
  options?: string[];
  placeholder?: string;
};

const resourceIcons: Record<CmsResource, Icon> = {
  events: CalendarDots,
  collections: CardsThree,
  guides: BookOpenText,
  sponsors: Handshake,
  testimonials: Quotes,
  settings: GearSix,
};

const resourceSubtitles: Record<CmsResource, string> = {
  events: "Schedule, venues, ticket links, and visitor capacity",
  collections: "Collector showcases, binders, and featured stories",
  guides: "Articles, tutorials, and practical hobby advice",
  sponsors: "Commercial partners, logos, tiers, and linkouts",
  testimonials: "Quotes from collectors, vendors, and partners",
  settings: "Global site metadata, contact details, and social channels",
};

const navigationGroups = [
  {
    title: "Content",
    items: ["events", "collections", "guides"] as CmsResource[],
  },
  {
    title: "Directory",
    items: ["sponsors", "testimonials"] as CmsResource[],
  },
  {
    title: "System",
    items: ["settings"] as CmsResource[],
  },
];

const fieldSpecs: Record<Exclude<CmsResource, "settings">, FieldSpec[]> = {
  events: [
    { name: "title", label: "Event Title", required: true, placeholder: "e.g. Sunday Trade Day" },
    { name: "slug", label: "URL Slug", required: true, help: "Public URL slug. Auto-generated from title by default." },
    { name: "start_date", label: "Start Date & Time", kind: "datetime-local", required: true },
    { name: "end_date", label: "End Date & Time", kind: "datetime-local", required: true },
    { name: "game", label: "Game or Focus", required: true, placeholder: "e.g. Pokémon TCG, Magic: The Gathering" },
    {
      name: "category",
      label: "Category",
      kind: "select",
      required: true,
      options: ["Tournament", "League", "Trading", "Community", "Workshop", "Gaming", "Creator", "Collectibles"],
    },
    { name: "level", label: "Target Skill / Level", required: true, placeholder: "e.g. All levels welcome, Beginner friendly" },
    { name: "venue_name", label: "Venue Name", required: true, placeholder: "e.g. The Vault Games" },
    { name: "address", label: "Street Address", required: true, placeholder: "e.g. 120 Flinders Lane" },
    { name: "city", label: "City / Suburb", required: true, placeholder: "e.g. Melbourne" },
    { name: "fee", label: "Entry Fee", required: true, placeholder: "e.g. Free, $15 entry" },
    { name: "capacity", label: "Capacity", required: true, placeholder: "e.g. 48 players" },
    {
      name: "status",
      label: "Event Status",
      kind: "select",
      options: ["Open", "Filling fast", "Sold out"],
    },
    {
      name: "ticket_status",
      label: "Ticket Status",
      kind: "select",
      options: ["On sale", "Free registration", "Coming soon", "Sold out", "Sales closed"],
    },
    { name: "ticket_url", label: "Ticket / Registration URL", kind: "url", placeholder: "https://..." },
    { name: "image", label: "Banner Image URL", kind: "url", placeholder: "https://... or /stock/..." },
    { name: "description", label: "Event Description", kind: "textarea", required: true, placeholder: "Full details about the event format, schedule, prizes..." },
    { name: "bring", label: "What to Bring", kind: "textarea", help: "Enter one item per line (e.g. Standard 60-card deck, Playmat)." },
    { name: "published", label: "Publish live to website", kind: "checkbox" },
    { name: "featured", label: "Feature on homepage", kind: "checkbox" },
  ],
  collections: [
    { name: "title", label: "Collection Title", required: true, placeholder: "e.g. Moonlit Vault" },
    { name: "slug", label: "URL Slug", required: true, help: "Public URL slug. Auto-generated from title." },
    { name: "curator", label: "Collector Name / Curator", required: true, placeholder: "e.g. Mika Santos" },
    { name: "game", label: "Game or TCG", required: true, placeholder: "e.g. Fantasy TCG, One Piece" },
    { name: "era", label: "Era / Period", placeholder: "e.g. Modern Classic, Vintage 1999" },
    { name: "format", label: "Binder Format", placeholder: "e.g. 9-Pocket Zipfolio, Slab Case" },
    { name: "image", label: "Cover Image URL", kind: "url", placeholder: "https://... or /stock/..." },
    { name: "summary", label: "Short Summary", kind: "textarea", required: true, placeholder: "A 2-3 sentence overview displayed on collection cards." },
    { name: "story", label: "Collector Story", kind: "textarea", help: "Enter one paragraph per line. Tells how the collection started and evolved." },
    { name: "highlights", label: "Key Highlights", kind: "textarea", help: "Enter one highlight per line (e.g. 1st Edition Charizard PSA 9)." },
    { name: "published", label: "Publish live to website", kind: "checkbox" },
    { name: "featured", label: "Feature on homepage", kind: "checkbox" },
  ],
  guides: [
    { name: "title", label: "Guide Title", required: true, placeholder: "e.g. How to Grade Your First Card" },
    { name: "slug", label: "URL Slug", required: true, help: "Public URL slug. Auto-generated from title." },
    {
      name: "category",
      label: "Guide Category",
      kind: "select",
      required: true,
      options: ["Collecting", "Play", "Care", "Gaming", "Creators", "Events"],
    },
    { name: "read_time", label: "Estimated Reading Time", required: true, placeholder: "e.g. 4 min read" },
    { name: "image", label: "Hero Image URL", kind: "url", placeholder: "https://... or /stock/..." },
    { name: "summary", label: "Summary / Excerpt", kind: "textarea", required: true, placeholder: "Short description for guide lists and search results." },
    { name: "intro", label: "Introduction Paragraph", kind: "textarea", required: true, placeholder: "Opening context before sections." },
    { name: "published_at", label: "Publication Date", kind: "datetime-local" },
    { name: "published", label: "Publish live to website", kind: "checkbox" },
    { name: "featured", label: "Feature on homepage", kind: "checkbox" },
  ],
  sponsors: [
    { name: "name", label: "Partner Name", required: true, placeholder: "e.g. Vault Sleeves" },
    {
      name: "tier",
      label: "Sponsor Tier",
      kind: "select",
      required: true,
      options: ["Presenting", "Major", "Community"],
    },
    { name: "logo", label: "Logo Image URL", kind: "url", placeholder: "https://..." },
    { name: "url", label: "Website Link", kind: "url", placeholder: "https://..." },
    { name: "description", label: "Short Description", kind: "textarea", placeholder: "Brief bio of what this partner offers the community." },
    { name: "display_order", label: "Display Order", kind: "number", help: "Lower numbers appear first (e.g. 1, 2, 3)." },
    { name: "active", label: "Currently Active Partner", kind: "checkbox" },
    { name: "published", label: "Publish to Partner Directory", kind: "checkbox" },
  ],
  testimonials: [
    { name: "name", label: "Person Name", required: true, placeholder: "e.g. Alex Chen" },
    { name: "role", label: "Role / Subtitle", required: true, placeholder: "e.g. Community Leader, Vendor" },
    { name: "organization", label: "Store or Team (Optional)", placeholder: "e.g. TopDeck Hobbies" },
    {
      name: "audience",
      label: "Perspective / Type",
      kind: "select",
      required: true,
      options: ["Attendee", "Vendor", "Partner"],
    },
    { name: "quote", label: "Testimonial Quote", kind: "textarea", required: true, placeholder: "What did they say about Hobby Trail?" },
    { name: "approved", label: "Approved for publication", kind: "checkbox" },
    { name: "featured", label: "Feature on homepage", kind: "checkbox" },
    { name: "published", label: "Publish live", kind: "checkbox" },
  ],
};

function formatDate(isoString: unknown) {
  if (!isoString) return "—";
  try {
    const d = new Date(String(isoString));
    if (isNaN(d.getTime())) return String(isoString);
    return d.toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return String(isoString);
  }
}

function blankRecord(resource: CmsResource): CmsRecord {
  const now = new Date();
  const soon = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  const record: CmsRecord = { id: "" };

  if (resource === "settings") {
    record.id = "default";
    record.title = "Hobby Trail";
    record.ticket_cta_label = "Buy tickets";
    record.contact_email = "hello@hobbytrail.com.au";
    record.social_links = { instagram: "", twitter: "", youtube: "", discord: "" };
    return record;
  }

  for (const field of fieldSpecs[resource]) {
    record[field.name] =
      field.kind === "checkbox"
        ? false
        : field.kind === "number"
          ? 10
          : field.name === "published_at"
            ? now.toISOString()
            : "";
  }

  if (resource === "events") {
    record.start_date = now.toISOString();
    record.end_date = soon.toISOString();
    record.status = "Open";
    record.ticket_status = "Coming soon";
    record.bring = [];
  }
  if (resource === "collections") {
    record.story = [];
    record.highlights = [];
  }
  if (resource === "guides") {
    record.sections = [{ heading: "Introduction", body: "" }];
  }
  if (resource === "sponsors") {
    record.active = true;
    record.display_order = 10;
  }
  if (resource === "testimonials") {
    record.approved = true;
  }

  return record;
}

type GuideSection = { heading: string; body: string };

function CmsEditorModal({
  resource,
  record,
  onSaved,
  onCancel,
  onDelete,
}: {
  resource: Exclude<CmsResource, "settings">;
  record: CmsRecord;
  onSaved: (saved: CmsRecord) => void;
  onCancel: () => void;
  onDelete?: (record: CmsRecord) => void;
}) {
  const isNew = !record.id;
  const [formData, setFormData] = useState<CmsRecord>(() => ({ ...record }));
  const [slugLocked, setSlugLocked] = useState<boolean>(!isNew);
  const [sections, setSections] = useState<GuideSection[]>(() => {
    if (resource === "guides") {
      if (Array.isArray(record.sections) && record.sections.length > 0) {
        return record.sections as GuideSection[];
      }
      return [{ heading: "Introduction", body: "" }];
    }
    return [];
  });
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>(String(record.image ?? record.logo ?? ""));
  const [imageValid, setImageValid] = useState<boolean>(true);
  const [pending, setPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const titleId = useId();
  const formRef = useRef<HTMLFormElement>(null);

  // Sync title changes with slug if unlocked and new
  function handleTitleChange(val: string) {
    setFormData((prev) => {
      const next: CmsRecord = { ...prev, title: val };
      if (!slugLocked) {
        next.slug = slugify(val);
      }
      return next;
    });
  }

  // Handle live image preview
  function handleImageUrlChange(val: string) {
    setFormData((prev) => ({ ...prev, [resource === "sponsors" ? "logo" : "image"]: val }));
    setImagePreviewUrl(val.trim());
    setImageValid(true);
  }

  // Save handler
  const handleSubmit = useCallback(
    async (e?: FormEvent) => {
      if (e) e.preventDefault();
      if (pending) return;

      setPending(true);
      setErrorMsg("");

      const payload: Record<string, unknown> = { ...formData };

      // Ensure guide sections are formatted properly
      if (resource === "guides") {
        payload.sections = sections.filter((s) => s.heading.trim() || s.body.trim());
      }

      // Convert array fields
      if (resource === "events" && typeof payload.bring === "string") {
        payload.bring = payload.bring.split("\n").map((s) => s.trim()).filter(Boolean);
      }
      if (resource === "collections") {
        if (typeof payload.story === "string") {
          payload.story = payload.story.split("\n").map((s) => s.trim()).filter(Boolean);
        }
        if (typeof payload.highlights === "string") {
          payload.highlights = payload.highlights.split("\n").map((s) => s.trim()).filter(Boolean);
        }
      }

      // Format datetimes to ISO
      if (payload.start_date) payload.start_date = new Date(String(payload.start_date)).toISOString();
      if (payload.end_date) payload.end_date = new Date(String(payload.end_date)).toISOString();
      if (payload.published_at) payload.published_at = new Date(String(payload.published_at)).toISOString();

      try {
        const url = `/api/cms/${resource}${isNew ? "" : `/${record.id}`}`;
        const method = isNew ? "POST" : "PATCH";
        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const result = (await response.json()) as { record?: CmsRecord; error?: string };

        if (!response.ok || !result.record) {
          setErrorMsg(result.error ?? "Failed to save record.");
          setPending(false);
          return;
        }

        onSaved(result.record);
      } catch {
        setErrorMsg("Network error: CMS API could not be reached.");
        setPending(false);
      }
    },
    [formData, isNew, onSaved, pending, record.id, resource, sections]
  );

  // Keyboard shortcut: Cmd+S / Ctrl+S saves; Escape closes
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSubmit();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleSubmit, onCancel]);

  return (
    <div
      className="cms-modal-backdrop"
      data-lenis-prevent
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <form
        ref={formRef}
        className="cms-modal-dialog"
        onSubmit={handleSubmit}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        {/* Sticky Header */}
        <header className="cms-modal-header">
          <div className="cms-modal-header__info">
            <div className="cms-modal-header__meta">
              <span className={`cms-status-pill ${formData.published ? "cms-status-pill--published" : "cms-status-pill--draft"}`}>
                {formData.published ? "Published" : "Draft"}
              </span>
              <span className="cms-modal-shortcut" title="Press Cmd+S or Ctrl+S to save from anywhere">
                Press ⌘S to save
              </span>
            </div>
            <h2 id={titleId} className="cms-modal-title">
              {isNew ? `New ${resourceLabels[resource].replace(/s$/, "")}` : String(formData.title ?? formData.name ?? "Edit record")}
            </h2>
          </div>

          <div className="cms-modal-header__actions">
            <button className="cms-btn cms-btn--secondary" type="button" onClick={onCancel} disabled={pending}>
              Cancel
            </button>
            <button className="cms-btn cms-btn--primary" type="submit" disabled={pending}>
              {pending ? "Saving…" : isNew ? "Create Record" : "Save Changes"}
            </button>
            <button className="cms-close-btn" type="button" onClick={onCancel} aria-label="Close dialog">
              <X size={18} weight="bold" />
            </button>
          </div>
        </header>

        {errorMsg && (
          <div className="cms-modal-alert cms-modal-alert--error" role="alert">
            {errorMsg}
          </div>
        )}

        {/* Modal Body - 2 Column Layout */}
        <div className="cms-modal-body" data-lenis-prevent>
          {/* Main Column (65%) */}
          <div className="cms-modal-main">
            {/* Title & Slug Group */}
            {"title" in (fieldSpecs[resource][0] ?? {}) && (
              <div className="cms-form-card">
                <div className="cms-field-group">
                  <label className="cms-label" htmlFor="field-title">
                    Title <span className="cms-required">*</span>
                  </label>
                  <input
                    id="field-title"
                    className="cms-input cms-input--lg"
                    type="text"
                    required
                    value={String(formData.title ?? "")}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder={fieldSpecs[resource].find((f) => f.name === "title")?.placeholder}
                    autoFocus={isNew}
                  />
                </div>

                {"slug" in (fieldSpecs[resource][1] ?? {}) && (
                  <div className="cms-field-group cms-slug-row">
                    <label className="cms-label" htmlFor="field-slug">
                      URL Slug <span className="cms-required">*</span>
                    </label>
                    <div className="cms-slug-input-wrapper">
                      <span className="cms-slug-prefix">/{resource}/</span>
                      <input
                        id="field-slug"
                        className="cms-input cms-input--slug"
                        type="text"
                        required
                        readOnly={slugLocked}
                        value={String(formData.slug ?? "")}
                        onChange={(e) => setFormData((prev) => ({ ...prev, slug: slugify(e.target.value) }))}
                      />
                      <button
                        type="button"
                        className="cms-slug-lock-btn"
                        onClick={() => setSlugLocked(!slugLocked)}
                        title={slugLocked ? "Unlock slug to edit manually" : "Lock slug"}
                      >
                        {slugLocked ? <Lock size={15} weight="bold" /> : <LockOpen size={15} weight="bold" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Testimonials specific title field */}
            {resource === "testimonials" && (
              <div className="cms-form-card">
                <div className="cms-field-row">
                  <div className="cms-field-group">
                    <label className="cms-label" htmlFor="field-name">
                      Person Name <span className="cms-required">*</span>
                    </label>
                    <input
                      id="field-name"
                      className="cms-input"
                      type="text"
                      required
                      value={String(formData.name ?? "")}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Alex Chen"
                    />
                  </div>
                  <div className="cms-field-group">
                    <label className="cms-label" htmlFor="field-role">
                      Role / Subtitle <span className="cms-required">*</span>
                    </label>
                    <input
                      id="field-role"
                      className="cms-input"
                      type="text"
                      required
                      value={String(formData.role ?? "")}
                      onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
                      placeholder="e.g. Community Leader"
                    />
                  </div>
                </div>
                <div className="cms-field-group">
                  <label className="cms-label" htmlFor="field-org">
                    Store or Organization (Optional)
                  </label>
                  <input
                    id="field-org"
                    className="cms-input"
                    type="text"
                    value={String(formData.organization ?? "")}
                    onChange={(e) => setFormData((prev) => ({ ...prev, organization: e.target.value }))}
                    placeholder="e.g. TopDeck Hobbies"
                  />
                </div>
                <div className="cms-field-group">
                  <label className="cms-label" htmlFor="field-quote">
                    Quote <span className="cms-required">*</span>
                  </label>
                  <textarea
                    id="field-quote"
                    className="cms-textarea"
                    rows={4}
                    required
                    value={String(formData.quote ?? "")}
                    onChange={(e) => setFormData((prev) => ({ ...prev, quote: e.target.value }))}
                    placeholder="What did they say about Hobby Trail?"
                  />
                </div>
              </div>
            )}

            {/* Sponsors specific fields */}
            {resource === "sponsors" && (
              <div className="cms-form-card">
                <div className="cms-field-row">
                  <div className="cms-field-group">
                    <label className="cms-label" htmlFor="field-s-name">
                      Partner Name <span className="cms-required">*</span>
                    </label>
                    <input
                      id="field-s-name"
                      className="cms-input"
                      type="text"
                      required
                      value={String(formData.name ?? "")}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Vault Sleeves"
                    />
                  </div>
                  <div className="cms-field-group">
                    <label className="cms-label" htmlFor="field-s-tier">
                      Sponsor Tier <span className="cms-required">*</span>
                    </label>
                    <select
                      id="field-s-tier"
                      className="cms-select"
                      value={String(formData.tier ?? "Community")}
                      onChange={(e) => setFormData((prev) => ({ ...prev, tier: e.target.value }))}
                    >
                      <option value="Presenting">Presenting</option>
                      <option value="Major">Major</option>
                      <option value="Community">Community</option>
                    </select>
                  </div>
                </div>
                <div className="cms-field-group">
                  <label className="cms-label" htmlFor="field-s-url">
                    Website URL
                  </label>
                  <input
                    id="field-s-url"
                    className="cms-input"
                    type="url"
                    value={String(formData.url ?? "")}
                    onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
                <div className="cms-field-group">
                  <label className="cms-label" htmlFor="field-s-desc">
                    Description
                  </label>
                  <textarea
                    id="field-s-desc"
                    className="cms-textarea"
                    rows={3}
                    value={String(formData.description ?? "")}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Short description of this partner..."
                  />
                </div>
              </div>
            )}

            {/* General form fields for other resources */}
            <div className="cms-form-card">
              <h3 className="cms-card-subtitle">Details & Content</h3>
              <div className="cms-fields-grid">
                {fieldSpecs[resource]
                  .filter((f) => !["title", "slug", "name", "published", "featured", "image", "logo", "sections"].includes(f.name))
                  .map((field) => {
                    const rawVal = formData[field.name];
                    const val = Array.isArray(rawVal) ? rawVal.join("\n") : rawVal == null ? "" : String(rawVal);

                    if (field.kind === "checkbox") {
                      return (
                        <label key={field.name} className="cms-checkbox-label">
                          <input
                            type="checkbox"
                            checked={Boolean(formData[field.name])}
                            onChange={(e) => setFormData((prev) => ({ ...prev, [field.name]: e.target.checked }))}
                          />
                          <span>{field.label}</span>
                        </label>
                      );
                    }

                    if (field.kind === "select") {
                      return (
                        <div key={field.name} className="cms-field-group">
                          <label className="cms-label" htmlFor={`field-${field.name}`}>
                            {field.label} {field.required && <span className="cms-required">*</span>}
                          </label>
                          <select
                            id={`field-${field.name}`}
                            className="cms-select"
                            value={val}
                            required={field.required}
                            onChange={(e) => setFormData((prev) => ({ ...prev, [field.name]: e.target.value }))}
                          >
                            {field.options?.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    }

                    if (field.kind === "datetime-local") {
                      const dateVal = val ? new Date(val).toISOString().slice(0, 16) : "";
                      return (
                        <div key={field.name} className="cms-field-group">
                          <label className="cms-label" htmlFor={`field-${field.name}`}>
                            {field.label} {field.required && <span className="cms-required">*</span>}
                          </label>
                          <input
                            id={`field-${field.name}`}
                            className="cms-input"
                            type="datetime-local"
                            required={field.required}
                            value={dateVal}
                            onChange={(e) => setFormData((prev) => ({ ...prev, [field.name]: e.target.value }))}
                          />
                        </div>
                      );
                    }

                    if (field.kind === "textarea") {
                      return (
                        <div key={field.name} className="cms-field-group cms-field-group--full">
                          <label className="cms-label" htmlFor={`field-${field.name}`}>
                            {field.label} {field.required && <span className="cms-required">*</span>}
                          </label>
                          <textarea
                            id={`field-${field.name}`}
                            className="cms-textarea"
                            rows={field.name === "summary" || field.name === "intro" ? 3 : 5}
                            required={field.required}
                            value={val}
                            onChange={(e) => setFormData((prev) => ({ ...prev, [field.name]: e.target.value }))}
                            placeholder={field.placeholder}
                          />
                          {field.help && <span className="cms-help-text">{field.help}</span>}
                        </div>
                      );
                    }

                    return (
                      <div key={field.name} className="cms-field-group">
                        <label className="cms-label" htmlFor={`field-${field.name}`}>
                          {field.label} {field.required && <span className="cms-required">*</span>}
                        </label>
                        <input
                          id={`field-${field.name}`}
                          className="cms-input"
                          type={field.kind ?? "text"}
                          required={field.required}
                          value={val}
                          onChange={(e) => setFormData((prev) => ({ ...prev, [field.name]: e.target.value }))}
                          placeholder={field.placeholder}
                        />
                        {field.help && <span className="cms-help-text">{field.help}</span>}
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Guide Sections Visual Repeater */}
            {resource === "guides" && (
              <div className="cms-form-card">
                <div className="cms-card-header-row">
                  <div>
                    <h3 className="cms-card-subtitle">Guide Sections</h3>
                    <p className="cms-card-description">Add modular content blocks with headings and paragraphs.</p>
                  </div>
                  <button
                    type="button"
                    className="cms-btn cms-btn--secondary cms-btn--sm"
                    onClick={() => setSections((prev) => [...prev, { heading: "", body: "" }])}
                  >
                    <Plus size={14} weight="bold" /> Add Section
                  </button>
                </div>

                <div className="cms-repeater-list">
                  {sections.map((section, sIndex) => (
                    <div key={sIndex} className="cms-repeater-item">
                      <div className="cms-repeater-item__header">
                        <span className="cms-repeater-num">Section {sIndex + 1}</span>
                        {sections.length > 1 && (
                          <button
                            type="button"
                            className="cms-repeater-del-btn"
                            onClick={() => setSections((prev) => prev.filter((_, i) => i !== sIndex))}
                            title="Remove section"
                          >
                            <Trash size={14} weight="bold" />
                          </button>
                        )}
                      </div>
                      <div className="cms-field-group">
                        <input
                          className="cms-input"
                          type="text"
                          placeholder="Section Heading (e.g. Inspecting Surface and Edges)"
                          value={section.heading}
                          onChange={(e) => {
                            const updated = [...sections];
                            updated[sIndex] = { ...updated[sIndex], heading: e.target.value };
                            setSections(updated);
                          }}
                        />
                      </div>
                      <div className="cms-field-group">
                        <textarea
                          className="cms-textarea"
                          rows={4}
                          placeholder="Section body text..."
                          value={section.body}
                          onChange={(e) => {
                            const updated = [...sections];
                            updated[sIndex] = { ...updated[sIndex], body: e.target.value };
                            setSections(updated);
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Column (35%) */}
          <aside className="cms-modal-sidebar">
            {/* Publishing & Visibility Card */}
            <div className="cms-form-card">
              <h3 className="cms-card-subtitle">Publishing Status</h3>
              <div className="cms-toggle-group">
                <label className="cms-toggle-label">
                  <div>
                    <strong>Published</strong>
                    <span>Live on the public website</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={Boolean(formData.published)}
                    onChange={(e) => setFormData((prev) => ({ ...prev, published: e.target.checked }))}
                  />
                </label>
              </div>

              {"featured" in (fieldSpecs[resource][0] ? formData : {}) && (
                <div className="cms-toggle-group">
                  <label className="cms-toggle-label">
                    <div>
                      <strong>Featured</strong>
                      <span>Highlighted on homepage</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={Boolean(formData.featured)}
                      onChange={(e) => setFormData((prev) => ({ ...prev, featured: e.target.checked }))}
                    />
                  </label>
                </div>
              )}

              {resource === "sponsors" && (
                <div className="cms-toggle-group">
                  <label className="cms-toggle-label">
                    <div>
                      <strong>Active Partner</strong>
                      <span>Currently sponsor of events</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={Boolean(formData.active)}
                      onChange={(e) => setFormData((prev) => ({ ...prev, active: e.target.checked }))}
                    />
                  </label>
                </div>
              )}

              {resource === "testimonials" && (
                <div className="cms-toggle-group">
                  <label className="cms-toggle-label">
                    <div>
                      <strong>Approved</strong>
                      <span>Confirmed permission to display</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={Boolean(formData.approved)}
                      onChange={(e) => setFormData((prev) => ({ ...prev, approved: e.target.checked }))}
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Media & Live Preview Card */}
            {("image" in formData || "logo" in formData) && (
              <div className="cms-form-card">
                <h3 className="cms-card-subtitle">{resource === "sponsors" ? "Partner Logo" : "Cover Image"}</h3>
                <div className="cms-field-group">
                  <input
                    className="cms-input"
                    type="url"
                    placeholder="Image URL (https://... or /stock/...)"
                    value={String(formData.image ?? formData.logo ?? "")}
                    onChange={(e) => handleImageUrlChange(e.target.value)}
                  />
                </div>

                <div className="cms-image-preview-box">
                  {imagePreviewUrl && imageValid ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imagePreviewUrl}
                      alt="Preview"
                      className="cms-image-preview"
                      onError={() => setImageValid(false)}
                    />
                  ) : (
                    <div className="cms-image-placeholder">
                      <span>No image preview</span>
                      <small>{imagePreviewUrl && !imageValid ? "Unable to load URL" : "Enter a valid URL above"}</small>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Record Metadata */}
            {!isNew && (
              <div className="cms-form-card cms-meta-card">
                <h3 className="cms-card-subtitle">Record Info</h3>
                <div className="cms-meta-row">
                  <span>Record ID:</span>
                  <code>{record.id}</code>
                </div>
                {Boolean(record.slug) && (
                  <div className="cms-meta-row">
                    <span>Slug:</span>
                    <code>{String(record.slug)}</code>
                  </div>
                )}
                {Boolean(record.created_at) && (
                  <div className="cms-meta-row">
                    <span>Created:</span>
                    <span>{formatDate(record.created_at)}</span>
                  </div>
                )}
                {Boolean(record.updated_at) && (
                  <div className="cms-meta-row">
                    <span>Updated:</span>
                    <span>{formatDate(record.updated_at)}</span>
                  </div>
                )}
              </div>
            )}
          </aside>
        </div>

        {/* Modal Footer */}
        <footer className="cms-modal-footer">
          <div className="cms-modal-footer__left">
            {!isNew && onDelete && (
              <button
                type="button"
                className="cms-btn cms-btn--danger-ghost"
                onClick={() => onDelete(record)}
                disabled={pending}
              >
                <Trash size={16} weight="bold" /> Delete record
              </button>
            )}
          </div>

          <div className="cms-modal-footer__right">
            <button type="button" className="cms-btn cms-btn--secondary" onClick={onCancel} disabled={pending}>
              Cancel
            </button>
            <button type="submit" className="cms-btn cms-btn--primary" disabled={pending}>
              {pending ? "Saving…" : isNew ? "Create Record" : "Save Changes"}
            </button>
          </div>
        </footer>
      </form>
    </div>
  );
}

export function CmsDashboard({ initialRecords, userEmail }: { initialRecords: CmsRecords; userEmail: string }) {
  const [records, setRecords] = useState<CmsRecords>(initialRecords);
  const [resource, setResource] = useState<CmsResource>("events");
  const [editing, setEditing] = useState<CmsRecord | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // Settings form state
  const settingsRecord = records.settings?.[0] ?? blankRecord("settings");
  const [settingsData, setSettingsData] = useState<CmsRecord>(() => ({ ...settingsRecord }));
  const [settingsPending, setSettingsPending] = useState(false);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const activeRecords = useMemo(() => records[resource] ?? [], [records, resource]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    const q = query.trim().toLowerCase();
    return activeRecords.filter((rec) => {
      const matchQuery =
        !q ||
        `${String(rec.title ?? "")} ${String(rec.name ?? "")} ${String(rec.slug ?? "")} ${String(rec.curator ?? "")} ${String(rec.game ?? "")} ${String(rec.venue_name ?? "")} ${String(rec.city ?? "")} ${String(rec.category ?? "")}`
          .toLowerCase()
          .includes(q);

      const matchStatus =
        statusFilter === "all" || (statusFilter === "published" ? Boolean(rec.published) : !rec.published);

      return matchQuery && (resource === "settings" || matchStatus);
    });
  }, [activeRecords, query, resource, statusFilter]);

  // Refresh
  const handleRefresh = useCallback(
    async (res = resource) => {
      setRefreshing(true);
      try {
        const response = await fetch(`/api/cms/${res}`, { cache: "no-store" });
        const result = (await response.json()) as { records?: CmsRecord[]; error?: string };
        if (!response.ok || !result.records) {
          setToast({ message: result.error ?? "Failed to refresh.", type: "error" });
          return;
        }
        setRecords((prev) => ({ ...prev, [res]: result.records }));
        setToast({ message: `${resourceLabels[res]} updated.`, type: "success" });
      } catch {
        setToast({ message: "Unable to reach CMS server.", type: "error" });
      } finally {
        setRefreshing(false);
      }
    },
    [resource]
  );

  // Quick toggle publication status in table
  const handleTogglePublish = useCallback(
    async (record: CmsRecord) => {
      const newStatus = !record.published;
      try {
        const response = await fetch(`/api/cms/${resource}/${record.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ published: newStatus }),
        });
        const result = (await response.json()) as { record?: CmsRecord; error?: string };
        if (!response.ok || !result.record) {
          setToast({ message: result.error ?? "Could not update status.", type: "error" });
          return;
        }
        setRecords((prev) => ({
          ...prev,
          [resource]: prev[resource].map((item) => (item.id === record.id ? result.record! : item)),
        }));
        setToast({
          message: `Record ${newStatus ? "published" : "moved to drafts"}.`,
          type: "success",
        });
      } catch {
        setToast({ message: "Network error updating status.", type: "error" });
      }
    },
    [resource]
  );

  // Delete
  const handleDelete = useCallback(
    async (record: CmsRecord) => {
      const title = String(record.title ?? record.name ?? "this record");
      if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;

      try {
        const response = await fetch(`/api/cms/${resource}/${record.id}`, { method: "DELETE" });
        if (!response.ok) {
          const res = (await response.json()) as { error?: string };
          setToast({ message: res.error ?? "Failed to delete.", type: "error" });
          return;
        }
        setRecords((prev) => ({
          ...prev,
          [resource]: prev[resource].filter((item) => item.id !== record.id),
        }));
        setEditing(null);
        setToast({ message: `"${title}" was deleted.`, type: "info" });
      } catch {
        setToast({ message: "Network error deleting record.", type: "error" });
      }
    },
    [resource]
  );

  // Saved callback
  function handleRecordSaved(saved: CmsRecord) {
    setRecords((prev) => {
      const list = prev[resource];
      const exists = list.some((i) => i.id === saved.id);
      return {
        ...prev,
        [resource]: exists ? list.map((i) => (i.id === saved.id ? saved : i)) : [saved, ...list],
      };
    });
    setEditing(null);
    setToast({ message: "Changes saved successfully.", type: "success" });
  }

  // Save Settings
  async function handleSaveSettings(e: FormEvent) {
    e.preventDefault();
    setSettingsPending(true);
    try {
      const response = await fetch("/api/cms/settings/default", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsData),
      });
      const result = (await response.json()) as { record?: CmsRecord; error?: string };
      if (!response.ok || !result.record) {
        setToast({ message: result.error ?? "Failed to update settings.", type: "error" });
        return;
      }
      setRecords((prev) => ({ ...prev, settings: [result.record!] }));
      setToast({ message: "Site settings updated.", type: "success" });
    } catch {
      setToast({ message: "Network error updating settings.", type: "error" });
    } finally {
      setSettingsPending(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/cms/auth/logout", { method: "POST" });
    window.location.reload();
  }

  const ResourceIcon = resourceIcons[resource];

  return (
    <div className="cms-shell" id="main-content">
      {/* Top Application Bar */}
      <header className="cms-appbar">
        <div className="cms-appbar__left">
          <Link href="/" className="cms-brand" target="_blank" title="View Hobby Trail homepage">
            <div className="cms-brand__logo">HT</div>
            <span className="cms-brand__text">Hobby Trail</span>
            <span className="cms-brand__badge">CMS</span>
          </Link>
        </div>

        <div className="cms-appbar__right">
          <Link href="/" target="_blank" className="cms-live-link">
            <span>View Live Site</span>
            <ArrowSquareOut size={15} weight="bold" />
          </Link>

          <div className="cms-user-pill">
            <span className="cms-user-avatar" aria-hidden="true">
              {userEmail.charAt(0).toUpperCase()}
            </span>
            <span className="cms-user-email">{userEmail}</span>
            <button className="cms-logout-btn" onClick={handleLogout} type="button" title="Sign out">
              <SignOut size={16} weight="bold" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout: Sidebar + Canvas */}
      <div className="cms-app-layout">
        {/* Left Sidebar */}
        <aside className="cms-sidebar">
          <nav className="cms-sidebar__nav" aria-label="CMS Navigation">
            {navigationGroups.map((group) => (
              <div key={group.title} className="cms-nav-group">
                <span className="cms-nav-group__title">{group.title}</span>
                <div className="cms-nav-group__list">
                  {group.items.map((item) => {
                    const IconComp = resourceIcons[item];
                    const isActive = resource === item;
                    const count = records[item]?.length ?? 0;
                    return (
                      <button
                        key={item}
                        type="button"
                        className={`cms-nav-item ${isActive ? "cms-nav-item--active" : ""}`}
                        onClick={() => {
                          setResource(item);
                          setEditing(null);
                          setQuery("");
                          setStatusFilter("all");
                        }}
                      >
                        <div className="cms-nav-item__left">
                          <IconComp size={18} weight={isActive ? "fill" : "regular"} />
                          <span>{resourceLabels[item]}</span>
                        </div>
                        {item !== "settings" && <span className="cms-nav-item__count">{count}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="cms-main">
          {/* Toast Notification */}
          {toast && (
            <div className={`cms-toast cms-toast--${toast.type}`} role="status">
              {toast.type === "success" && <Check size={16} weight="bold" />}
              <span>{toast.message}</span>
              <button type="button" onClick={() => setToast(null)} aria-label="Dismiss">
                <X size={14} weight="bold" />
              </button>
            </div>
          )}

          {/* View Header */}
          <div className="cms-view-header">
            <div className="cms-view-header__titles">
              <div className="cms-breadcrumb">
                <span>CMS</span> / <span>{resourceLabels[resource]}</span>
              </div>
              <div className="cms-title-row">
                <h1 className="cms-view-title">{resourceLabels[resource]}</h1>
                {resource !== "settings" && (
                  <span className="cms-item-count-badge">
                    {activeRecords.length} {activeRecords.length === 1 ? "item" : "items"}
                  </span>
                )}
              </div>
              <p className="cms-view-subtitle">{resourceSubtitles[resource]}</p>
            </div>

            <div className="cms-view-header__actions">
              <button
                type="button"
                className="cms-btn cms-btn--secondary cms-btn--refresh"
                onClick={() => handleRefresh()}
                disabled={refreshing}
                title="Refresh database records"
              >
                <ArrowsClockwise size={16} weight="bold" className={refreshing ? "cms-spin" : ""} />
                <span>Refresh</span>
              </button>

              {resource !== "settings" && (
                <button
                  type="button"
                  className="cms-btn cms-btn--primary"
                  onClick={() => setEditing(blankRecord(resource))}
                >
                  <Plus size={16} weight="bold" />
                  <span>New {resourceLabels[resource].replace(/s$/, "")}</span>
                </button>
              )}
            </div>
          </div>

          {/* Settings Dedicated View */}
          {resource === "settings" ? (
            <form onSubmit={handleSaveSettings} className="cms-settings-view">
              <div className="cms-settings-card">
                <h2 className="cms-settings-card__title">Brand & Identity</h2>
                <p className="cms-settings-card__subtitle">Global public copy displayed in navigation and headers.</p>

                <div className="cms-fields-grid">
                  <div className="cms-field-group">
                    <label className="cms-label" htmlFor="settings-title">
                      Brand Name <span className="cms-required">*</span>
                    </label>
                    <input
                      id="settings-title"
                      className="cms-input"
                      type="text"
                      required
                      value={String(settingsData.title ?? "")}
                      onChange={(e) => setSettingsData((prev) => ({ ...prev, title: e.target.value }))}
                    />
                  </div>

                  <div className="cms-field-group">
                    <label className="cms-label" htmlFor="settings-cta">
                      Ticket Button CTA Label <span className="cms-required">*</span>
                    </label>
                    <input
                      id="settings-cta"
                      className="cms-input"
                      type="text"
                      required
                      value={String(settingsData.ticket_cta_label ?? "")}
                      onChange={(e) => setSettingsData((prev) => ({ ...prev, ticket_cta_label: e.target.value }))}
                    />
                  </div>

                  <div className="cms-field-group cms-field-group--full">
                    <label className="cms-label" htmlFor="settings-desc">
                      Site Description
                    </label>
                    <textarea
                      id="settings-desc"
                      className="cms-textarea"
                      rows={3}
                      value={String(settingsData.description ?? "")}
                      onChange={(e) => setSettingsData((prev) => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div className="cms-settings-card">
                <h2 className="cms-settings-card__title">Public Contact Information</h2>
                <p className="cms-settings-card__subtitle">Email address used for inquiries and support links.</p>

                <div className="cms-field-group">
                  <label className="cms-label" htmlFor="settings-email">
                    Contact Email Address
                  </label>
                  <input
                    id="settings-email"
                    className="cms-input"
                    type="email"
                    value={String(settingsData.contact_email ?? "")}
                    onChange={(e) => setSettingsData((prev) => ({ ...prev, contact_email: e.target.value }))}
                    placeholder="e.g. hello@hobbytrail.com.au"
                  />
                </div>
              </div>

              <div className="cms-settings-card">
                <h2 className="cms-settings-card__title">Social Media Links</h2>
                <p className="cms-settings-card__subtitle">Channels connected to footer icons and external links.</p>

                <div className="cms-social-inputs">
                  {(() => {
                    const links = (settingsData.social_links as Record<string, string>) || {};
                    const setSocial = (key: string, val: string) => {
                      setSettingsData((prev) => ({
                        ...prev,
                        social_links: { ...(prev.social_links as Record<string, string>), [key]: val },
                      }));
                    };
                    return (
                      <>
                        <div className="cms-social-input-row">
                          <span className="cms-social-icon"><InstagramLogo size={20} weight="fill" /></span>
                          <input
                            className="cms-input"
                            type="url"
                            placeholder="Instagram profile URL (https://instagram.com/...)"
                            value={links.instagram ?? ""}
                            onChange={(e) => setSocial("instagram", e.target.value)}
                          />
                        </div>
                        <div className="cms-social-input-row">
                          <span className="cms-social-icon"><TwitterLogo size={20} weight="fill" /></span>
                          <input
                            className="cms-input"
                            type="url"
                            placeholder="X / Twitter profile URL (https://x.com/...)"
                            value={links.twitter ?? ""}
                            onChange={(e) => setSocial("twitter", e.target.value)}
                          />
                        </div>
                        <div className="cms-social-input-row">
                          <span className="cms-social-icon"><YoutubeLogo size={20} weight="fill" /></span>
                          <input
                            className="cms-input"
                            type="url"
                            placeholder="YouTube channel URL (https://youtube.com/...)"
                            value={links.youtube ?? ""}
                            onChange={(e) => setSocial("youtube", e.target.value)}
                          />
                        </div>
                        <div className="cms-social-input-row">
                          <span className="cms-social-icon"><DiscordLogo size={20} weight="fill" /></span>
                          <input
                            className="cms-input"
                            type="url"
                            placeholder="Discord invite URL (https://discord.gg/...)"
                            value={links.discord ?? ""}
                            onChange={(e) => setSocial("discord", e.target.value)}
                          />
                        </div>
                        <div className="cms-social-input-row">
                          <span className="cms-social-icon"><FacebookLogo size={20} weight="fill" /></span>
                          <input
                            className="cms-input"
                            type="url"
                            placeholder="Facebook page URL (https://facebook.com/...)"
                            value={links.facebook ?? ""}
                            onChange={(e) => setSocial("facebook", e.target.value)}
                          />
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              <div className="cms-settings-actions">
                <button type="submit" className="cms-btn cms-btn--primary" disabled={settingsPending}>
                  {settingsPending ? "Saving settings…" : "Save Site Settings"}
                </button>
              </div>
            </form>
          ) : (
            /* Resource Data View */
            <div className="cms-data-view">
              {/* Filter & Search Toolbar */}
              <div className="cms-toolbar">
                <div className="cms-search-box">
                  <MagnifyingGlass size={16} weight="bold" />
                  <input
                    type="search"
                    className="cms-search-input"
                    placeholder={`Search ${resourceLabels[resource].toLowerCase()} by title, slug, category...`}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  {query && (
                    <button type="button" className="cms-search-clear" onClick={() => setQuery("")} aria-label="Clear search">
                      <X size={14} weight="bold" />
                    </button>
                  )}
                </div>

                <div className="cms-filter-tabs">
                  <button
                    type="button"
                    className={`cms-filter-tab ${statusFilter === "all" ? "cms-filter-tab--active" : ""}`}
                    onClick={() => setStatusFilter("all")}
                  >
                    All ({activeRecords.length})
                  </button>
                  <button
                    type="button"
                    className={`cms-filter-tab ${statusFilter === "published" ? "cms-filter-tab--active" : ""}`}
                    onClick={() => setStatusFilter("published")}
                  >
                    Published ({activeRecords.filter((r) => r.published).length})
                  </button>
                  <button
                    type="button"
                    className={`cms-filter-tab ${statusFilter === "draft" ? "cms-filter-tab--active" : ""}`}
                    onClick={() => setStatusFilter("draft")}
                  >
                    Drafts ({activeRecords.filter((r) => !r.published).length})
                  </button>
                </div>
              </div>

              {/* Data Table Container */}
              <div className="cms-table-card">
                {filteredRecords.length === 0 ? (
                  <div className="cms-empty-state">
                    <div className="cms-empty-state__icon">
                      <ResourceIcon size={32} weight="duotone" />
                    </div>
                    <h3 className="cms-empty-state__title">
                      {activeRecords.length === 0
                        ? `No ${resourceLabels[resource].toLowerCase()} created yet`
                        : "No matching records found"}
                    </h3>
                    <p className="cms-empty-state__text">
                      {activeRecords.length === 0
                        ? "Get started by adding your first record."
                        : "Try adjusting your search query or status filter."}
                    </p>
                    {activeRecords.length === 0 && (
                      <button
                        type="button"
                        className="cms-btn cms-btn--primary"
                        onClick={() => setEditing(blankRecord(resource))}
                      >
                        <Plus size={16} weight="bold" />
                        <span>Create {resourceLabels[resource].replace(/s$/, "")}</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="cms-table-wrapper">
                    <table className="cms-table">
                      <thead>
                        <tr>
                          {resource === "events" && (
                            <>
                              <th className="cms-th">Event Title & Slug</th>
                              <th className="cms-th">Schedule & Dates</th>
                              <th className="cms-th">Game & Category</th>
                              <th className="cms-th">Venue</th>
                              <th className="cms-th">Status</th>
                              <th className="cms-th">Visibility</th>
                              <th className="cms-th cms-th--actions">Actions</th>
                            </>
                          )}

                          {resource === "collections" && (
                            <>
                              <th className="cms-th">Collection</th>
                              <th className="cms-th">Curator</th>
                              <th className="cms-th">Game / Focus</th>
                              <th className="cms-th">Era & Format</th>
                              <th className="cms-th">Visibility</th>
                              <th className="cms-th cms-th--actions">Actions</th>
                            </>
                          )}

                          {resource === "guides" && (
                            <>
                              <th className="cms-th">Guide</th>
                              <th className="cms-th">Category</th>
                              <th className="cms-th">Read Time</th>
                              <th className="cms-th">Published Date</th>
                              <th className="cms-th">Visibility</th>
                              <th className="cms-th cms-th--actions">Actions</th>
                            </>
                          )}

                          {resource === "sponsors" && (
                            <>
                              <th className="cms-th">Partner Name</th>
                              <th className="cms-th">Tier</th>
                              <th className="cms-th">Website</th>
                              <th className="cms-th">Order</th>
                              <th className="cms-th">Status</th>
                              <th className="cms-th">Visibility</th>
                              <th className="cms-th cms-th--actions">Actions</th>
                            </>
                          )}

                          {resource === "testimonials" && (
                            <>
                              <th className="cms-th">Author</th>
                              <th className="cms-th">Perspective</th>
                              <th className="cms-th">Quote Preview</th>
                              <th className="cms-th">Approved</th>
                              <th className="cms-th">Visibility</th>
                              <th className="cms-th cms-th--actions">Actions</th>
                            </>
                          )}
                        </tr>
                      </thead>

                      <tbody>
                        {filteredRecords.map((record) => (
                          <tr key={record.id} className="cms-tr">
                            {/* EVENTS ROW */}
                            {resource === "events" && (
                              <>
                                <td className="cms-td">
                                  <div className="cms-title-cell">
                                    <button
                                      type="button"
                                      className="cms-cell-title-btn"
                                      onClick={() => setEditing(record)}
                                    >
                                      {String(record.title)}
                                    </button>
                                    <span className="cms-cell-slug">/events/{String(record.slug)}</span>
                                  </div>
                                </td>
                                <td className="cms-td">
                                  <div className="cms-date-cell">
                                    <span>{formatDate(record.start_date)}</span>
                                  </div>
                                </td>
                                <td className="cms-td">
                                  <div className="cms-tag-cell">
                                    <span className="cms-tag">{String(record.category ?? "General")}</span>
                                    <span className="cms-tag-muted">{String(record.game ?? "")}</span>
                                  </div>
                                </td>
                                <td className="cms-td">
                                  <span className="cms-cell-text">{String(record.venue_name ?? record.city ?? "—")}</span>
                                </td>
                                <td className="cms-td">
                                  <span className="cms-badge cms-badge--info">{String(record.status ?? "Open")}</span>
                                </td>
                                <td className="cms-td">
                                  <button
                                    type="button"
                                    onClick={() => handleTogglePublish(record)}
                                    className={`cms-status-pill ${record.published ? "cms-status-pill--published" : "cms-status-pill--draft"}`}
                                    title="Click to toggle publish status"
                                  >
                                    {record.published ? "Published" : "Draft"}
                                  </button>
                                </td>
                                <td className="cms-td cms-td--actions">
                                  <div className="cms-row-actions">
                                    {Boolean(record.slug) && (
                                      <Link
                                        href={`/events/${record.slug}`}
                                        target="_blank"
                                        className="cms-action-btn"
                                        title="View live event page"
                                      >
                                        <Eye size={16} weight="bold" />
                                      </Link>
                                    )}
                                    <button
                                      type="button"
                                      className="cms-action-btn"
                                      onClick={() => setEditing(record)}
                                      title="Edit event"
                                    >
                                      <PencilSimple size={16} weight="bold" />
                                    </button>
                                    <button
                                      type="button"
                                      className="cms-action-btn cms-action-btn--danger"
                                      onClick={() => handleDelete(record)}
                                      title="Delete event"
                                    >
                                      <Trash size={16} weight="bold" />
                                    </button>
                                  </div>
                                </td>
                              </>
                            )}

                            {/* COLLECTIONS ROW */}
                            {resource === "collections" && (
                              <>
                                <td className="cms-td">
                                  <div className="cms-thumbnail-cell">
                                    {record.image ? (
                                      <div className="cms-thumb-wrapper">
                                        <Image
                                          src={String(record.image)}
                                          alt=""
                                          width={40}
                                          height={40}
                                          className="cms-thumb"
                                        />
                                      </div>
                                    ) : (
                                      <div className="cms-thumb-placeholder">
                                        <CardsThree size={18} />
                                      </div>
                                    )}
                                    <div className="cms-title-cell">
                                      <button
                                        type="button"
                                        className="cms-cell-title-btn"
                                        onClick={() => setEditing(record)}
                                      >
                                        {String(record.title)}
                                      </button>
                                      <span className="cms-cell-slug">/collections/{String(record.slug)}</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="cms-td">
                                  <span className="cms-cell-text">{String(record.curator ?? "—")}</span>
                                </td>
                                <td className="cms-td">
                                  <span className="cms-tag">{String(record.game ?? "—")}</span>
                                </td>
                                <td className="cms-td">
                                  <span className="cms-cell-text">{String(record.era ?? record.format ?? "—")}</span>
                                </td>
                                <td className="cms-td">
                                  <button
                                    type="button"
                                    onClick={() => handleTogglePublish(record)}
                                    className={`cms-status-pill ${record.published ? "cms-status-pill--published" : "cms-status-pill--draft"}`}
                                    title="Click to toggle publish status"
                                  >
                                    {record.published ? "Published" : "Draft"}
                                  </button>
                                </td>
                                <td className="cms-td cms-td--actions">
                                  <div className="cms-row-actions">
                                    {Boolean(record.slug) && (
                                      <Link
                                        href={`/collections/${record.slug}`}
                                        target="_blank"
                                        className="cms-action-btn"
                                        title="View live collection"
                                      >
                                        <Eye size={16} weight="bold" />
                                      </Link>
                                    )}
                                    <button
                                      type="button"
                                      className="cms-action-btn"
                                      onClick={() => setEditing(record)}
                                      title="Edit collection"
                                    >
                                      <PencilSimple size={16} weight="bold" />
                                    </button>
                                    <button
                                      type="button"
                                      className="cms-action-btn cms-action-btn--danger"
                                      onClick={() => handleDelete(record)}
                                      title="Delete collection"
                                    >
                                      <Trash size={16} weight="bold" />
                                    </button>
                                  </div>
                                </td>
                              </>
                            )}

                            {/* GUIDES ROW */}
                            {resource === "guides" && (
                              <>
                                <td className="cms-td">
                                  <div className="cms-thumbnail-cell">
                                    {record.image ? (
                                      <div className="cms-thumb-wrapper">
                                        <Image
                                          src={String(record.image)}
                                          alt=""
                                          width={40}
                                          height={40}
                                          className="cms-thumb"
                                        />
                                      </div>
                                    ) : (
                                      <div className="cms-thumb-placeholder">
                                        <BookOpenText size={18} />
                                      </div>
                                    )}
                                    <div className="cms-title-cell">
                                      <button
                                        type="button"
                                        className="cms-cell-title-btn"
                                        onClick={() => setEditing(record)}
                                      >
                                        {String(record.title)}
                                      </button>
                                      <span className="cms-cell-slug">/guides/{String(record.slug)}</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="cms-td">
                                  <span className="cms-tag">{String(record.category ?? "Guide")}</span>
                                </td>
                                <td className="cms-td">
                                  <span className="cms-cell-text">{String(record.read_time ?? "—")}</span>
                                </td>
                                <td className="cms-td">
                                  <span className="cms-cell-text">{formatDate(record.published_at)}</span>
                                </td>
                                <td className="cms-td">
                                  <button
                                    type="button"
                                    onClick={() => handleTogglePublish(record)}
                                    className={`cms-status-pill ${record.published ? "cms-status-pill--published" : "cms-status-pill--draft"}`}
                                    title="Click to toggle publish status"
                                  >
                                    {record.published ? "Published" : "Draft"}
                                  </button>
                                </td>
                                <td className="cms-td cms-td--actions">
                                  <div className="cms-row-actions">
                                    {Boolean(record.slug) && (
                                      <Link
                                        href={`/guides/${record.slug}`}
                                        target="_blank"
                                        className="cms-action-btn"
                                        title="View live guide"
                                      >
                                        <Eye size={16} weight="bold" />
                                      </Link>
                                    )}
                                    <button
                                      type="button"
                                      className="cms-action-btn"
                                      onClick={() => setEditing(record)}
                                      title="Edit guide"
                                    >
                                      <PencilSimple size={16} weight="bold" />
                                    </button>
                                    <button
                                      type="button"
                                      className="cms-action-btn cms-action-btn--danger"
                                      onClick={() => handleDelete(record)}
                                      title="Delete guide"
                                    >
                                      <Trash size={16} weight="bold" />
                                    </button>
                                  </div>
                                </td>
                              </>
                            )}

                            {/* SPONSORS ROW */}
                            {resource === "sponsors" && (
                              <>
                                <td className="cms-td">
                                  <div className="cms-thumbnail-cell">
                                    {record.logo ? (
                                      <div className="cms-thumb-wrapper">
                                        <Image
                                          src={String(record.logo)}
                                          alt=""
                                          width={40}
                                          height={40}
                                          className="cms-thumb"
                                        />
                                      </div>
                                    ) : (
                                      <div className="cms-thumb-placeholder">
                                        <Handshake size={18} />
                                      </div>
                                    )}
                                    <button
                                      type="button"
                                      className="cms-cell-title-btn"
                                      onClick={() => setEditing(record)}
                                    >
                                      {String(record.name)}
                                    </button>
                                  </div>
                                </td>
                                <td className="cms-td">
                                  <span
                                    className={`cms-tier-badge cms-tier-badge--${String(record.tier ?? "community").toLowerCase()}`}
                                  >
                                    {String(record.tier ?? "Community")}
                                  </span>
                                </td>
                                <td className="cms-td">
                                  {record.url ? (
                                    <a
                                      href={String(record.url)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="cms-cell-link"
                                    >
                                      <span>Visit link</span>
                                      <ArrowSquareOut size={13} weight="bold" />
                                    </a>
                                  ) : (
                                    <span className="cms-cell-muted">None</span>
                                  )}
                                </td>
                                <td className="cms-td">
                                  <span className="cms-cell-text">#{String(record.display_order ?? "10")}</span>
                                </td>
                                <td className="cms-td">
                                  <span
                                    className={`cms-badge ${record.active ? "cms-badge--success" : "cms-badge--muted"}`}
                                  >
                                    {record.active ? "Active" : "Inactive"}
                                  </span>
                                </td>
                                <td className="cms-td">
                                  <button
                                    type="button"
                                    onClick={() => handleTogglePublish(record)}
                                    className={`cms-status-pill ${record.published ? "cms-status-pill--published" : "cms-status-pill--draft"}`}
                                    title="Click to toggle publish status"
                                  >
                                    {record.published ? "Published" : "Draft"}
                                  </button>
                                </td>
                                <td className="cms-td cms-td--actions">
                                  <div className="cms-row-actions">
                                    <button
                                      type="button"
                                      className="cms-action-btn"
                                      onClick={() => setEditing(record)}
                                      title="Edit sponsor"
                                    >
                                      <PencilSimple size={16} weight="bold" />
                                    </button>
                                    <button
                                      type="button"
                                      className="cms-action-btn cms-action-btn--danger"
                                      onClick={() => handleDelete(record)}
                                      title="Delete sponsor"
                                    >
                                      <Trash size={16} weight="bold" />
                                    </button>
                                  </div>
                                </td>
                              </>
                            )}

                            {/* TESTIMONIALS ROW */}
                            {resource === "testimonials" && (
                              <>
                                <td className="cms-td">
                                  <div className="cms-title-cell">
                                    <button
                                      type="button"
                                      className="cms-cell-title-btn"
                                      onClick={() => setEditing(record)}
                                    >
                                      {String(record.name)}
                                    </button>
                                    <span className="cms-cell-slug">{String(record.role ?? record.organization ?? "Collector")}</span>
                                  </div>
                                </td>
                                <td className="cms-td">
                                  <span className="cms-tag">{String(record.audience ?? "Attendee")}</span>
                                </td>
                                <td className="cms-td">
                                  <p className="cms-cell-quote">
                                    &ldquo;{String(record.quote ?? "").slice(0, 95)}
                                    {String(record.quote ?? "").length > 95 ? "…" : ""}&rdquo;
                                  </p>
                                </td>
                                <td className="cms-td">
                                  <span
                                    className={`cms-badge ${record.approved ? "cms-badge--success" : "cms-badge--warning"}`}
                                  >
                                    {record.approved ? "Approved" : "Pending"}
                                  </span>
                                </td>
                                <td className="cms-td">
                                  <button
                                    type="button"
                                    onClick={() => handleTogglePublish(record)}
                                    className={`cms-status-pill ${record.published ? "cms-status-pill--published" : "cms-status-pill--draft"}`}
                                    title="Click to toggle publish status"
                                  >
                                    {record.published ? "Published" : "Draft"}
                                  </button>
                                </td>
                                <td className="cms-td cms-td--actions">
                                  <div className="cms-row-actions">
                                    <button
                                      type="button"
                                      className="cms-action-btn"
                                      onClick={() => setEditing(record)}
                                      title="Edit testimonial"
                                    >
                                      <PencilSimple size={16} weight="bold" />
                                    </button>
                                    <button
                                      type="button"
                                      className="cms-action-btn cms-action-btn--danger"
                                      onClick={() => handleDelete(record)}
                                      title="Delete testimonial"
                                    >
                                      <Trash size={16} weight="bold" />
                                    </button>
                                  </div>
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Rebuilt Modal Editor */}
      {editing && resource !== "settings" && (
        <CmsEditorModal
          resource={resource as Exclude<CmsResource, "settings">}
          record={editing}
          onSaved={handleRecordSaved}
          onCancel={() => setEditing(null)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
