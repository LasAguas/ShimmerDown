// The sign-up itself. Proxied rather than called from the browser so the form
// slug stays server-side, and so the honeypot and the shape of the payload are
// enforced somewhere a bot can't edit.
//
// ⚠️ The dashboard SILENTLY DROPS any field the form hasn't got enabled. This
// form has email, name and city switched on (verified against
// /api/forms-public/resolve) — adding another field here does nothing until it
// is enabled in Mailing → Forms.
import { FORM_SLUG, callDashboard, methodGuard } from "../../../lib/dashboard";

const looksLikeEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v || "").trim());
const trim = (v, max) => String(v || "").trim().slice(0, max);

export default async function handler(req, res) {
  if (!methodGuard(req, res, ["POST"])) return;

  const { email, name, city, sourcePath, sessionToken, hp } = req.body || {};

  // The honeypot. A bot filled the hidden field, so answer exactly as if the
  // sign-up had worked — telling it what tripped the wire only helps it.
  if (hp) return res.status(200).json({ ok: true });

  if (!looksLikeEmail(email)) {
    return res.status(400).json({ error: "That email doesn't look right — mind checking it?" });
  }

  const payload = {
    slug: FORM_SLUG,
    email: trim(email, 254),
    // consent_id is deliberately omitted: the dashboard rejects a mismatch and
    // the wording shown on this site isn't registered there.
    consent: true,
    source_path: trim(sourcePath, 200) || "/",
    session_token: sessionToken || undefined,
  };
  if (trim(name, 120)) payload.name = trim(name, 120);
  if (trim(city, 120)) payload.city = trim(city, 120);

  const { ok, status, data } = await callDashboard("/api/forms-public/submit", {
    method: "POST",
    body: payload,
  });

  if (!ok) {
    // 404 means the form is unpublished or the slug is wrong — a
    // configuration problem, not something the visitor can fix, so they get a
    // plain apology while the real status goes to the logs.
    console.error("newsletter subscribe failed", status, data);
    return res
      .status(status === 400 ? 400 : 502)
      .json({ error: data?.error || "We couldn't sign you up just now. Try again in a minute?" });
  }

  res.status(200).json({ ok: true, pending: Boolean(data?.pending) });
}
