import type { Route } from "next";
import {
  BookOpen,
  Brain,
  CalendarClock,
  CheckCircle2,
  Clock,
  FileText,
  PenLine,
  Repeat,
  Route as RouteIcon,
  ScanSearch,
  Sparkles,
  Star,
  Target,
  TrendingDown,
  Waypoints,
  XCircle,
} from "lucide-react";

import type { ShellAction } from "@/components/shared/navigation";

import type {
  DiagnosisSkill,
  ExamToSrsStep,
  FaqItem,
  FooterColumn,
  GoldenTimeQueueWord,
  LanguageSupport,
  LearningLoopStep,
  MarketingNavItem,
  PricingPlan,
} from "../types/marketing.types";

/** Cast a same-page hash anchor to a typed `Route` (typedRoutes is on). */
const anchor = (id: string) => `#${id}` as Route;

export const HEADER_NAV: MarketingNavItem[] = [
  { id: "features", label: "Tính năng", href: anchor("features") },
  { id: "golden-time", label: "Golden Time", href: anchor("golden-time") },
  { id: "languages", label: "Ngôn ngữ", href: anchor("languages") },
  { id: "pricing", label: "Bảng giá", href: anchor("pricing") },
  { id: "faq", label: "Hỏi đáp", href: anchor("faq") },
];

export const HEADER_ACTIONS: ShellAction[] = [
  { id: "login", label: "Đăng nhập", href: "/login", variant: "ghost" },
  { id: "register", label: "Bắt đầu miễn phí", href: "/register", variant: "primary" },
];

export const PROBLEMS: {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}[] = [
  {
    id: "forget",
    icon: <TrendingDown aria-hidden />,
    title: "Học xong là quên",
    description:
      "Nhồi 50 từ một buổi rồi quên sạch sau vài ngày vì ôn sai thời điểm.",
  },
  {
    id: "no-path",
    icon: <Waypoints aria-hidden />,
    title: "Không biết học gì tiếp",
    description:
      "Danh sách từ dài vô tận, không có lộ trình rõ ràng cho mục tiêu của bạn.",
  },
  {
    id: "exam-gap",
    icon: <FileText aria-hidden />,
    title: "Luyện thi rời rạc",
    description:
      "Làm đề xong biết sai nhưng không có cách biến lỗi sai thành bài ôn cụ thể.",
  },
];

export const SOLUTION_STEPS: {
  id: string;
  number: number;
  title: string;
  description: string;
}[] = [
  {
    id: "diagnose",
    number: 1,
    title: "Chẩn đoán trình độ",
    description:
      "Bài kiểm tra đầu vào xác định điểm mạnh, điểm yếu theo từng kỹ năng.",
  },
  {
    id: "path",
    number: 2,
    title: "Dựng lộ trình riêng",
    description:
      "LexiPath tạo lộ trình với các checkpoint phù hợp mục tiêu và quỹ thời gian.",
  },
  {
    id: "loop",
    number: 3,
    title: "Học — ôn — thành thạo",
    description:
      "Ôn đúng Golden Time và biến mỗi lỗi sai trong đề thi thành bài ôn tiếp theo.",
  },
];

export const TRUST_PILLARS: {
  id: string;
  icon: React.ReactNode;
  stat: string;
  label: string;
  description: string;
}[] = [
  {
    id: "retention",
    icon: <Brain aria-hidden />,
    stat: "92%",
    label: "Ghi nhớ dài hạn",
    description: "Người học ôn đúng Golden Time nhớ lâu hơn rõ rệt.",
  },
  {
    id: "skills",
    icon: <Target aria-hidden />,
    stat: "5",
    label: "Kỹ năng từ vựng",
    description: "Nghĩa, Nghe, Chính tả, Cách dùng và Cụm từ — theo dõi độc lập.",
  },
  {
    id: "languages",
    icon: <RouteIcon aria-hidden />,
    stat: "3",
    label: "Ngôn ngữ",
    description: "Tiếng Anh, Nhật và Trung với hệ chữ viết riêng cho từng thứ tiếng.",
  },
];

export const LEARNING_LOOP_STEPS: LearningLoopStep[] = [
  { label: "Học từ mới", icon: <BookOpen aria-hidden />, tone: "primary" },
  { label: "Luyện tập", icon: <PenLine aria-hidden />, tone: "spelling" },
  { label: "Golden Time", icon: <Clock aria-hidden />, tone: "golden" },
  { label: "Thành thạo", icon: <Star aria-hidden />, tone: "success" },
];

export const EXAM_TO_SRS_STEPS: ExamToSrsStep[] = [
  {
    label: "Làm đề thi",
    sub: "TOEIC · IELTS · JLPT",
    icon: <FileText aria-hidden />,
    tone: "primary",
  },
  {
    label: "Từ trả lời sai",
    sub: "Tự động phát hiện",
    icon: <XCircle aria-hidden />,
    tone: "danger",
  },
  {
    label: "Vào Golden Time",
    sub: "Cửa sổ ôn tập tối ưu",
    icon: <Clock aria-hidden />,
    tone: "golden",
  },
  {
    label: "Thành thạo",
    sub: "Ghi nhớ dài hạn",
    icon: <Star aria-hidden />,
    tone: "success",
  },
];

export const DIAGNOSIS_SKILLS: DiagnosisSkill[] = [
  { label: "Nghĩa", pct: 82, tone: "meaning" },
  { label: "Nghe", pct: 64, tone: "listening" },
  { label: "Chính tả", pct: 71, tone: "spelling" },
  { label: "Cách dùng", pct: 58, tone: "usage" },
];

export const GOLDEN_TIME_REASONS = [
  "Từ vựng (Meaning)",
  "Phát âm (Listening)",
  "Chính tả (Spelling)",
];

export const GOLDEN_TIME_QUEUE: GoldenTimeQueueWord[] = [
  {
    word: "ubiquitous",
    meaning: "có mặt khắp nơi",
    skillLabel: "Meaning",
    skillTone: "meaning",
  },
  {
    word: "ephemeral",
    meaning: "thoáng qua, ngắn ngủi",
    skillLabel: "Spelling",
    skillTone: "spelling",
  },
  {
    word: "eloquent",
    meaning: "hùng hồn, lưu loát",
    skillLabel: "Usage",
    skillTone: "usage",
  },
];

export const LANGUAGES: (LanguageSupport & { id: string; flag: string })[] = [
  {
    id: "en",
    language: "Tiếng Anh",
    flag: "🇬🇧",
    scripts: ["Latin", "IPA"],
    features: ["TOEIC & IELTS", "Phát âm Anh–Mỹ", "Cụm từ học thuật"],
  },
  {
    id: "ja",
    language: "Tiếng Nhật",
    flag: "🇯🇵",
    scripts: ["Kanji", "Hiragana", "Katakana"],
    features: ["JLPT N5–N1", "Furigana tự động", "Âm on/kun"],
  },
  {
    id: "zh",
    language: "Tiếng Trung",
    flag: "🇨🇳",
    scripts: ["Hán tự", "Pinyin"],
    features: ["HSK 1–6", "Thanh điệu màu", "Nét bút mẫu"],
  },
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    name: "Miễn phí",
    isFree: true,
    features: [
      "1 lộ trình học",
      "20 từ mới mỗi ngày",
      "Golden Time cơ bản",
      "Theo dõi 5 kỹ năng",
    ],
    ctaLabel: "Bắt đầu miễn phí",
    ctaHref: "/register",
  },
  {
    name: "Pro",
    price: "79.000đ",
    isPopular: true,
    features: [
      "Lộ trình không giới hạn",
      "Từ mới không giới hạn",
      "Golden Time nâng cao",
      "Luyện thi TOEIC/IELTS/JLPT",
      "Chẩn đoán năng lực chi tiết",
    ],
    ctaLabel: "Dùng thử Pro",
    ctaHref: "/register",
  },
  {
    name: "Lifetime",
    price: "1.490.000đ",
    period: "trọn đời",
    features: [
      "Toàn bộ tính năng Pro",
      "Thanh toán một lần",
      "Ưu tiên tính năng mới",
      "Hỗ trợ ưu tiên",
    ],
    ctaLabel: "Mua trọn đời",
    ctaHref: "/register",
  },
];

export const FAQS: FaqItem[] = [
  {
    question: "Golden Time là gì?",
    answer:
      "Golden Time là cửa sổ thời gian tối ưu để ôn lại một từ — không quá sớm khiến lãng phí, không quá muộn khiến bạn đã quên. LexiPath tính toán thời điểm này riêng cho từng từ dựa trên lịch sử học của bạn.",
  },
  {
    question: "LexiPath khác gì so với app học từ vựng khác?",
    answer:
      "Thay vì danh sách từ chung chung, LexiPath dựng lộ trình cá nhân hóa với các checkpoint, nhắc ôn đúng Golden Time và biến mỗi lỗi sai trong bài thi thành bài ôn tiếp theo (exam-to-SRS loop).",
  },
  {
    question: "Tôi có cần thẻ tín dụng để bắt đầu không?",
    answer:
      "Không. Gói Miễn phí dùng được ngay mà không cần thẻ. Bạn có thể nâng cấp lên Pro bất cứ lúc nào.",
  },
  {
    question: "LexiPath hỗ trợ những ngôn ngữ nào?",
    answer:
      "Hiện tại LexiPath hỗ trợ tiếng Anh, tiếng Nhật và tiếng Trung, với hệ chữ viết và đặc thù phát âm riêng cho từng thứ tiếng.",
  },
];

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: "Sản phẩm",
    links: [
      { label: "Tính năng", href: anchor("features") },
      { label: "Golden Time", href: anchor("golden-time") },
      { label: "Bảng giá", href: anchor("pricing") },
    ],
  },
  {
    heading: "Tài khoản",
    links: [
      { label: "Đăng nhập", href: "/login" },
      { label: "Đăng ký", href: "/register" },
      { label: "Thiết lập lộ trình", href: "/onboarding" },
    ],
  },
  {
    heading: "Hỗ trợ",
    links: [
      { label: "Hỏi đáp", href: anchor("faq") },
      { label: "Liên hệ", href: anchor("faq") },
    ],
  },
];

/** Marketing feature icons re-exported so the page can reuse them for chips. */
export const MarketingIcons = {
  CalendarClock,
  CheckCircle2,
  Clock,
  Repeat,
  ScanSearch,
  Sparkles,
};
