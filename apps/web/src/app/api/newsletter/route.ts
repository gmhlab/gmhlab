import { isEmailAddress } from "@gmhlab/core";
import { sendMail } from "@/server/mail";

/**
 * Records a footer newsletter signup by emailing the address to the Center's
 * inbox — there is no mailing-list provider yet, so someone adds it to the
 * list by hand. Swap this for the provider's API once the Center has one.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";

  if (!isEmailAddress(email)) {
    return Response.json(
      { error: "Please check that address and try again." },
      { status: 400 },
    );
  }

  try {
    await sendMail({
      subject: `[Website] Newsletter signup — ${email}`,
      replyTo: email,
      text: `${email} signed up for the newsletter from the website footer.`,
    });
  } catch (error) {
    console.error("newsletter: send failed", error);
    return Response.json(
      { error: "We couldn't add that address. Please try again." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
