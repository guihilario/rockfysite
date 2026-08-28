import { S3Client } from "s3-lite-client";
import { config } from "@/core/config.ts";

// Todas as operações de storage passam por aqui — nunca chamadas S3
// espalhadas pelas rotas (SPEC §20).
const client = new S3Client({
  endPoint: `${config.r2.accountId}.r2.cloudflarestorage.com`,
  region: "auto",
  accessKey: config.r2.accessKeyId,
  secretKey: config.r2.secretAccessKey,
  bucket: config.r2.bucketName,
  pathStyle: true,
});

export async function putObject(
  key: string,
  data: Uint8Array,
  contentType: string,
): Promise<void> {
  await client.putObject(key, data, {
    metadata: { "Content-Type": contentType },
  });
}

export async function deleteObject(key: string): Promise<void> {
  await client.deleteObject(key);
}

/** URL pública final de um objeto — sempre via `R2_PUBLIC_URL` (domínio
 * custom ou `*.r2.dev`), nunca a URL da API do R2 (SPEC §20). */
export function getPublicUrl(key: string): string {
  return `${config.r2.publicUrl}/${key}`;
}

/**
 * Se `url` aponta pra um objeto nosso no R2, devolve a key (pra poder
 * excluir depois); senão `null` — nunca tenta apagar uma URL externa
 * colada manualmente antes da Fase 6.
 */
export function keyFromPublicUrl(url: string): string | null {
  const prefix = `${config.r2.publicUrl}/`;
  return url.startsWith(prefix) ? url.slice(prefix.length) : null;
}
