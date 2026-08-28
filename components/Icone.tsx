/** Ícones do menu. Traço de 1.6 herdando a cor do texto, como o resto do site. */
const CAMINHOS: Record<string, preact.JSX.Element> = {
  site: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <path d="M3 9h18M7 6.5h.01M10 6.5h.01" />
    </>
  ),
  wordpress: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M4 9h5l2.5 8L14 9h5M9 9l2 5" />
    </>
  ),
  deploy: (
    <>
      <path d="M12 3c3.5 2.2 5.5 5.6 5.5 9.5L12 17l-5.5-4.5C6.5 8.6 8.5 5.2 12 3Z" />
      <circle cx="12" cy="10" r="1.8" />
      <path d="M9 18.5 7.5 21M15 18.5 16.5 21" />
    </>
  ),
  loja: (
    <>
      <path d="M4 7h16l-1.2 11.2A2 2 0 0 1 16.8 20H7.2a2 2 0 0 1-2-1.8L4 7Z" />
      <path d="M9 10V6a3 3 0 0 1 6 0v4" />
    </>
  ),
  email: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7 8 5.5L20 7" />
    </>
  ),
  blog: (
    <>
      <path d="M5 4h11l3 3v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" />
      <path d="M8 11h8M8 15h5" />
    </>
  ),
  ajuda: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.6 9.4a2.5 2.5 0 1 1 3.2 2.9c-.6.2-.9.7-.9 1.3v.4" />
      <path d="M12 17.2h.01" />
    </>
  ),
};

export function Icone({ nome }: { nome: string }) {
  const d = CAMINHOS[nome];
  if (!d) return null;
  return (
    <svg
      class="menu-icone"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      {d}
    </svg>
  );
}
