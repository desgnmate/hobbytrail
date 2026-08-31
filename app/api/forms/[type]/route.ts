type FormType = "contact" | "newsletter" | "vendor";

const webhookVariables: Record<FormType, string> = {
  contact: "CONTACT_FORM_WEBHOOK_URL",
  newsletter: "NEWSLETTER_FORM_WEBHOOK_URL",
  vendor: "VENDOR_EOI_WEBHOOK_URL",
};

const validTypes = new Set<FormType>(["contact", "newsletter", "vendor"]);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  return new URL(origin).host === new URL(request.url).host;
}

function sanitizePayload(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const clean: Record<string, string | boolean | string[]> = {};

  for (const [key, item] of Object.entries(value)) {
    if (typeof item === "string") clean[key] = item.trim().slice(0, 4000);
    if (typeof item === "boolean") clean[key] = item;
    if (Array.isArray(item) && item.every((entry) => typeof entry === "string")) clean[key] = item.slice(0, 20).map((entry) => entry.slice(0, 160));
  }

  return clean;
}

export async function POST(request: Request, { params }: { params: Promise<{ type: string }> }) {
  const { type: rawType } = await params;
  if (!validTypes.has(rawType as FormType)) return Response.json({ message: "Unknown form." }, { status: 404 });
  if (!isSameOrigin(request)) return Response.json({ message: "Invalid submission origin." }, { status: 403 });

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 32_000) return Response.json({ message: "Submission is too large." }, { status: 413 });

  let payload: Record<string, string | boolean | string[]> | null = null;
  try {
    payload = sanitizePayload(await request.json());
  } catch {
    return Response.json({ message: "The form data could not be read." }, { status: 400 });
  }

  if (!payload) return Response.json({ message: "The form data is incomplete." }, { status: 400 });
  if (payload.website) return Response.json({ ok: true });

  const email = typeof payload.email === "string" ? payload.email : "";
  if (!emailPattern.test(email)) return Response.json({ message: "Enter a valid email address." }, { status: 400 });
  if (rawType !== "newsletter" && (!payload.name || !payload.message)) return Response.json({ message: "Complete the required fields." }, { status: 400 });
  if (rawType === "vendor" && (!payload.businessName || payload.consent !== true)) return Response.json({ message: "Add the business name and confirm the privacy consent." }, { status: 400 });

  const type = rawType as FormType;
  const webhookUrl = process.env[webhookVariables[type]];
  if (!webhookUrl) {
    return Response.json(
      { message: "Online submissions are not connected yet. Please try again after the launch configuration is complete." },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ form: type, submittedAt: new Date().toISOString(), ...payload }),
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });

    if (!response.ok) return Response.json({ message: "We could not deliver the submission. Please try again." }, { status: 502 });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ message: "The submission service is temporarily unavailable. Please try again." }, { status: 502 });
  }
}
