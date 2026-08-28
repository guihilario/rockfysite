import { DOMParser, type Element } from "deno-dom";
import { slugify } from "./slugify.ts";

// Conteúdo de post é HTML vindo do editor (Quill) no admin — nunca deve
// chegar ao HTML final sem tratamento, mesmo que já tenha passado por um
// editor "confiável": alguém pode enviar POST direto pro endpoint pulando a
// UI (SPEC §15). Allowlist de tags e atributos; tudo fora dela é removido.

// Tags perigosas: removidas inteiras, junto com o conteúdo.
const STRIP_ENTIRELY = new Set([
  "script",
  "style",
  "iframe",
  "object",
  "embed",
  "form",
  "input",
  "button",
  "select",
  "textarea",
  "svg",
  "math",
  "link",
  "meta",
  "base",
  "noscript",
]);

// Tags permitidas e os atributos aceitos em cada uma. Fora daqui, a tag é
// "desembrulhada" (mantém o conteúdo, descarta a tag).
const ALLOWED_TAGS: Record<string, Set<string>> = {
  p: new Set(["class"]),
  br: new Set(),
  hr: new Set(),
  strong: new Set(),
  b: new Set(),
  em: new Set(),
  i: new Set(),
  u: new Set(),
  s: new Set(),
  del: new Set(),
  a: new Set(["href"]),
  ul: new Set(["class"]),
  ol: new Set(["class"]),
  li: new Set(["class"]),
  blockquote: new Set(),
  pre: new Set(),
  code: new Set(),
  h2: new Set(["id"]),
  h3: new Set(["id"]),
  h4: new Set(),
  img: new Set(["src", "alt", "width", "height"]),
  table: new Set(),
  thead: new Set(),
  tbody: new Set(),
  tr: new Set(),
  td: new Set(),
  th: new Set(),
  span: new Set(["class"]),
  figure: new Set(),
  figcaption: new Set(),
};

// Classes do Quill seguem o padrão `ql-*` (alinhamento, indentação...).
// Qualquer outra classe é descartada.
const ALLOWED_CLASS = /^ql-[a-z0-9-]+$/;

function isSafeUrl(value: string): boolean {
  const trimmed = value.trim().toLowerCase();
  if (trimmed.startsWith("/") || trimmed.startsWith("#")) return true;
  return (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("mailto:")
  );
}

function sanitizeAttributes(el: Element) {
  const tag = el.tagName.toLowerCase();
  const allowed = ALLOWED_TAGS[tag] ?? new Set<string>();

  for (const attr of Array.from(el.attributes)) {
    const name = attr.name.toLowerCase();

    if (!allowed.has(name)) {
      el.removeAttribute(attr.name);
      continue;
    }
    if (name === "class") {
      const kept = attr.value.split(/\s+/).filter((c) => ALLOWED_CLASS.test(c));
      if (kept.length === 0) el.removeAttribute(attr.name);
      else el.setAttribute("class", kept.join(" "));
      continue;
    }
    if ((name === "href" || name === "src") && !isSafeUrl(attr.value)) {
      el.removeAttribute(attr.name);
    }
  }
}

function unwrap(el: Element) {
  el.replaceWith(...Array.from(el.childNodes));
}

function walk(el: Element) {
  // childNodes muda durante a iteração (unwrap/remove); percorrer uma cópia.
  for (const child of Array.from(el.children)) {
    const tag = child.tagName.toLowerCase();

    if (STRIP_ENTIRELY.has(tag)) {
      child.remove();
      continue;
    }
    if (!(tag in ALLOWED_TAGS)) {
      unwrap(child);
      // Os filhos do elemento desembrulhado ainda precisam ser sanitizados;
      // como agora são filhos diretos de `el`, o loop atual não os revisita
      // — trata recursivamente aqui mesmo.
      walk(el);
      return;
    }

    sanitizeAttributes(child);
    walk(child);
  }
}

export type Heading = { id: string; text: string; level: 2 | 3 };

export type SanitizedContent = {
  html: string;
  headings: Heading[];
};

/**
 * Sanitiza HTML de post com allowlist e injeta `id` em h2/h3 pro menu
 * lateral automático (SPEC §42). Idempotente: pode rodar de novo em cima
 * de HTML já sanitizado sem alterar nada.
 */
export function sanitizeContent(html: string): SanitizedContent {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const body = doc?.body;
  if (!body) return { html: "", headings: [] };

  walk(body as unknown as Element);

  const headings: Heading[] = [];
  const usedIds = new Set<string>();

  for (const heading of Array.from(body.querySelectorAll("h2, h3"))) {
    const el = heading as unknown as Element;
    const text = el.textContent.trim();
    if (!text) continue;

    let id = slugify(text) || "secao";
    let suffix = 2;
    while (usedIds.has(id)) {
      id = `${slugify(text) || "secao"}-${suffix++}`;
    }
    usedIds.add(id);
    el.setAttribute("id", id);

    headings.push({
      id,
      text,
      level: el.tagName.toLowerCase() === "h2" ? 2 : 3,
    });
  }

  return { html: body.innerHTML, headings };
}
