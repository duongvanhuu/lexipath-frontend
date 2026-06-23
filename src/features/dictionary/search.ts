import type {
  DictionaryEntry,
  DictLang,
  MatchTier,
  SearchMode,
  TieredResults,
} from "./types";

export function normalize(s: string): string {
  return String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[0-9]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function levenshtein(a: string, b: string): number {
  a = normalize(a);
  b = normalize(b);
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array<number>(n + 1).fill(0)
  );
  for (let i = 0; i <= m; i++) dp[i]![0] = i;
  for (let j = 0; j <= n; j++) dp[0]![j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i]![j] = Math.min(
        dp[i - 1]![j]! + 1,
        dp[i]![j - 1]! + 1,
        dp[i - 1]![j - 1]! + cost
      );
    }
  }
  return dp[m]![n]!;
}

export function matchEntry(
  entry: DictionaryEntry,
  query: string,
  mode: SearchMode
): boolean {
  if (!query) return false;
  const ql = query.toLowerCase().trim();
  if (!ql) return false;
  const wl = entry.word.toLowerCase();
  const rl = (entry.reading ?? "").toLowerCase();
  const ml = (entry.meaning ?? "").toLowerCase();

  switch (mode) {
    case "kanji":
    case "word":
    case "simp":
    case "trad":
      return wl.includes(ql);
    case "kana":
    case "romaji":
    case "ipa":
    case "pinyin":
      return rl.includes(ql);
    case "vi":
      return ml.includes(ql);
    default:
      return (
        wl.includes(ql) ||
        rl.includes(ql) ||
        ml.includes(ql) ||
        normalize(rl).includes(normalize(ql))
      );
  }
}

export function getMatchTier(entry: DictionaryEntry, query: string): MatchTier {
  const ql = query.toLowerCase().trim();
  if (
    entry.word.toLowerCase() === ql ||
    (entry.reading ?? "").toLowerCase() === ql
  ) {
    return "exact";
  }
  if (
    normalize(entry.word) === normalize(ql) ||
    normalize(entry.reading ?? "") === normalize(ql)
  ) {
    return "norm";
  }
  return "related";
}

export function buildTieredResults(
  entries: DictionaryEntry[],
  query: string,
  mode: SearchMode
): TieredResults {
  const matches = entries.filter((e) => matchEntry(e, query, mode));
  const tiers: TieredResults = { exact: [], norm: [], related: [] };
  for (const e of matches) {
    tiers[getMatchTier(e, query)].push(e);
  }
  return tiers;
}

export function findTypoSuggestion(
  entries: DictionaryEntry[],
  query: string,
  tiers: TieredResults
): DictionaryEntry | null {
  const total =
    tiers.exact.length + tiers.norm.length + tiers.related.length;
  if (!query.trim() || (tiers.exact.length > 0 && tiers.norm.length > 0))
    return null;
  if (tiers.exact.length > 0 || tiers.norm.length > 0) return null;

  let best: DictionaryEntry | null = null;
  let bestD = 99;

  for (const e of entries) {
    for (const field of [e.word, e.reading ?? "", e.meaning]) {
      if (!field) continue;
      const d = levenshtein(field, query);
      if (d < bestD) {
        bestD = d;
        best = e;
      }
    }
  }

  const ql = normalize(query);
  const maxDist = Math.max(1, Math.ceil(ql.length / 3));
  if (best && bestD > 0 && bestD <= maxDist && total <= 2) return best;
  return null;
}

export function groupByType(
  entries: DictionaryEntry[]
): Record<string, DictionaryEntry[]> {
  const groups: Record<string, DictionaryEntry[]> = {};
  for (const e of entries) {
    const key = e.type;
    if (!groups[key]) groups[key] = [];
    groups[key].push(e);
  }
  return groups;
}

export function filterByLang(
  entries: DictionaryEntry[],
  lang: DictLang
): DictionaryEntry[] {
  return entries.filter((e) => e.lang === lang);
}
