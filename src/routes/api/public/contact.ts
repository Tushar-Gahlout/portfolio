import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(1).max(1000),
});

const CONTACT_EMAIL = "rajputtushar119@gmail.com";

export const Route = createFileRoute("/api/public/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const parsed = contactSchema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return Response.json({ ok: false, code: "invalid" }, { status: 400 });

        const response = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            ...parsed.data,
            _subject: `Portfolio message from ${parsed.data.name}`,
            _replyto: parsed.data.email,
            _template: "table",
            _captcha: "false",
          }),
        });
        const result = (await response.json().catch(() => ({}))) as { success?: boolean | string; message?: string };
        const sent = response.ok && result.success !== false && result.success !== "false";
        if (sent) return Response.json({ ok: true });

        const activation = result.message?.toLowerCase().includes("activation") ?? false;
        return Response.json(
          { ok: false, code: activation ? "activation_required" : "delivery_failed" },
          { status: activation ? 409 : 502 },
        );
      },
    },
  },
});