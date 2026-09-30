import { useEffect, useState } from "preact/hooks";

export default function PedidoStatus({ id, pixPayload }: {
  id: string;
  pixPayload?: string;
}) {
  const [message, setMessage] = useState(
    "Aguardando confirmação do pagamento…",
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let stopped = false;
    let timer: number | undefined;
    let attempts = 0;

    async function check() {
      if (stopped) return;
      if (document.visibilityState === "hidden") {
        timer = globalThis.setTimeout(check, 10_000);
        return;
      }
      try {
        const response = await fetch(
          `/api/pedido/${encodeURIComponent(id)}/status`,
          {
            cache: "no-store",
          },
        );
        if (response.ok) {
          const result = await response.json() as { status?: string };
          if (
            ["active", "paid", "awaiting_fulfillment", "cancelled", "failed"]
              .includes(result.status ?? "")
          ) {
            setMessage("Pagamento atualizado. Abrindo seu pedido…");
            globalThis.location.reload();
            return;
          }
        }
      } catch {
        // Keep the payment page usable while a status check is unavailable.
      }
      attempts++;
      timer = globalThis.setTimeout(
        check,
        attempts < 5 ? 5_000 : attempts < 15 ? 10_000 : 30_000,
      );
    }

    timer = globalThis.setTimeout(check, 5_000);
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        if (timer !== undefined) clearTimeout(timer);
        void check();
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      stopped = true;
      if (timer !== undefined) clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [id]);

  return (
    <div class="ckout__status">
      {pixPayload && (
        <div class="ckout__pix-copy">
          <label for="pix-codigo">Código PIX copia e cola</label>
          <input id="pix-codigo" readOnly value={pixPayload} />
          <button
            type="button"
            onClick={async () => {
              await navigator.clipboard.writeText(pixPayload);
              setCopied(true);
            }}
          >
            {copied ? "Código copiado" : "Copiar código PIX"}
          </button>
        </div>
      )}
      <p role="status">{message}</p>
    </div>
  );
}
