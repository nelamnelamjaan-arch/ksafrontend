/**
 * Normalize GET /api/products* JSON — supports legacy array and paginated `{ products, pagination }`.
 */
export function parseProductsFromJson(data) {
  if (Array.isArray(data)) {
    return { products: data, pagination: null };
  }
  if (data && Array.isArray(data.products)) {
    return { products: data.products, pagination: data.pagination || null };
  }
  return { products: [], pagination: null };
}

/** @param {Response} res */
export async function parseProductsResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      (data && typeof data.message === "string" && data.message) ||
      `Catalogue request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }
  return parseProductsFromJson(data);
}
