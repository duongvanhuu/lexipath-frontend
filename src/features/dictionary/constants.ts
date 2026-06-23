import type { DictLang, SearchModeOption, VocabGroup } from "./types";

export const SEARCH_MODES: Record<DictLang, SearchModeOption[]> = {
  ja: [
    { id: "any",    label: "Tất cả",           placeholder: "Tìm bằng kanji, kana, romaji hoặc nghĩa…" },
    { id: "kanji",  label: "Kanji",            placeholder: "Tìm bằng kanji: 学習, 勉強…" },
    { id: "kana",   label: "Kana",             placeholder: "Tìm bằng kana: べんきょう…" },
    { id: "romaji", label: "Romaji",           placeholder: "Tìm bằng romaji: benkyou…" },
    { id: "vi",     label: "Nghĩa tiếng Việt", placeholder: "Tìm bằng tiếng Việt: học tập…" },
  ],
  en: [
    { id: "any",  label: "Tất cả",           placeholder: "Tìm headword, cụm từ, IPA hoặc nghĩa…" },
    { id: "word", label: "Headword",         placeholder: "Tìm tiếng Anh: study, accomplish…" },
    { id: "ipa",  label: "IPA",              placeholder: "Tìm bằng IPA: /stʌdi/…" },
    { id: "vi",   label: "Nghĩa tiếng Việt", placeholder: "Tìm bằng tiếng Việt: học tập…" },
  ],
  zh: [
    { id: "any",    label: "Tất cả",           placeholder: "Tìm giản thể, phồn thể, pinyin hoặc nghĩa…" },
    { id: "simp",   label: "Giản thể",         placeholder: "Tìm giản thể: 学习, 工作…" },
    { id: "pinyin", label: "Pinyin",           placeholder: "Tìm pinyin: xué xí, gōng zuò…" },
    { id: "vi",     label: "Nghĩa tiếng Việt", placeholder: "Tìm bằng tiếng Việt: học tập…" },
  ],
};

export const VOCAB_GROUPS: Record<DictLang, VocabGroup[]> = {
  ja: [
    { id: "words",   label: "Từ vựng",  icon: "BookText"  },
    { id: "kanji",   label: "Kanji",    icon: "SquarePen" },
    { id: "grammar", label: "Ngữ pháp", icon: "GitMerge"  },
    { id: "phrases", label: "Cụm từ",   icon: "Quote"     },
  ],
  en: [
    { id: "words",   label: "Words",         icon: "BookText" },
    { id: "phrases", label: "Phrases",       icon: "Quote"    },
    { id: "phrasal", label: "Phrasal Verbs", icon: "Combine"  },
    { id: "idioms",  label: "Idioms",        icon: "Sparkles" },
    { id: "colloc",  label: "Collocations",  icon: "Link"     },
  ],
  zh: [
    { id: "words",   label: "Từ vựng",  icon: "BookText"  },
    { id: "hanzi",   label: "Hanzi",    icon: "SquarePen" },
    { id: "measure", label: "Lượng từ", icon: "Shapes"    },
    { id: "pattern", label: "Mẫu câu",  icon: "ListTree"  },
  ],
};

export const POPULAR_WORDS: Record<DictLang, string[]> = {
  ja: ["勉強", "約束", "経験", "親切", "努力"],
  en: ["accomplish", "determine", "negotiate", "revenue", "significant"],
  zh: ["学习", "工作", "朋友", "经验", "努力"],
};

export const LANG_LABELS: Record<DictLang, string> = {
  ja: "Tiếng Nhật",
  en: "Tiếng Anh",
  zh: "Tiếng Trung",
};
