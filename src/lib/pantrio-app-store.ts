/**
 * Pantrio App Store links — used by `/pantrio` for Reddit / in-app browsers.
 *
 * On iOS, `itms-apps://…` opens the native App Store app (best-effort for WKWebView).
 * Elsewhere, the HTTPS App Store URL opens in the browser.
 */
export const PANTRIO_APP_STORE_WEB_URL =
  "https://apps.apple.com/us/app/pantrio-ai/id6763900379" as const;

/** Canonical iTunes-style deep link; opens the App Store app on iPhone/iPad. */
export const PANTRIO_APP_STORE_ITMS_URL =
  "itms-apps://itunes.apple.com/app/id6763900379" as const;

export function pantrioAppStoreDestination(userAgent: string | null): string {
  const ua = userAgent ?? "";
  const isIOS =
    /iPhone|iPad|iPod/.test(ua) ||
    (/\bMacintosh\b/.test(ua) && /\bMobile\b/.test(ua));
  return isIOS ? PANTRIO_APP_STORE_ITMS_URL : PANTRIO_APP_STORE_WEB_URL;
}
