/* Utilitários de formato e validação (telefone, CPF/CNPJ, CEP).
 *
 * Moram num módulo só, e não na rota do checkout, porque a mesma regra serve
 * em mais lugares e nos dois lados: o servidor valida de verdade e o
 * `static/js/formata.js` espelha no navegador para o campo não aceitar lixo
 * antes de enviar. Dividir a regra entre os dois seria o erro clássico de
 * o cliente aprovar um formato que o servidor rejeita.
 *
 * O armazenamento usa sempre o valor formatado (ex.: "(11) 98765-4321",
 * "00.000.000/0000-00", "00000-000") — mais legível na listagem do painel;
 * quem precisar dos dígitos puros usa `somenteDigitos`.
 */

export function somenteDigitos(valor: string): string {
  return valor.replace(/\D/g, "");
}

/** Telefone fixo (10 dígitos) ou celular (11), com DDD. */
export function telefoneValido(valor: string): boolean {
  const d = somenteDigitos(valor);
  return d.length === 10 || d.length === 11;
}

export function formatarTelefone(valor: string): string {
  const d = somenteDigitos(valor).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) {
    return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  }
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/** CEP de 8 dígitos. */
export function cepValido(valor: string): boolean {
  return somenteDigitos(valor).length === 8;
}

export function formatarCep(valor: string): string {
  const d = somenteDigitos(valor).slice(0, 8);
  return d.length <= 5 ? d : `${d.slice(0, 5)}-${d.slice(5)}`;
}

function todosIguais(d: string): boolean {
  return /^(\d)\1+$/.test(d);
}

/** Verifica o dígito verificador de CPF e CNPJ a partir da base + pesos. */
function digitoVerificador(base: string, pesos: number[]): number {
  const soma = pesos.reduce((acc, peso, i) => acc + peso * Number(base[i]), 0);
  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
}

export function cpfValido(valor: string): boolean {
  const d = somenteDigitos(valor);
  if (d.length !== 11 || todosIguais(d)) return false;
  return digitoVerificador(d.slice(0, 9), [10, 9, 8, 7, 6, 5, 4, 3, 2]) ===
      Number(d[9]) &&
    digitoVerificador(d.slice(0, 10), [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]) ===
      Number(d[10]);
}

export function cnpjValido(valor: string): boolean {
  const d = somenteDigitos(valor);
  if (d.length !== 14 || todosIguais(d)) return false;
  return digitoVerificador(d.slice(0, 12), [
        5,
        4,
        3,
        2,
        9,
        8,
        7,
        6,
        5,
        4,
        3,
        2,
      ]) ===
      Number(d[12]) &&
    digitoVerificador(d.slice(0, 13), [
        6,
        5,
        4,
        3,
        2,
        9,
        8,
        7,
        6,
        5,
        4,
        3,
        2,
      ]) ===
      Number(d[13]);
}

/** Aceita CPF (11 dígitos) ou CNPJ (14), com dígito verificador conferido. */
export function documentoValido(valor: string): boolean {
  const d = somenteDigitos(valor);
  if (d.length === 11) return cpfValido(d);
  if (d.length === 14) return cnpjValido(d);
  return false;
}

export function formatarDocumento(valor: string): string {
  const d = somenteDigitos(valor).slice(0, 14);
  if (d.length <= 11) {
    return d
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
  }
  return d
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4")
    .replace(/(\d{4})(\d)/, "$1-$2");
}
