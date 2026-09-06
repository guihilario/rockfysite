import type { Post } from "@/domain/posts.ts";

type Props = {
  /** Ausente = criando um post novo. */
  post?: Post;
  /** Já com o rótulo pronto ("Blog › Performance"), resolvido na rota. */
  categorias: { id: string; rotulo: string }[];
  /** Tags já ligadas ao post, como texto separado por vírgula. */
  tags: string;
  erro?: string;
};

/**
 * Formulário de post, usado por /admin/posts/novo e /admin/posts/[id].
 *
 * O Quill monta em `#editor` e espelha o HTML no textarea `#content`
 * (ver /js/admin-editor.js). Sem JavaScript o textarea continua visível e
 * o envio funciona igual — o editor é enriquecimento, não requisito.
 */
export function PostForm({ post, categorias, tags, erro }: Props) {
  const editando = Boolean(post);

  return (
    <form
      class="form"
      method="post"
      action={editando ? `/admin/posts/${post!.id}` : "/admin/posts/novo"}
      enctype="multipart/form-data"
    >
      {erro && <p class="aviso aviso--erro">{erro}</p>}

      <div class="campo">
        <label for="title">Título</label>
        <input
          id="title"
          name="title"
          type="text"
          required
          value={post?.title ?? ""}
          placeholder="Como configurar seu domínio"
        />
        {editando && <p class="dica">Endereço atual: /{post!.slug}</p>}
      </div>

      <div class="campo">
        <label for="excerpt">Resumo</label>
        {
          /* O valor vai como filho, não como `value`: o
            preact-render-to-string emite `value` como atributo literal, e
            <textarea> não tem esse atributo em HTML. O navegador o ignora,
            o campo nasce vazio e o save grava o vazio por cima. */
        }
        <textarea
          id="excerpt"
          name="excerpt"
          placeholder="Uma ou duas frases — aparece nos cards e na busca do Google."
        >
          {post?.excerpt ?? ""}
        </textarea>
      </div>

      <div class="campo">
        <label for="categoryId">Categoria</label>
        <select id="categoryId" name="categoryId">
          <option value="">
            — sem categoria (não aparece em nenhuma seção) —
          </option>
          {categorias.map((c) => (
            <option
              key={c.id}
              value={c.id}
              selected={post?.categoryId === c.id}
            >
              {c.rotulo}
            </option>
          ))}
        </select>
        <p class="dica">
          A categoria decide onde o post aparece: raiz <b>Blog</b>{" "}
          manda para /blog, raiz <b>Ajuda</b>{" "}
          para /ajuda. Sem categoria, não aparece em nenhuma listagem.
        </p>
      </div>

      <div class="campo">
        <label for="newTags">Tags</label>
        <input
          id="newTags"
          name="newTags"
          type="text"
          value={tags}
          placeholder="wordpress, performance"
        />
        <p class="dica">
          Separadas por vírgula. Só assunto (#tag) — não interferem na seção.
        </p>
      </div>

      <div class="campo">
        <label for="coverImage">Imagem de capa</label>
        {post?.coverImageUrl && (
          <img class="capa-atual" src={post.coverImageUrl} alt="" />
        )}
        <input id="coverImage" name="coverImage" type="file" accept="image/*" />
        <p class="dica">
          Enviada para o R2 e convertida para WebP. Deixe vazio para manter a
          atual.
        </p>
      </div>

      <div class="campo">
        <label for="content">Conteúdo</label>
        <div id="editor"></div>
        {
          /* Mesmo motivo do resumo acima. Aqui o efeito era pior: o Quill
            lia o textarea vazio, montava um editor em branco e o sync
            devolvia "<p><br></p>", apagando o post ao salvar. */
        }
        <textarea
          id="content"
          name="content"
          required
        >
          {post?.content ?? ""}
        </textarea>
      </div>

      <div class="form-acoes">
        <button class="btn" type="submit" name="acao" value="salvar">
          {editando ? "Salvar" : "Criar rascunho"}
        </button>
        {editando && post!.status !== "published" && (
          <button
            class="btn btn--ghost"
            type="submit"
            name="acao"
            value="publicar"
          >
            Salvar e publicar
          </button>
        )}
        <a class="btn btn--ghost espaco" href="/admin/posts">Cancelar</a>
      </div>
    </form>
  );
}
