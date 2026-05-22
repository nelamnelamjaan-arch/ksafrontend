function isLocalDevOrigin(url) {
  try {
    const h = new URL(url).hostname;
    return h === "localhost" || h === "127.0.0.1" || h === "[::1]";
  } catch {
    return false;
  }
}

/**
 * API base for fetch/socket.
 * - Unset `VITE_API_URL`: relative `/api/...` (Vite dev proxy; Vercel client rewrites in prod).
 * - Set `VITE_API_URL`: direct calls to that origin (no trailing slash), e.g.
 *   `https://ksabackend.vercel.app` — server must allow this client in `CLIENT_ORIGIN`.
 * - Production never uses localhost; cross-origin `VITE_API_URL` falls back to same-origin
 *   `/api` so `client/vercel.json` rewrites work without CORS.
 */
export function getApiOrigin() {
  const raw = import.meta.env.VITE_API_URL;
  if (raw == null || String(raw).trim() === "") return "";
  const base = String(raw).replace(/\/+$/, "");

  if (import.meta.env.PROD) {
    if (isLocalDevOrigin(base)) return "";
    if (typeof window !== "undefined" && window.location?.origin) {
      try {
        if (new URL(base).origin !== window.location.origin) return "";
      } catch {
        return "";
      }
    }
  }

  return base;
}

export function apiUrl(path) {
  const rel = path.startsWith("/") ? path : `/${path}`;
  const base = getApiOrigin();
  return base ? `${base}${rel}` : rel;
}

/**
 * Socket.io (magic import, etc.). Override with `VITE_SOCKET_URL`; otherwise uses
 * `VITE_API_URL`, then the current page origin (Vite dev proxy).
 */
export function getSocketRoot() {
  const explicit = import.meta.env.VITE_SOCKET_URL;
  if (explicit != null && String(explicit).trim() !== "") {
    return String(explicit).replace(/\/+$/, "");
  }
  const api = getApiOrigin();
  if (api) return api;
  if (typeof window !== "undefined" && window.location?.origin) return window.location.origin;
  return "";
}
