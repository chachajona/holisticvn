export const consentKey = "holisticvn-cookie-consent-v1";
export const consentChanged = "holisticvn:consent-changed";
/** Hash used by the footer control; the banner focuses itself when the page loads with it. */
export const preferencesHash = "cookie-preferences";

export const hasAnalyticsConsent = () =>
  document.cookie.split("; ").includes(`${consentKey}=accepted`);

export const hasConsentChoice = () =>
  document.cookie
    .split("; ")
    .some((c) => c === `${consentKey}=accepted` || c === `${consentKey}=rejected`);

/** Expire a cookie on the host and on every parent domain (GA writes `_ga*` on the registrable domain). */
function expire(name: string) {
  const labels = location.hostname.split(".");
  const domains = [undefined, ...labels.slice(0, -1).map((_, i) => labels.slice(i).join("."))];
  for (const domain of domains)
    document.cookie = `${name}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT${domain ? `; domain=${domain}` : ""}`;
}

/** Remove Google Analytics identifiers so withdrawing consent leaves no visitor ID behind. */
export function clearAnalyticsCookies() {
  for (const cookie of document.cookie.split("; ")) {
    const name = cookie.split("=")[0];
    if (/^(_ga|_gid|_gat)/.test(name)) expire(name);
  }
}

export function writeConsent(value: "accepted" | "rejected") {
  document.cookie = `${consentKey}=${value}; path=/; max-age=31536000; SameSite=Lax`;
  if (value === "rejected") clearAnalyticsCookies();
}

export function resetConsent() {
  expire(consentKey);
  clearAnalyticsCookies();
}
