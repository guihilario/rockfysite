import { assertEquals, assertThrows } from "jsr:@std/assert@1";
import { ErroDeCapa, ipPrivado, origemDeImagem } from "./capa_origem.ts";

Deno.test("recusa endereço interno e aceita https público", () => {
  assertEquals(ipPrivado("127.0.0.1"), true);
  assertEquals(ipPrivado("10.1.2.3"), true);
  assertEquals(ipPrivado("192.168.0.4"), true);
  assertEquals(ipPrivado("169.254.169.254"), true);
  assertEquals(ipPrivado("172.16.0.1"), true);
  assertEquals(ipPrivado("8.8.8.8"), false);
  const publica = origemDeImagem("https://files.example.com/capa.png");
  assertEquals(
    publica instanceof URL ? publica.hostname : "",
    "files.example.com",
  );
  assertEquals(
    origemDeImagem("data:image/png;base64,aaaa"),
    "data",
  );
  assertThrows(
    () => origemDeImagem("http://files.example.com/capa.png"),
    ErroDeCapa,
  );
  assertThrows(() => origemDeImagem("https://127.0.0.1/capa.png"), ErroDeCapa);
  assertThrows(
    () => origemDeImagem("https://169.254.169.254/latest"),
    ErroDeCapa,
  );
});
