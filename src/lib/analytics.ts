// PostHog analytics — cookieless, opt-out-by-default-when-unconfigured.
//
// The site is a static, per-locale marketing page. We init PostHog in cookieless
// mode (no cookies, no local storage → no consent banner needed) and capture the
// marketing funnel: pageviews (segmented by locale), the Android download click
// (the conversion), and a handful of engagement events.
//
// Graceful degradation mirrors the PUBLIC_WORDS_API_URL pattern used elsewhere:
// with no PUBLIC_POSTHOG_KEY set, initAnalytics() is a no-op and track() drops
// every event, so the page builds and behaves exactly as it did before.
import posthog from "posthog-js";
import type { Lang } from "../i18n";

const KEY = import.meta.env.PUBLIC_POSTHOG_KEY as string | undefined;

// Where events are sent.
//   unset (production) → "/ingest", the reverse proxy in netlify.toml, so ad
//                        blockers don't drop events
//   set   (local .env) → used as-is; points straight at PostHog, because
//                        `npm run dev` doesn't apply netlify.toml rewrites
// `||` rather than `??` so an empty value counts as unset.
const HOST =
    (import.meta.env.PUBLIC_POSTHOG_HOST as string | undefined) || "/ingest";

// PostHog's real app URL, so its links and toolbar don't point at our domain.
// Keep the region in step with netlify.toml.
const UI_HOST = "https://eu.posthog.com";

// Shared across every component <script> that imports this module (Astro/Vite
// dedupe the import), so `track()` sees the flag set by initAnalytics().
let ready = false;

/**
 * Initialise PostHog once, cookielessly, and wire declarative click events.
 * No-ops when no key is configured. Called from Layout.astro with the page locale.
 *
 * @param {Lang} locale The current page locale, for segmenting every event.
 * @returns {void} Returns nothing; sets `ready` so `track()` can fire events.
 *
 */
export function initAnalytics(locale: Lang): void {
    if (ready || !KEY) {
        return;
    }

    posthog.init(KEY, {
        api_host: HOST,
        ui_host: UI_HOST,
        // In-memory only: no cookies, no localStorage, no sessionStorage — so
        // no GDPR consent banner is needed. We use memory persistence rather
        // than PostHog's `cookieless_mode`, which dropped our events in practice
        // (they appeared in Live but never persisted to the warehouse). The
        // trade-off is unique-visitor precision — a returning visitor or a
        // cross-page navigation can count as a new person — which is acceptable
        // for a marketing landing page where visit → download is the metric
        // that matters.
        persistence: "memory",
        capture_pageview: true,
        capture_pageleave: true,
        // Autocapture uncaught JS errors so real-world breakage surfaces.
        capture_exceptions: true,
        cross_subdomain_cookie: false,
        person_profiles: "identified_only",
    });

    // Every event is segmentable by language (each locale is its own URL).
    posthog.register({ locale });
    ready = true;

    // Declarative events: any element carrying data-ph-event fires that event on
    // click, with its other data-ph-* attributes as properties. Powers the
    // download / CTA conversions with no per-component JS. Uses delegation so it
    // also covers elements added after init.
    document.addEventListener("click", (e) => {
        const el = (e.target as HTMLElement | null)?.closest<HTMLElement>(
            "[data-ph-event]",
        );
        const event = el?.dataset.phEvent;
        if (!event) {
            return;
        }
        track(event, phProps(el.dataset));
    });
}

/**
 * Capture a named event. No-op until initAnalytics() has run with a key.
 *
 * @param {string} event The name of the event to capture.
 * @param {Record<string, unknown>} [props] Optional properties to attach to the event.
 * @returns {void} Returns nothing; sends the event to PostHog if ready.
 *
 */
export function track(event: string, props?: Record<string, unknown>): void {
    if (!ready) {
        return;
    }
    posthog.capture(event, props);
}

/**
 * Turn an element's data-ph-* attributes into event properties, dropping the
 * event name itself: data-ph-platform="android" → { platform: "android" }.
 *
 * @param {DOMStringMap} dataset The dataset of the element containing data-ph-* attributes.
 * @returns {Record<string, string>} An object containing the event properties.
 *
 */
function phProps(dataset: DOMStringMap): Record<string, string> {
    const props: Record<string, string> = {};
    for (const [key, value] of Object.entries(dataset)) {
        if (key === "phEvent" || !key.startsWith("ph") || value == null) {
            continue;
        }
        const name = key.slice(2); // strip the "ph" prefix
        props[name.charAt(0).toLowerCase() + name.slice(1)] = value;
    }
    return props;
}
