// First-party pageview/click/conversion tracking, wired to the shared
// track-event Supabase edge function (artist_id 19 = Shimmer Down Studios).
//
// This is a plain script (not a React component) loaded once via next/script
// in pages/_app.js — it has to survive the whole SPA lifetime, so "pageview"
// means "call window.SDSTrackPageview() again", not "reload this file". See
// the routeChangeStart/routeChangeComplete wiring in _app.js: that's what
// calls SDSTrackLeaving()/SDSTrackPageview() on every client-side navigation,
// since a normal <script> only runs once and Next never reloads the page.
//
// GDPR: pageviews/clicks/UTM/geo/device are legitimate-interest, no consent
// needed. Returning-visitor detection, scroll depth and dwell time are gated
// behind the {PFX}consent cookie set by the banner below. Raw IP and raw
// User-Agent are never sent anywhere by this file; the edge function derives
// geo/device server-side and discards both.
(function () {
  'use strict';

  var ENDPOINT  = 'https://gtccctajvobfvhlonaot.supabase.co/functions/v1/track-event';
  var ARTIST_ID = 19;
  var PFX       = 'sds_'; // Shimmer Down Studios — must stay unique if this domain ever hosts another artist's tracker

  function getConsent() {
    var m = document.cookie.match(new RegExp('(?:^|;\\s*)' + PFX + 'consent=([^;]*)'));
    return m ? m[1] : null;
  }

  function setConsent(val) {
    var exp = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = PFX + 'consent=' + val + '; expires=' + exp + '; path=/; SameSite=Lax';
  }

  var consentGiven = getConsent() === 'true';

  var sessionToken = sessionStorage.getItem(PFX + 'sess');
  if (!sessionToken) {
    sessionToken = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem(PFX + 'sess', sessionToken);
  }

  var isReturning = false;
  if (consentGiven) {
    isReturning = !!document.cookie.match(new RegExp('(?:^|;\\s*)' + PFX + 'ret=1'));
    if (!isReturning) {
      var retExp = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();
      document.cookie = PFX + 'ret=1; expires=' + retExp + '; path=/; SameSite=Lax';
    }
  }

  function currentPageSlug() {
    return window.location.pathname.replace(/^\//, '').replace(/\/$/, '') || 'index';
  }

  function send(payload) {
    var urlParams = new URLSearchParams(window.location.search);
    var body = Object.assign({
      artist_id:       ARTIST_ID,
      session_token:   sessionToken,
      page_slug:       currentPageSlug(),
      referrer_url:    document.referrer ? document.referrer.slice(0, 500) : null,
      utm_source:      urlParams.get('utm_source'),
      utm_medium:      urlParams.get('utm_medium'),
      utm_campaign:    urlParams.get('utm_campaign'),
      utm_content:     urlParams.get('utm_content'),
      utm_term:        urlParams.get('utm_term'),
      screen_width_px: window.screen ? window.screen.width : null,
      language:        navigator.language || null,
      consent_given:   consentGiven,
      is_returning:    isReturning,
    }, payload);
    try {
      fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), keepalive: true }).catch(function () {});
    } catch (e) {}
  }

  function track(eventType, props) { send(Object.assign({ event_type: eventType }, props || {})); }
  window.SDSTrack = track;

  // ---- per-page engagement state ----
  // Reset on every pageview (including SPA route changes), not just once at
  // script load, so scroll/dwell numbers attach to the page that's actually
  // on screen instead of piling onto whichever page happened to load first.
  var pageStart = Date.now();
  var scrollFired = {};
  var engagementTimers = [];
  var hasTrackedFirstPageview = false;

  function clearEngagementTimers() {
    engagementTimers.forEach(clearTimeout);
    engagementTimers = [];
  }

  function patchDuration() {
    send({ event_type: '_session_end', duration_seconds: Math.round((Date.now() - pageStart) / 1000) });
  }

  // Called right before a client-side navigation leaves the current page
  // (routeChangeStart in _app.js), while window.location still points at the
  // page being left — this is what makes the dwell number land on the right slug.
  window.SDSTrackLeaving = function () {
    if (hasTrackedFirstPageview) patchDuration();
  };

  function pageview() {
    hasTrackedFirstPageview = true;
    pageStart = Date.now();
    scrollFired = {};
    clearEngagementTimers();
    if (consentGiven) {
      [15, 30, 60, 120].forEach(function (sec) {
        engagementTimers.push(setTimeout(function () {
          if (document.visibilityState !== 'hidden') track('engagement', { time_on_page_seconds: sec });
        }, sec * 1000));
      });
    }
    track('pageview');
  }
  window.SDSTrackPageview = pageview;
  pageview();

  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') patchDuration(); });
  window.addEventListener('pagehide', patchDuration);

  window.addEventListener('scroll', function () {
    if (!consentGiven) return;
    var pct = Math.round(((window.scrollY + window.innerHeight) / (document.documentElement.scrollHeight || 1)) * 100);
    [25, 50, 75, 90].forEach(function (m) {
      if (!scrollFired[m] && pct >= m) { scrollFired[m] = true; track('scroll_milestone', { scroll_depth_pct: m }); }
    });
  }, { passive: true });

  // ---- click delegation ----
  // Works for Next <Link> too: its onClick doesn't stopPropagation, so the
  // native click still bubbles to this document-level listener.
  document.addEventListener('click', function (e) {
    var el = e.target;
    while (el && el !== document.body) {
      if (el.dataset && el.dataset.trackType) {
        track('click_' + el.dataset.trackType, {
          link_label:       el.dataset.trackLabel    || (el.textContent || '').trim().slice(0, 100),
          link_destination: el.dataset.trackDest     || el.href         || null,
          link_platform:    el.dataset.trackPlatform || null,
          link_category:    el.dataset.trackCategory || el.dataset.trackType || null,
        });
        return;
      }
      el = el.parentElement;
    }
  });

  // ---- consent banner ----
  if (getConsent() === null) {
    var banner = document.createElement('div');
    banner.id = PFX + 'consent-banner';
    banner.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:99999;background:rgba(10,10,10,0.97);border-top:1px solid rgba(255,255,255,0.15);padding:1rem 1.5rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.75rem;font-size:0.8rem;color:#f8f8f8;font-family:sans-serif';
    banner.innerHTML = '<span>We use cookies to improve your experience. <a href="/impressum" style="color:#aaa;text-decoration:underline">Privacy policy</a></span><span style="display:flex;gap:0.6rem;flex-shrink:0"><button id="' + PFX + 'decline" style="padding:0.4rem 0.9rem;border:1px solid rgba(255,255,255,0.3);background:transparent;color:#f8f8f8;cursor:pointer;font-size:0.75rem;border-radius:3px">Essential only</button><button id="' + PFX + 'accept" style="padding:0.4rem 0.9rem;border:1px solid #fff;background:#fff;color:#000;cursor:pointer;font-size:0.75rem;border-radius:3px;font-weight:bold">Accept</button></span>';
    document.body.appendChild(banner);

    document.getElementById(PFX + 'accept').addEventListener('click', function () {
      setConsent('true'); consentGiven = true; banner.remove();
      if (!isReturning) { var e = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString(); document.cookie = PFX + 'ret=1; expires=' + e + '; path=/; SameSite=Lax'; }
      pageStart = Date.now(); // dwell/scroll only start counting from consent, not from page load
      if (!engagementTimers.length) {
        [15, 30, 60, 120].forEach(function (sec) {
          engagementTimers.push(setTimeout(function () {
            if (document.visibilityState !== 'hidden') track('engagement', { time_on_page_seconds: sec });
          }, sec * 1000));
        });
      }
      track('consent_granted');
    });
    document.getElementById(PFX + 'decline').addEventListener('click', function () { setConsent('false'); banner.remove(); });
  }
})();
