// Normaliza a orientação de fotos JPEG vindas de celular (SPEC §19).
// Câmeras gravam o pixel "deitado" e um tag EXIF dizendo como girar —
// like esse tag some quando recodificamos pra WebP a partir de ImageData,
// então a rotação precisa ser aplicada nos pixels ANTES de descartar o
// EXIF, ou a imagem final fica de lado.

/** Lê o tag Orientation (0x0112) do EXIF de um JPEG. Retorna 1 (normal)
 * se não encontrar ou se qualquer coisa no parsing for inesperada — nunca
 * lança: orientação errada é cosmético, não deve derrubar o upload. */
export function readJpegOrientation(bytes: Uint8Array): number {
  try {
    if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return 1;

    let offset = 2;
    while (offset + 4 <= bytes.length) {
      if (bytes[offset] !== 0xff) break;
      const marker = bytes[offset + 1];

      if (marker === 0xd8 || marker === 0xd9) {
        offset += 2;
        continue;
      }
      if (marker >= 0xd0 && marker <= 0xd7) {
        offset += 2;
        continue;
      }
      if (marker === 0xda) break; // Start of Scan: metadata acabou

      const length = (bytes[offset + 2] << 8) | bytes[offset + 3];

      if (marker === 0xe1) {
        const tiffStart = offset + 4 + 6; // pula "Exif\0\0"
        if (
          bytes[offset + 4] === 0x45 && bytes[offset + 5] === 0x78 &&
          bytes[offset + 6] === 0x69 && bytes[offset + 7] === 0x66
        ) {
          const orientation = parseTiffOrientation(bytes, tiffStart);
          if (orientation) return orientation;
        }
      }

      offset += 2 + length;
    }
  } catch {
    // Segue pro `return 1` abaixo.
  }
  return 1;
}

function parseTiffOrientation(
  bytes: Uint8Array,
  tiffStart: number,
): number | null {
  if (tiffStart + 8 > bytes.length) return null;
  const view = new DataView(
    bytes.buffer,
    bytes.byteOffset + tiffStart,
    bytes.byteLength - tiffStart,
  );

  const byteOrderMark = view.getUint16(0);
  const little = byteOrderMark === 0x4949;
  if (!little && byteOrderMark !== 0x4d4d) return null;

  const ifdOffset = view.getUint32(4, little);
  const numEntries = view.getUint16(ifdOffset, little);

  for (let i = 0; i < numEntries; i++) {
    const entryOffset = ifdOffset + 2 + i * 12;
    if (entryOffset + 12 > view.byteLength) break;
    const tag = view.getUint16(entryOffset, little);
    if (tag === 0x0112) {
      return view.getUint16(entryOffset + 8, little);
    }
  }
  return null;
}

function rotate90(img: ImageData): ImageData {
  const { width, height, data } = img;
  const out = new Uint8ClampedArray(data.length);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const srcI = (y * width + x) * 4;
      const dstX = height - 1 - y;
      const dstY = x;
      const dstI = (dstY * height + dstX) * 4;
      out[dstI] = data[srcI];
      out[dstI + 1] = data[srcI + 1];
      out[dstI + 2] = data[srcI + 2];
      out[dstI + 3] = data[srcI + 3];
    }
  }
  return new ImageData(out, height, width);
}

function rotate270(img: ImageData): ImageData {
  const { width, height, data } = img;
  const out = new Uint8ClampedArray(data.length);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const srcI = (y * width + x) * 4;
      const dstX = y;
      const dstY = width - 1 - x;
      const dstI = (dstY * height + dstX) * 4;
      out[dstI] = data[srcI];
      out[dstI + 1] = data[srcI + 1];
      out[dstI + 2] = data[srcI + 2];
      out[dstI + 3] = data[srcI + 3];
    }
  }
  return new ImageData(out, height, width);
}

function rotate180(img: ImageData): ImageData {
  const { width, height, data } = img;
  const out = new Uint8ClampedArray(data.length);
  const total = width * height;
  for (let i = 0; i < total; i++) {
    const srcI = i * 4;
    const dstI = (total - 1 - i) * 4;
    out[dstI] = data[srcI];
    out[dstI + 1] = data[srcI + 1];
    out[dstI + 2] = data[srcI + 2];
    out[dstI + 3] = data[srcI + 3];
  }
  return new ImageData(out, width, height);
}

function flipHorizontal(img: ImageData): ImageData {
  const { width, height, data } = img;
  const out = new Uint8ClampedArray(data.length);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const srcI = (y * width + x) * 4;
      const dstI = (y * width + (width - 1 - x)) * 4;
      out[dstI] = data[srcI];
      out[dstI + 1] = data[srcI + 1];
      out[dstI + 2] = data[srcI + 2];
      out[dstI + 3] = data[srcI + 3];
    }
  }
  return new ImageData(out, width, height);
}

function flipVertical(img: ImageData): ImageData {
  const { width, height, data } = img;
  const out = new Uint8ClampedArray(data.length);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const srcI = (y * width + x) * 4;
      const dstI = ((height - 1 - y) * width + x) * 4;
      out[dstI] = data[srcI];
      out[dstI + 1] = data[srcI + 1];
      out[dstI + 2] = data[srcI + 2];
      out[dstI + 3] = data[srcI + 3];
    }
  }
  return new ImageData(out, width, height);
}

/** Tabela de transformação EXIF (valores 1–8). 1 (ou qualquer valor fora
 * da tabela) é um no-op. */
export function normalizeOrientation(
  img: ImageData,
  orientation: number,
): ImageData {
  switch (orientation) {
    case 2:
      return flipHorizontal(img);
    case 3:
      return rotate180(img);
    case 4:
      return flipVertical(img);
    case 5:
      return flipHorizontal(rotate90(img));
    case 6:
      return rotate90(img);
    case 7:
      return flipHorizontal(rotate270(img));
    case 8:
      return rotate270(img);
    default:
      return img;
  }
}
