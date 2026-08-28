import { listPublishedPostsOrNone, type Post } from "@/domain/posts.ts";

/** Quantos cards a faixa antes do rodapé mostra. */
const QUANTOS = 3;

/**
 * Os posts da faixa que aparece antes do rodapé nas páginas
 * institucionais.
 *
 * Mora num lugar só porque seis rotas pedem exatamente a mesma coisa, e
 * porque de qual seção vêm os cards é decisão de conteúdo, não de página.
 *
 * O custo é baixo de propósito: `listPublishedPostsOrNone` guarda o
 * resultado por um minuto, então é uma ida ao Postgres por minuto por
 * instância (~15 ms) em vez de uma por requisição. Ele também engole falha
 * de banco devolvendo lista vazia — uma faixa decorativa não pode derrubar
 * a página que vende hospedagem.
 */
export function carregarFaixaPosts(secao = "blog"): Promise<Post[]> {
  return listPublishedPostsOrNone({ perPage: QUANTOS, section: secao })
    .then((r) => r.posts);
}
