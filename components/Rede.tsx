import { testimonials } from "@/data/testimonials.ts";

/**
 * A rede de pessoas: anéis pontilhados girando, com rostos em órbita.
 *
 * Veio do `network.html` que estava na raiz do projeto. Duas mudanças em
 * relação ao original, ambas por causa de como este site é feito:
 *
 * • Lá o desenho era montado por `innerHTML` no navegador. Aqui ele é
 *   servido pronto — o site não tem ilha nenhuma, e um componente
 *   decorativo não é motivo para abrir exceção.
 *
 * • Os valores por órbita (ângulo, raio, tamanho) saem num bloco `<style>`,
 *   não em atributo `style`. A CSP usa nonce, e não existe nonce que se
 *   aplique a atributo — o Fresh assina blocos inline, então é por ali.
 *
 * As posições e tempos são os do original, sem ajuste.
 */

/** Raio em px (palco 576) e em `cqi`; cada anel gira para um lado. */
const ANEIS = [
  { px: 58, r: 10.07, dur: "90s", dir: "normal" },
  { px: 106, r: 18.40, dur: "115s", dir: "reverse" },
  { px: 154, r: 26.74, dur: "145s", dir: "normal" },
  { px: 202, r: 35.07, dur: "175s", dir: "reverse" },
  { px: 248, r: 43.06, dur: "210s", dir: "normal" },
  { px: 283, r: 49.13, dur: "250s", dir: "reverse" },
] as const;

type Tipo = "av" | "soft" | "mint" | "gray";

/** [anel, ângulo°, tamanho em cqi, tipo] — 0° é o topo, cresce no horário. */
const ITENS: [number, number, number, Tipo][] = [
  [0, -150, 9.72, "av"],
  [0, -30, 8.68, "av"],
  [0, 90, 8.33, "av"],
  [1, 126, 8.68, "av"],
  [1, -30, 2.08, "mint"],
  [1, 30, 1.74, "mint"],
  [1, -170, 1.39, "mint"],
  [1, -100, 1.39, "gray"],
  [2, -170, 9.38, "soft"],
  [2, -115, 8.68, "av"],
  [2, -60, 9.38, "av"],
  [2, -5, 8.68, "soft"],
  [2, 50, 9.38, "av"],
  [2, 110, 1.39, "gray"],
  [3, -140, 9.03, "av"],
  [3, -40, 1.39, "gray"],
  [3, 60, 1.39, "gray"],
  [4, -120, 9.03, "av"],
  [4, -70, 8.33, "av"],
  [4, -19, 9.72, "av"],
  [4, 30, 9.38, "av"],
  [4, 80, 1.74, "mint"],
  [4, 140, 2.08, "mint"],
  [5, -160, 8.68, "av"],
  [5, 20, 9.03, "av"],
  [5, -95, 2.08, "mint"],
];

/**
 * Os rostos das órbitas.
 *
 * Começa pelos sete depoimentos — são clientes de verdade, com nome na
 * página logo ao lado. As sete posições restantes usam fotos que o site já
 * tem; nenhuma leva nome, então ninguém é apresentado como cliente sem ser.
 */
const ROSTOS = [
  ...testimonials.map((d) => d.foto),
  "/img/empreendedor.webp",
  "/img/agencia.webp",
  "/img/freelancer.webp",
  "/img/trefego.webp",
  "/img/designer.webp",
  "/img/2.webp",
  "/img/4.webp",
];

const CLASSE: Record<Tipo, string> = {
  av: "",
  soft: " orbe--suave",
  mint: " orbe--menta",
  gray: " orbe--cinza",
};

export function Rede() {
  let proximoRosto = 0;

  const regras: string[] = ANEIS.map((a, i) =>
    `.rede-r${i}{--dur:${a.dur};--dir:${a.dir};--contra:${
      a.dir === "normal" ? "reverse" : "normal"
    }}`
  );

  const orbitas = ANEIS.map((anel, i) => {
    const orbes = ITENS
      .map((item, idx) => [item, idx] as const)
      .filter(([item]) => item[0] === i)
      .map(([[, ang, tam, tipo], idx]) => {
        regras.push(
          `.rede-o${idx}{--a:${ang}deg;--r:${anel.r}cqi;--size:${tam}cqi}`,
        );
        const rosto = tipo === "av"
          ? ROSTOS[proximoRosto++ % ROSTOS.length]
          : null;
        if (rosto) {
          // Sem aspas dentro do `url()`: o conteúdo do <style> passa por escape
          // de HTML, e as aspas viravam `&quot;` dentro do caminho.
          regras.push(`.rede-o${idx} > span{background-image:url(${rosto})}`);
        }
        return (
          <span key={idx} class={`orbe rede-o${idx}${CLASSE[tipo]}`}>
            <span></span>
          </span>
        );
      });
    return <div key={i} class={`orbita rede-r${i}`}>{orbes}</div>;
  });

  return (
    <div class="rede" aria-hidden="true">
      <style>{regras.join("")}</style>
      <svg class="rede__aneis" viewBox="0 0 576 576">
        {ANEIS.map((a, i) => (
          <circle key={i} class={`rede-r${i}`} cx="288" cy="288" r={a.px} />
        ))}
      </svg>
      {orbitas}
    </div>
  );
}
