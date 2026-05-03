/**
 * Zenith App Store links — used by `/zenith` for Reddit / in-app browsers.
 *
 * On iOS, `itms-apps://…` opens the native App Store app (best-effort for WKWebView).
 * Elsewhere, the HTTPS App Store URL opens in the browser.
 */
export const ZENITH_APP_STORE_WEB_URL =
  "https://apps.apple.com/us/app/zenith-ai-fitness-coach/id6763857472" as const;

/** Canonical iTunes-style deep link; opens the App Store app on iPhone/iPad. */
export const ZENITH_APP_STORE_ITMS_URL =
  "itms-apps://itunes.apple.com/app/id6763857472" as const;

export function zenithAppStoreDestination(userAgent: string | null): string {
  const ua = userAgent ?? "";
  const isIOS =
    /iPhone|iPad|iPod/.test(ua) ||
    // iPadOS 13+ Safari "desktop" UA
    (/\bMacintosh\b/.test(ua) && /\bMobile\b/.test(ua));
  return isIOS ? ZENITH_APP_STORE_ITMS_URL : ZENITH_APP_STORE_WEB_URL;
}
