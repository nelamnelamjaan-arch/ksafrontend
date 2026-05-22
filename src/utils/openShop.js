/** Client mirror of server ENABLE_OPEN_SHOP (default on when unset). */
export function isOpenShopEnabled() {
  const v = import.meta.env.VITE_ENABLE_OPEN_SHOP;
  if (v === undefined || v === "") return true;
  return v === "true" || v === "1";
}
