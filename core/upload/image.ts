import { decode as decodePng } from "@jsquash/png";
import { decode as decodeJpeg } from "@jsquash/jpeg";
import { decode as decodeWebp, encode as encodeWebp } from "@jsquash/webp";
import resize from "@jsquash/resize";
import { normalizeOrientation, readJpegOrientation } from "./orientation.ts";

// Uploads são entrada não confiável (SPEC §18). Limites definidos aqui,
// não deixados implícitos.
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8MB
const MAX_INPUT_DIMENSION = 8000; // recusa decodificar antes disso (decode bomb)
const MAX_OUTPUT_DIMENSION = 2000; // redimensiona se passar disso

export class ImageValidationError extends Error {}

type DetectedFormat = "png" | "jpeg" | "webp";

/** Formato real pelos magic bytes — nunca por Content-Type/extensão
 * declarados pelo cliente (SPEC §18). */
function detectFormat(bytes: Uint8Array): DetectedFormat | null {
  if (bytes.length < 12) return null;

  if (
    bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return "png";
  }
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "jpeg";
  }
  const isRiff = bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 &&
    bytes[3] === 0x46;
  const isWebp = bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 &&
    bytes[11] === 0x50;
  if (isRiff && isWebp) return "webp";

  return null;
}

export type ProcessedImage = {
  webp: Uint8Array;
  width: number;
  height: number;
};

/**
 * Fluxo completo: validation → decode → normalize orientation → resize se
 * necessário → strip metadata → WebP (SPEC §19). Recodificar a partir de
 * pixels crus (`ImageData`) já descarta EXIF/ICC/etc. por construção —
 * nada de metadata sobrevive à reencodificação.
 */
export async function processUploadedImage(
  bytes: Uint8Array,
): Promise<ProcessedImage> {
  if (bytes.byteLength === 0) {
    throw new ImageValidationError("Arquivo vazio.");
  }
  if (bytes.byteLength > MAX_UPLOAD_BYTES) {
    throw new ImageValidationError(
      `Arquivo muito grande (máximo ${MAX_UPLOAD_BYTES / (1024 * 1024)}MB).`,
    );
  }

  const format = detectFormat(bytes);
  if (!format) {
    throw new ImageValidationError(
      "Formato de imagem não reconhecido. Use JPEG, PNG ou WebP.",
    );
  }

  const buffer = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer;

  let imageData: ImageData;
  try {
    if (format === "png") imageData = await decodePng(buffer);
    else if (format === "jpeg") imageData = await decodeJpeg(buffer);
    else imageData = await decodeWebp(buffer);
  } catch {
    throw new ImageValidationError(
      "Não foi possível ler a imagem — arquivo corrompido ou inválido.",
    );
  }

  if (
    imageData.width > MAX_INPUT_DIMENSION ||
    imageData.height > MAX_INPUT_DIMENSION
  ) {
    throw new ImageValidationError(
      `Imagem grande demais (máximo ${MAX_INPUT_DIMENSION}px por lado).`,
    );
  }

  if (format === "jpeg") {
    const orientation = readJpegOrientation(bytes);
    imageData = normalizeOrientation(imageData, orientation);
  }

  if (
    imageData.width > MAX_OUTPUT_DIMENSION ||
    imageData.height > MAX_OUTPUT_DIMENSION
  ) {
    const scale = MAX_OUTPUT_DIMENSION /
      Math.max(imageData.width, imageData.height);
    imageData = await resize(imageData, {
      width: Math.round(imageData.width * scale),
      height: Math.round(imageData.height * scale),
    });
  }

  const webpBuffer = await encodeWebp(imageData);
  return {
    webp: new Uint8Array(webpBuffer),
    width: imageData.width,
    height: imageData.height,
  };
}

/** Chave aleatória — o nome do arquivo nunca vem do usuário (SPEC §19). */
export function generateImageKey(): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  return `posts/${year}/${month}/${crypto.randomUUID()}.webp`;
}
