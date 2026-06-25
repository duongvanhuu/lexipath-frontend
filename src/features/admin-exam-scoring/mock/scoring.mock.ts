import type { ScoringMock, RoundingRule } from "../types/scoring.types";

export const SCORING_MOCK: ScoringMock = {
  programs: [
    { id: "p-ielts", name: "IELTS", color: "#2563EB" },
    { id: "p-toeic", name: "TOEIC", color: "#0284C7" },
    { id: "p-hsk",   name: "HSK",   color: "#DC2626" },
    { id: "p-jlpt",  name: "JLPT",  color: "#7C3AED" },
  ],
  scoreScales: [
    {
      id: "sc-ielts-band", name: "IELTS Band Score", programId: "p-ielts", type: "band",
      minRaw: 0, maxRaw: 40, minScaled: 0, maxScaled: 9, step: 0.5, roundingRuleId: "rr-ielts",
      passMark: 6.0, status: "published", convCount: 9, updatedAt: "10/06/2026",
      desc: "Quy đổi điểm thô (0–40) sang band 0–9 (bước 0.5).",
    },
    {
      id: "sc-toeic-lr", name: "TOEIC L&R Scaled", programId: "p-toeic", type: "total",
      minRaw: 0, maxRaw: 200, minScaled: 10, maxScaled: 990, step: 5, roundingRuleId: "rr-toeic",
      passMark: 600, status: "published", convCount: 6, updatedAt: "09/06/2026",
      desc: "Quy đổi số câu đúng sang thang điểm 10–990.",
    },
    {
      id: "sc-hsk3", name: "HSK 3 Tổng điểm", programId: "p-hsk", type: "total",
      minRaw: 0, maxRaw: 100, minScaled: 0, maxScaled: 300, step: 1, roundingRuleId: "rr-none",
      passMark: 180, status: "draft", convCount: 4, updatedAt: "06/06/2026",
      desc: "Mỗi câu × 3 điểm, đạt khi ≥ 180/300.",
    },
  ],
  conversions: {
    "sc-ielts-band": [
      { id: "cv-1", rawMin: 39, rawMax: 40, scaled: 9.0 },
      { id: "cv-2", rawMin: 37, rawMax: 38, scaled: 8.5 },
      { id: "cv-3", rawMin: 35, rawMax: 36, scaled: 8.0 },
      { id: "cv-4", rawMin: 33, rawMax: 34, scaled: 7.5 },
      { id: "cv-5", rawMin: 30, rawMax: 32, scaled: 7.0 },
      { id: "cv-6", rawMin: 27, rawMax: 29, scaled: 6.5 },
      { id: "cv-7", rawMin: 23, rawMax: 26, scaled: 6.0 },
      { id: "cv-8", rawMin: 19, rawMax: 22, scaled: 5.5 },
      { id: "cv-9", rawMin: 15, rawMax: 18, scaled: 5.0 },
    ],
    "sc-toeic-lr": [
      { id: "cvt-1", rawMin: 96, rawMax: 100, scaled: 495 },
      { id: "cvt-2", rawMin: 86, rawMax: 95,  scaled: 445 },
      { id: "cvt-3", rawMin: 71, rawMax: 85,  scaled: 375 },
      { id: "cvt-4", rawMin: 56, rawMax: 70,  scaled: 300 },
      { id: "cvt-5", rawMin: 41, rawMax: 55,  scaled: 220 },
      { id: "cvt-6", rawMin: 0,  rawMax: 40,  scaled: 120 },
    ],
    "sc-hsk3": [
      { id: "cvh-1", rawMin: 90, rawMax: 100, scaled: 300 },
      { id: "cvh-2", rawMin: 60, rawMax: 89,  scaled: 240 },
      { id: "cvh-3", rawMin: 40, rawMax: 59,  scaled: 180 },
      { id: "cvh-4", rawMin: 0,  rawMax: 39,  scaled: 90  },
    ],
  },
  roundingRules: [
    {
      id: "rr-ielts", name: "Làm tròn band IELTS", mode: "half-up", precision: 0.5,
      desc: "Làm tròn lên bội số 0.5 gần nhất (vd 6.25 → 6.5).", usedBy: 1,
    },
    {
      id: "rr-toeic", name: "Làm tròn TOEIC", mode: "nearest", precision: 5,
      desc: "Làm tròn tới bội số 5 gần nhất.", usedBy: 1,
    },
    {
      id: "rr-none", name: "Không làm tròn", mode: "none", precision: 1,
      desc: "Giữ nguyên điểm thô tính được.", usedBy: 1,
    },
    {
      id: "rr-floor", name: "Làm tròn xuống", mode: "floor", precision: 1,
      desc: "Luôn làm tròn xuống số nguyên gần nhất.", usedBy: 0,
    },
  ],
  rubrics: [
    {
      id: "rb-ielts-writing", name: "IELTS Writing Task 2", programId: "p-ielts", scaleMax: 9,
      status: "published", criteriaCount: 4, usedBy: 1, updatedAt: "10/06/2026",
      desc: "4 tiêu chí chuẩn IELTS, mỗi tiêu chí 0–9, lấy trung bình.",
    },
    {
      id: "rb-ielts-speaking", name: "IELTS Speaking", programId: "p-ielts", scaleMax: 9,
      status: "published", criteriaCount: 4, usedBy: 1, updatedAt: "09/06/2026",
      desc: "4 tiêu chí nói: Trôi chảy, Từ vựng, Ngữ pháp, Phát âm.",
    },
    {
      id: "rb-toeic-writing", name: "TOEIC Writing", programId: "p-toeic", scaleMax: 5,
      status: "draft", criteriaCount: 3, usedBy: 0, updatedAt: "08/06/2026",
      desc: "Thang 0–5 cho phần viết TOEIC.",
    },
  ],
  rubricCriteria: {
    "rb-ielts-writing": [
      { id: "rc-w1", name: "Task Response", weight: 25, levels: [
        { band: "9", desc: "Trả lời đầy đủ mọi phần, ý tưởng phát triển sâu sắc." },
        { band: "7", desc: "Trả lời mọi phần, ý chính rõ nhưng có chỗ chưa sâu." },
        { band: "5", desc: "Trả lời được một phần, ý phát triển hạn chế." },
        { band: "3", desc: "Hầu như không trả lời đúng yêu cầu đề bài." },
      ]},
      { id: "rc-w2", name: "Coherence & Cohesion", weight: 25, levels: [
        { band: "9", desc: "Liên kết mạch lạc, sử dụng từ nối linh hoạt, tự nhiên." },
        { band: "7", desc: "Bố cục rõ ràng, dùng từ nối hợp lý, đôi chỗ máy móc." },
        { band: "5", desc: "Sắp xếp ý chưa logic, lạm dụng/thiếu từ nối." },
        { band: "3", desc: "Thiếu liên kết, khó theo dõi mạch ý." },
      ]},
      { id: "rc-w3", name: "Lexical Resource", weight: 25, levels: [
        { band: "9", desc: "Từ vựng phong phú, chính xác, tự nhiên." },
        { band: "7", desc: "Vốn từ tốt, đôi lỗi nhỏ về kết hợp từ." },
        { band: "5", desc: "Vốn từ hạn chế, lặp từ, lỗi gây khó hiểu." },
        { band: "3", desc: "Vốn từ rất hạn chế, nhiều lỗi nghiêm trọng." },
      ]},
      { id: "rc-w4", name: "Grammatical Range & Accuracy", weight: 25, levels: [
        { band: "9", desc: "Cấu trúc đa dạng, gần như không lỗi." },
        { band: "7", desc: "Đa dạng cấu trúc, một số lỗi không cản trở." },
        { band: "5", desc: "Cấu trúc đơn giản, lỗi thường xuyên." },
        { band: "3", desc: "Lỗi ngữ pháp dày đặc, cản trở giao tiếp." },
      ]},
    ],
    "rb-ielts-speaking": [
      { id: "rc-s1", name: "Fluency & Coherence", weight: 25, levels: [
        { band: "9", desc: "Nói trôi chảy, gần như không ngập ngừng." },
        { band: "7", desc: "Nói tương đối trôi chảy, đôi chỗ tự sửa." },
        { band: "5", desc: "Ngập ngừng nhiều, dùng từ đệm lặp lại." },
      ]},
      { id: "rc-s2", name: "Lexical Resource", weight: 25, levels: [
        { band: "9", desc: "Vốn từ linh hoạt, dùng thành ngữ tự nhiên." },
        { band: "7", desc: "Vốn từ đủ rộng để bàn nhiều chủ đề." },
        { band: "5", desc: "Vốn từ đủ cho chủ đề quen, hay lặp." },
      ]},
      { id: "rc-s3", name: "Grammatical Range & Accuracy", weight: 25, levels: [
        { band: "9", desc: "Cấu trúc đa dạng, chính xác hoàn toàn." },
        { band: "7", desc: "Dùng câu phức linh hoạt, ít lỗi." },
        { band: "5", desc: "Chủ yếu câu đơn, lỗi thường gặp." },
      ]},
      { id: "rc-s4", name: "Pronunciation", weight: 25, levels: [
        { band: "9", desc: "Phát âm rõ, ngữ điệu tự nhiên." },
        { band: "7", desc: "Dễ nghe, đôi lỗi phát âm nhỏ." },
        { band: "5", desc: "Phát âm gây khó nghe ở một số chỗ." },
      ]},
    ],
    "rb-toeic-writing": [
      { id: "rc-tw1", name: "Nội dung", weight: 40, levels: [
        { band: "5", desc: "Đầy đủ ý, phát triển tốt." },
        { band: "3", desc: "Đủ ý cơ bản." },
        { band: "1", desc: "Thiếu ý chính." },
      ]},
      { id: "rc-tw2", name: "Tổ chức", weight: 30, levels: [
        { band: "5", desc: "Bố cục rõ ràng, mạch lạc." },
        { band: "3", desc: "Bố cục tạm ổn." },
        { band: "1", desc: "Lộn xộn." },
      ]},
      { id: "rc-tw3", name: "Ngôn ngữ", weight: 30, levels: [
        { band: "5", desc: "Ngữ pháp & từ vựng chính xác." },
        { band: "3", desc: "Một số lỗi không cản trở." },
        { band: "1", desc: "Nhiều lỗi nghiêm trọng." },
      ]},
    ],
  },
};

export function applyRounding(
  value: number,
  ruleId: string,
  rules: RoundingRule[],
): number {
  const rule = rules.find((r) => r.id === ruleId);
  if (!rule || rule.mode === "none") return value;
  const p = rule.precision || 1;
  if (rule.mode === "floor") return Math.floor(value / p) * p;
  if (rule.mode === "half-up") return Math.ceil(value / p - 0.5 + 1e-9) * p;
  return Math.round(value / p) * p;
}
