import { createDefine } from "fresh";

/** Estado compartilhado entre middlewares, layouts e rotas. */
export interface State {
  /** Preenchido pelo middleware de sessão quando há admin logado. */
  usuario?: { id: string; email: string; name: string | null };
}

export const define = createDefine<State>();
