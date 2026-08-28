import { posts } from "@/data/posts.ts";

/** Faixa do blog. No mobile o trilho arrasta (ver scripts.js). */
export function Posts() {
  return (
    <>
      {/* ══════ POSTS ══════ */}
      <section class="section">
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <p class="eyebrow">Blog</p>
            <h2 class="title">
              Para ler <em>depois</em>
            </h2>
          </div>
          <button type="button" class="cta" style={{ marginTop: "0" }}>
            Todos os posts
            <span class="badge">
              <svg viewBox="0 0 24 24">
                <path
                  d="M5 12h14m-6-6 6 6-6 6"
                  stroke-width="1.9"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
          </button>
        </div>

        <div class="posts">
          {posts.map((p) => (
            <a key={p.title} class="post" href={p.href}>
              <span class="post__media">
                <span class="post__tag">{p.tag}</span>
              </span>
              <p class="post__meta">{p.meta}</p>
              <h3 class="post__title">{p.title}</h3>
              <p class="post__text">{p.text}</p>
              <span class="post__link">
                Ler{" "}
                <svg viewBox="0 0 24 24">
                  <path
                    d="M5 12h14m-6-6 6 6-6 6"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
            </a>
          ))}
        </div>
        <div class="dots" id="postDots"></div>
      </section>
    </>
  );
}
