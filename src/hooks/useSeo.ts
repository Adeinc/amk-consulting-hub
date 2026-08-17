import { useEffect } from "react";

const SITE_URL = "https://amk-consulting-hub.netlify.app";

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertCanonical(href: string) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Sets per-route title/description/canonical/OG tags on a client-rendered SPA. Helps
 * Google's JS-rendering indexer and gives correct browser-tab/bookmark titles. Does NOT help
 * non-JS social-preview crawlers (Slack, WhatsApp, some of Facebook's) — those read index.html's
 * static head only, so link previews stay generic across pages without SSR/prerendering.
 */
export function useSeo({
  title,
  description,
  path,
  noindex = false,
}: {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
}) {
  useEffect(() => {
    document.title = title;
    upsertMeta("name", "description", description);
    const url = `${SITE_URL}${path}`;
    upsertCanonical(url);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", url);
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");
  }, [title, description, path, noindex]);
}
