import { assertEquals, assertThrows } from "jsr:@std/assert@1";
import {
  bytesDaDataUrl,
  ErroDeCapa,
  ipPrivado,
  origemDeImagem,
} from "./capa_origem.ts";

function dataUrlDe(bytes: number): string {
  const bruto = new Uint8Array(bytes).fill(65);
  let texto = "";
  for (let i = 0; i < bruto.length; i += 0x8000) {
    texto += String.fromCharCode(...bruto.subarray(i, i + 0x8000));
  }
  const base64 = btoa(texto);
  const linhas = base64.match(/.{1,76}/g)?.join("\n") ?? base64;
  return `data:image/png;base64,${linhas}`;
}

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

Deno.test("data URL de 400 KB e de 1 MB, mesmo com quebra de linha", () => {
  assertEquals(bytesDaDataUrl(dataUrlDe(400 * 1024)).length, 400 * 1024);
  assertEquals(bytesDaDataUrl(dataUrlDe(1024 * 1024)).length, 1024 * 1024);
});
