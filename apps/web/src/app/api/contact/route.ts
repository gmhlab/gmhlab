import { isEmailAddress } from "@gmhlab/core";
import { CONTACT_TOPICS } from "@/content";
import { oneLine, sendMail } from "@/server/mail";

/**
 * Delivers a contact-form inquiry to the Center's inbox. Every route goes to
 * the same address today; the route's label leads the subject so the inbox
 * can filter on it. Reply-To is the sender.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const field = (key: string) =>
    typeof body?.[key] === "string" ? (body[key] as string).trim() : "";

  const name = field("name");
  const email = field("email");
  const organization = field("organization");
  const message = field("message");
  const topic = CONTACT_TOPICS.find((t) => t.id === field("topic"));

  if (!name || !isEmailAddress(email) || !message || message.length > 10_000) {
    return Response.json(
      { error: "Please check your name, email and message, then try again." },
      { status: 400 },
    );
  }

  const route = topic?.label ?? "General inquiry";
  try {
    await sendMail({
      subject: `[Website] ${route} — ${oneLine(name, 80)}`,
      replyTo: email,
      text: [
        `Route: ${route}`,
        `Name: ${oneLine(name)}`,
        `Email: ${email}`,
        `Organization: ${oneLine(organization) || "—"}`,
        "",
        message,
      ].join("\n"),
    });
  } catch (error) {
    console.error("contact: send failed", error);
    return Response.json(
      { error: "Your message didn't go through. Please try again, or email us directly." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
