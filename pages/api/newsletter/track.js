// Records that someone saw the sign-up form, so the dashboard can report a
// view→sign-up conversion rather than a bare total. Fire and forget: it must
// never make the page or the sign-up wait, and it must never fail loudly.
import { FORM_ID, callDashboard, methodGuard } from "../../../lib/dashboard";

export default async function handler(req, res) {
  if (!methodGuard(req, res, ["POST"])) return;

  // Without the form's id there is nothing to attribute the visit to. The
  // sign-up itself still works — this is the only thing that goes dark.
  if (!FORM_ID) return res.status(204).end();

  const { sessionToken, referrer, utm, language } = req.body || {};

  await callDashboard("/api/forms-public/track", {
    method: "POST",
    body: {
      formId: FORM_ID,
      sessionToken,
      referrer,
      utm,
      language,
    },
    timeoutMs: 4000,
  });

  // Always 204, even when the dashboard refused. A visitor cannot act on an
  // analytics failure, so telling their browser about it is only noise.
  res.status(204).end();
}
