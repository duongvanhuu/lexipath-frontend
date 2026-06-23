import type { VocabDetailItem } from "./vocab-detail.types";

export const MOCK_VOCAB_DETAIL_MAP: Record<string, VocabDetailItem> = {
  /* ── Japanese ── */
  "benkyou": {
    id: "ja-benkyou",
    word: "勉強",
    langCode: "ja",
    reading: "べんきょう",
    learningStatus: "review",
    saved: true,
    senses: [
      {
        id: "s1",
        pos: "Danh từ / Động từ",
        meaning: "Học tập, việc học",
        meaningVi: "Hành động học hỏi tri thức, luyện tập",
        status: "review",
        examples: [
          { id: "s1e1", source: "毎日日本語を勉強します。", translation: "Tôi học tiếng Nhật mỗi ngày." },
          { id: "s1e2", source: "勉強が好きですか？", translation: "Bạn có thích học không?" },
        ],
      },
      {
        id: "s2",
        pos: "Danh từ",
        meaning: "Nỗ lực, sự chăm chỉ",
        meaningVi: "Ý chí học tập chăm chỉ, kiên trì",
        status: "learning",
        examples: [
          { id: "s2e1", source: "彼の勉強ぶりは立派だ。", translation: "Sự chăm chỉ của anh ấy thật đáng nể." },
        ],
      },
      {
        id: "s3",
        pos: "Động từ",
        meaning: "Giảm giá (khẩu ngữ)",
        meaningVi: "Bớt giá trong giao dịch mua bán",
        status: "new",
        examples: [
          { id: "s3e1", source: "少し勉強しますよ。", translation: "Tôi sẽ bớt cho một chút nhé." },
        ],
      },
    ],
    usageNotes: [
      { label: "Văn phong", value: "Trang trọng và thân mật" },
      { label: "Phổ biến trong", value: "Đời sống hằng ngày, học đường" },
      { label: "Mức độ JLPT", value: "N5 – N4" },
    ],
    skillRows: [
      { key: "meaning", label: "Nhớ nghĩa", icon: "Brain", pct: 87 },
      { key: "listen", label: "Nghe", icon: "Ear", pct: 63 },
      { key: "read", label: "Đọc Kanji", icon: "BookOpenText", pct: 78 },
      { key: "romaji", label: "Viết Romaji", icon: "Type", pct: 55 },
    ],
    overallProgress: { mastered: 48, total: 80 },
    nextReview: {
      label: "Ngay bây giờ",
      sublabel: "Từ này cần ôn ngay để không quên",
      tone: "danger",
    },
    relatedGroups: [
      { key: "syn", label: "Đồng nghĩa", icon: "Equal", items: [{ word: "学習", reading: "がくしゅう" }, { word: "研究", reading: "けんきゅう" }] },
      { key: "ant", label: "Trái nghĩa", icon: "ArrowLeftRight", items: [{ word: "遊び", reading: "あそび" }] },
      { key: "con", label: "Dễ nhầm lẫn", icon: "AlertTriangle", items: [{ word: "勉強家", reading: "べんきょうか" }, { word: "勤勉", reading: "きんべん" }] },
      { key: "gram", label: "Ngữ pháp liên quan", icon: "GitMerge", items: [{ word: "〜を勉強する" }] },
    ],
    langModule: {
      type: "ja",
      kanji: [
        { char: "勉", reading: "べん", meaning: "Nỗ lực", on: "ベン", kun: "つと.める", strokes: 10, jlpt: "N3" },
        { char: "強", reading: "きょう", meaning: "Mạnh mẽ", on: "キョウ・ゴウ", kun: "つよ.い", strokes: 11, jlpt: "N4" },
      ],
      verbForms: [
        { label: "Thể từ điển", value: "勉強する" },
        { label: "Thể て", value: "勉強して" },
        { label: "Thể た", value: "勉強した" },
        { label: "Thể ない", value: "勉強しない" },
        { label: "Thể ます", value: "勉強します" },
        { label: "Thể ている", value: "勉強している" },
      ],
    },
  },

  /* ── English ── */
  "negotiate": {
    id: "en-negotiate",
    word: "negotiate",
    langCode: "en",
    ipa: "nɪˈɡəʊʃɪeɪt",
    learningStatus: "mastered",
    saved: false,
    senses: [
      {
        id: "s1",
        pos: "Verb",
        meaning: "Đàm phán, thương lượng",
        meaningVi: "Thảo luận để đạt được thỏa thuận",
        status: "mastered",
        examples: [
          { id: "s1e1", source: "They negotiated a new contract.", translation: "Họ đã đàm phán một hợp đồng mới." },
          { id: "s1e2", source: "We negotiated a lower price.", translation: "Chúng tôi đã thương lượng mức giá thấp hơn." },
        ],
      },
      {
        id: "s2",
        pos: "Verb",
        meaning: "Vượt qua (chướng ngại vật)",
        meaningVi: "Điều hướng thành công qua chướng ngại",
        status: "learning",
        examples: [
          { id: "s2e1", source: "The car negotiated the sharp bend.", translation: "Chiếc xe đã vượt qua khúc cua gắt." },
        ],
      },
    ],
    usageNotes: [
      { label: "Register", value: "Formal – semi-formal" },
      { label: "Common in", value: "Academic, business" },
      { label: "CEFR level", value: "B1 – B2" },
    ],
    skillRows: [
      { key: "meaning", label: "Nhớ nghĩa", icon: "Brain", pct: 92 },
      { key: "listen", label: "Nghe", icon: "Ear", pct: 78 },
      { key: "spell", label: "Chính tả", icon: "SpellCheck", pct: 85 },
      { key: "pron", label: "Phát âm", icon: "Mic", pct: 70 },
    ],
    overallProgress: { mastered: 312, total: 420 },
    nextReview: {
      label: "7–14 ngày nữa",
      sublabel: "Trí nhớ tốt · giữ vững nhé",
      tone: "primary",
    },
    relatedGroups: [
      { key: "syn", label: "Đồng nghĩa", icon: "Equal", items: [{ word: "bargain" }, { word: "mediate" }] },
      { key: "ant", label: "Trái nghĩa", icon: "ArrowLeftRight", items: [{ word: "dictate" }] },
      { key: "con", label: "Dễ nhầm lẫn", icon: "AlertTriangle", items: [{ word: "navigate" }, { word: "negate" }] },
    ],
    langModule: {
      type: "en",
      dialects: [
        { flag: "🇬🇧", label: "British", ipa: "/nɪˈɡəʊʃɪeɪt/", ttsLang: "en-GB" },
        { flag: "🇺🇸", label: "American", ipa: "/nɪˈɡoʊʃieɪt/", ttsLang: "en-US" },
      ],
      collocations: ["negotiate a deal", "negotiate with sb", "fail to negotiate", "negotiate a price", "negotiate terms"],
      wordFamily: [
        { pos: "Noun", word: "negotiation" },
        { pos: "Noun", word: "negotiator" },
        { pos: "Adjective", word: "negotiable" },
        { pos: "Adverb", word: "negotiably" },
      ],
    },
  },

  /* ── Chinese ── */
  "xuéxí": {
    id: "zh-xuéxí",
    word: "学习",
    langCode: "zh",
    reading: "xuéxí",
    learningStatus: "learning",
    saved: true,
    senses: [
      {
        id: "s1",
        pos: "Động từ",
        meaning: "Học tập",
        meaningVi: "Tiếp thu kiến thức hoặc kỹ năng",
        status: "learning",
        examples: [
          { id: "s1e1", source: "我每天学习中文。", translation: "Tôi học tiếng Trung mỗi ngày." },
          { id: "s1e2", source: "学习新技能很重要。", translation: "Học kỹ năng mới rất quan trọng." },
        ],
      },
      {
        id: "s2",
        pos: "Động từ",
        meaning: "Noi gương, học hỏi",
        meaningVi: "Học theo tấm gương hoặc tinh thần của ai đó",
        status: "new",
        examples: [
          { id: "s2e1", source: "我们要学习他的精神。", translation: "Chúng ta nên học hỏi tinh thần của anh ấy." },
        ],
      },
    ],
    usageNotes: [
      { label: "Văn phong", value: "Trang trọng và thân mật" },
      { label: "Phổ biến trong", value: "Đời sống hằng ngày, học đường" },
      { label: "HSK", value: "HSK 1 – 2" },
    ],
    skillRows: [
      { key: "meaning", label: "Nhớ nghĩa", icon: "Brain", pct: 72 },
      { key: "tone", label: "Thanh điệu", icon: "Music", pct: 58 },
      { key: "pinyin", label: "Pinyin", icon: "Type", pct: 65 },
      { key: "write", label: "Viết Hán tự", icon: "PenLine", pct: 40 },
    ],
    overallProgress: { mastered: 55, total: 95 },
    nextReview: {
      label: "Hôm nay",
      sublabel: "Ôn đều để ghi nhớ lâu hơn",
      tone: "golden",
    },
    relatedGroups: [
      { key: "syn", label: "Đồng nghĩa", icon: "Equal", items: [{ word: "学", reading: "xué" }, { word: "研习", reading: "yán xí" }] },
      { key: "ant", label: "Trái nghĩa", icon: "ArrowLeftRight", items: [{ word: "忘记", reading: "wàng jì" }] },
      { key: "con", label: "Dễ nhầm lẫn", icon: "AlertTriangle", items: [{ word: "学校", reading: "xuéxiào" }, { word: "练习", reading: "liànxí" }] },
    ],
    langModule: {
      type: "zh",
      chars: [
        { char: "学", pinyin: "xué", tone: 2, traditional: "學", meaning: "Học", strokes: 8, hsk: 1 },
        { char: "习", pinyin: "xí", tone: 2, traditional: "習", meaning: "Tập luyện", strokes: 3, hsk: 1 },
      ],
      toneNum: 2,
      pinyinFull: "xuéxí",
      measureWords: [
        { char: "个", pinyin: "gè", usage: "Từ chung nhất cho người và đồ vật" },
        { char: "本", pinyin: "běn", usage: "Sách, vở, tài liệu" },
      ],
    },
  },
};

export const MOCK_VOCAB_DETAIL_ITEMS = Object.values(MOCK_VOCAB_DETAIL_MAP);

export function getMockVocabDetail(idOrSlug: string): VocabDetailItem | undefined {
  return (
    MOCK_VOCAB_DETAIL_MAP[idOrSlug] ??
    MOCK_VOCAB_DETAIL_ITEMS.find((v) => v.id === idOrSlug)
  );
}
