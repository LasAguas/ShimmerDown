// The receipt. Stripe sends the buyer back to /store?session_id=… and the shop
// calls this once to turn that id into an order it can show them.
import { callDashboard, methodGuard } from "../../../lib/dashboard";

export default async function handler(req, res) {
  if (!methodGuard(req, res, ["POST"])) return;

  const sessionId = String(req.body?.sessionId || "").trim();
  if (!sessionId) return res.status(400).json({ error: "missing_session" });

  const { ok, status, data } = await callDashboard("/api/store-public/confirm", {
    method: "POST",
    // The dashboard reads `session_id` (snake_case). Sent as `sessionId` it
    // answers 400 "session_id required", this route turns that into a 502,
    // and the shop swallows it — the buyer has paid and simply never sees a
    // receipt, the cart isn't cleared, and the conversion event never fires.
    body: { session_id: sessionId },
  });

  if (!ok) {
    console.error("store confirm failed", status, data);
    return res.status(502).json({ error: "confirm_failed" });
  }

  res.status(200).json(data);
}
