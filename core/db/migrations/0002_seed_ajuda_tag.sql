-- Garante a tag reservada usada pela central de ajuda (SPEC §41). Sem ela,
-- não haveria como marcar um post como "ajuda" pelo admin até alguém criar
-- a tag manualmente.
INSERT INTO tags (name, slug)
VALUES ('Ajuda', 'ajuda')
ON CONFLICT (slug) DO NOTHING;
