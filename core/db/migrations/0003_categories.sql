-- Categorias: seção fixa (Blog/Ajuda) + subcategorias, no máximo 2 níveis
-- de profundidade (aplicado na camada de aplicação, não aqui). Diferente
-- de tags (que continuam sendo #assunto livre), categoria decide EM QUAL
-- seção do site um post aparece — um post só tem uma.

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  parent_id UUID REFERENCES categories (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX categories_parent_id_idx ON categories (parent_id);

-- Categorias raiz reservadas — /blog e /ajuda só mostram posts cuja
-- categoria (ou categoria-pai, se for subcategoria) é uma destas.
INSERT INTO categories (name, slug) VALUES ('Blog', 'blog'), ('Ajuda', 'ajuda')
ON CONFLICT (slug) DO NOTHING;

-- Nullable de propósito: um post sem categoria simplesmente não aparece em
-- nenhuma seção, em vez de a migration falhar por causa de dados
-- existentes. Obrigatório é regra de aplicação (form do admin), não do banco.
ALTER TABLE posts ADD COLUMN category_id UUID REFERENCES categories (id) ON DELETE SET NULL;
CREATE INDEX posts_category_id_idx ON posts (category_id);

-- Posts criados antes desta feature mantêm o comportamento que já tinham
-- (apareciam só em /blog).
UPDATE posts SET category_id = (SELECT id FROM categories WHERE slug = 'blog')
WHERE category_id IS NULL;
