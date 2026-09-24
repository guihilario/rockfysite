import { assertEquals } from "jsr:@std/assert@1";
import { redirectPermitido, voltaDoLogin } from "./redirect.ts";

Deno.test("aceita o callback do Grok e o localhost", () => {
  assertEquals(redirectPermitido("https://grok.com/connectors/callback"), true);
  assertEquals(redirectPermitido("http://127.0.0.1:8787/cb"), true);
  assertEquals(redirectPermitido("https://evil.com/cb"), false);
  assertEquals(redirectPermitido("http://grok.com/cb"), false);
});

Deno.test("a volta do login só aponta para a tela de autorização", () => {
  assertEquals(
    voltaDoLogin("%2Foauth%2Fauthorize%3Fclient_id%3Dabc"),
    "/oauth/authorize?client_id=abc",
  );
  assertEquals(voltaDoLogin("%2F%2Fevil.com"), null);
  assertEquals(voltaDoLogin("%2Fmydash"), null);
  assertEquals(
    voltaDoLogin(
      encodeURIComponent(
        "/oauth/authorize?redirect_uri=https%3A%2F%2Fgrok.com%2Fcb",
      ),
    ),
    "/oauth/authorize?redirect_uri=https%3A%2F%2Fgrok.com%2Fcb",
  );
});
