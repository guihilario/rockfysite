-- Dimensões reais da imagem de capa, capturadas no upload (SPEC §27 —
-- "sempre definir dimensões quando conhecidas para reduzir layout shift").
-- Sem isso o <img> usava width/height fixos que quase nunca batiam com a
-- proporção real da imagem processada.
ALTER TABLE posts ADD COLUMN cover_image_width INT;
ALTER TABLE posts ADD COLUMN cover_image_height INT;
