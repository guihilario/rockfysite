import { encodeBase64Url } from "@/core/auth/session.ts";

/** Confere o S256: o verifier, hasheado, tem que ser o challenge enviado antes. */
export async function pkceConfere(
  verifier: string,
  challenge: string,
): Promise<boolean> {
  if (verifier.length < 43 || verifier.length > 128) return false;
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(verifier),
  );
  return encodeBase64Url(new Uint8Array(digest)) === challenge;
}
