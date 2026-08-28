import { Builder } from "fresh/dev";

const builder = new Builder();

if (Deno.args.includes("build")) {
  // Gera _fresh/ (server.js + assets). O build varre o próprio projeto.
  await builder.build();
} else {
  await builder.listen(() => import("./main.ts"), { port: 8000 });
}
