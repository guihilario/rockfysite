export type ListQuery = {
  q?: string;
  tag?: string;
  /** Slug de subcategoria (ex.: `?category=dominios` dentro de /ajuda). */
  category?: string;
  page?: number;
};

/** Monta a URL de uma página de listagem preservando só os parâmetros
 * presentes — usada tanto pelos links de paginação quanto pelo form de
 * busca HTMX (SPEC §43, §44). */
export function buildListUrl(basePath: string, query: ListQuery): string {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (query.tag) params.set("tag", query.tag);
  if (query.category) params.set("category", query.category);
  if (query.page && query.page > 1) params.set("page", String(query.page));

  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}
