// src/utils/urlValidation.js
export function isSupportedClipUrl(url) {
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();

    const isYouTube =
      host.includes("youtube.com") || host.includes("youtu.be");
    const isTikTok = host.includes("tiktok.com");
    const isInstagram =
      host.includes("instagram.com") &&
      (u.pathname.includes("/reel/") || u.pathname.includes("/reels/"));

    return isYouTube || isTikTok || isInstagram;
  } catch {
    return false;
  }
}
// End of urlValidation.js