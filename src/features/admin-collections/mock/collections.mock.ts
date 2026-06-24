import type {
  AdminCollection,
  AdminLesson,
  AdminLessonItem,
  AdminAccessRule,
  AdminCollectionVersion,
} from "../types";

export const MOCK_COLLECTIONS: AdminCollection[] = [
  {
    id: "c1", language_code: "ja", name: "Từ vựng JLPT N5", slug: "jlpt-n5",
    type: "roadmap",
    description: "800 từ vựng thiết yếu cho kỳ thi JLPT N5, phân chia theo chủ đề quen thuộc với người học tiếng Nhật sơ cấp.",
    thumbnail_url: "", total_items: 800, total_lessons: 8, min_plan: "free",
    free_lesson_count: 2, cert_type: "JLPT", level_min: "N5", level_max: "N5",
    sort_order: 1, is_featured: true, status_code: "published", updated: "11/06/2026",
    tags: ["JLPT N5", "Grammar", "Vocabulary"],
  },
  {
    id: "c2", language_code: "en", name: "1000 từ TOEIC thiết yếu", slug: "toeic-1000",
    type: "roadmap",
    description: "Bộ từ vựng TOEIC quan trọng nhất giúp đạt 700+ điểm.",
    thumbnail_url: "", total_items: 1000, total_lessons: 10, min_plan: "free",
    free_lesson_count: 3, cert_type: "TOEIC", level_min: "B1", level_max: "B2",
    sort_order: 2, is_featured: true, status_code: "published", updated: "10/06/2026",
    tags: ["TOEIC", "Business", "Vocabulary"],
  },
  {
    id: "c3", language_code: "zh", name: "HSK 3 từ thường dùng", slug: "hsk3-common",
    type: "roadmap",
    description: "600 từ HSK cấp 3, luyện đọc và nghe hiểu tiếng Trung trung cấp.",
    thumbnail_url: "", total_items: 600, total_lessons: 8, min_plan: "pro",
    free_lesson_count: 0, cert_type: "HSK", level_min: "HSK3", level_max: "HSK3",
    sort_order: 3, is_featured: false, status_code: "published", updated: "09/06/2026",
    tags: ["HSK", "Vocabulary"],
  },
  {
    id: "c4", language_code: "en", name: "IELTS Academic 5.0+", slug: "ielts-academic",
    type: "exam_prep",
    description: "Từ vựng học thuật thiết yếu cho IELTS Academic Band 5.0 trở lên.",
    thumbnail_url: "", total_items: 1200, total_lessons: 12, min_plan: "pro",
    free_lesson_count: 2, cert_type: "IELTS", level_min: "B2", level_max: "C1",
    sort_order: 4, is_featured: false, status_code: "draft", updated: "08/06/2026",
    tags: ["IELTS", "Academic"],
  },
  {
    id: "c5", language_code: "ja", name: "Từ vựng JLPT N4", slug: "jlpt-n4",
    type: "roadmap",
    description: "700 từ vựng JLPT N4, nối tiếp lộ trình sau N5.",
    thumbnail_url: "", total_items: 700, total_lessons: 7, min_plan: "pro",
    free_lesson_count: 1, cert_type: "JLPT", level_min: "N4", level_max: "N4",
    sort_order: 5, is_featured: false, status_code: "review", updated: "07/06/2026",
    tags: ["JLPT N4", "Grammar"],
  },
  {
    id: "c6", language_code: "en", name: "Business English — Phrases", slug: "business-phrases",
    type: "phrasebook",
    description: "300 cụm từ thực dụng trong môi trường làm việc quốc tế.",
    thumbnail_url: "", total_items: 300, total_lessons: 5, min_plan: "free",
    free_lesson_count: 5, cert_type: "Không có", level_min: "B1", level_max: "B2",
    sort_order: 6, is_featured: false, status_code: "published", updated: "06/06/2026",
    tags: ["Business", "Phrasal Verb"],
  },
  {
    id: "c7", language_code: "zh", name: "Giao tiếp tiếng Trung hàng ngày", slug: "daily-chinese",
    type: "thematic",
    description: "Các mẫu câu và từ vựng trong cuộc sống hằng ngày bằng tiếng Trung.",
    thumbnail_url: "", total_items: 250, total_lessons: 5, min_plan: "free",
    free_lesson_count: 5, cert_type: "Không có", level_min: "HSK1", level_max: "HSK2",
    sort_order: 7, is_featured: false, status_code: "archived", updated: "01/06/2026",
    tags: ["Daily", "Common"],
  },
];

export const MOCK_LESSONS: Record<string, AdminLesson[]> = {
  c1: [
    { id: "l1", collection_id: "c1", title: "Bài 1: Lời chào & Giới thiệu", subtitle: "Từ cơ bản nhất để bắt đầu", thumbnail_url: "", item_count: 20, estimated_minutes: 15, sort_order: 1, is_free: true, min_plan: "free", is_new: false, status_code: "published" },
    { id: "l2", collection_id: "c1", title: "Bài 2: Con số & Ngày tháng", subtitle: "Đếm số và nói về thời gian", thumbnail_url: "", item_count: 25, estimated_minutes: 20, sort_order: 2, is_free: true, min_plan: "free", is_new: false, status_code: "published" },
    { id: "l3", collection_id: "c1", title: "Bài 3: Gia đình & Mối quan hệ", subtitle: "Từ về thành viên gia đình", thumbnail_url: "", item_count: 22, estimated_minutes: 18, sort_order: 3, is_free: false, min_plan: "pro", is_new: false, status_code: "published" },
    { id: "l4", collection_id: "c1", title: "Bài 4: Thức ăn & Đồ uống", subtitle: "Từ vựng ẩm thực Nhật Bản", thumbnail_url: "", item_count: 24, estimated_minutes: 20, sort_order: 4, is_free: false, min_plan: "pro", is_new: false, status_code: "published" },
    { id: "l5", collection_id: "c1", title: "Bài 5: Màu sắc & Ngoại hình", subtitle: "Mô tả màu sắc và con người", thumbnail_url: "", item_count: 18, estimated_minutes: 15, sort_order: 5, is_free: false, min_plan: "pro", is_new: true, status_code: "draft" },
    { id: "l6", collection_id: "c1", title: "Bài 6: Phương tiện & Địa điểm", subtitle: "Di chuyển trong thành phố", thumbnail_url: "", item_count: 0, estimated_minutes: 0, sort_order: 6, is_free: false, min_plan: "pro", is_new: true, status_code: "draft" },
  ],
  c2: [
    { id: "l7", collection_id: "c2", title: "Unit 1: Office & Workplace", subtitle: "Từ vựng văn phòng cơ bản", thumbnail_url: "", item_count: 30, estimated_minutes: 25, sort_order: 1, is_free: true, min_plan: "free", is_new: false, status_code: "published" },
    { id: "l8", collection_id: "c2", title: "Unit 2: Finance & Accounting", subtitle: "Tài chính và kế toán", thumbnail_url: "", item_count: 35, estimated_minutes: 28, sort_order: 2, is_free: true, min_plan: "free", is_new: false, status_code: "published" },
    { id: "l9", collection_id: "c2", title: "Unit 3: Human Resources", subtitle: "Nhân sự và tuyển dụng", thumbnail_url: "", item_count: 28, estimated_minutes: 22, sort_order: 3, is_free: false, min_plan: "pro", is_new: false, status_code: "published" },
    { id: "l10", collection_id: "c2", title: "Unit 4: Marketing & Sales", subtitle: "Marketing và bán hàng", thumbnail_url: "", item_count: 32, estimated_minutes: 26, sort_order: 4, is_free: false, min_plan: "pro", is_new: false, status_code: "published" },
    { id: "l11", collection_id: "c2", title: "Unit 5: Legal & Compliance", subtitle: "Pháp lý và tuân thủ", thumbnail_url: "", item_count: 0, estimated_minutes: 0, sort_order: 5, is_free: false, min_plan: "pro", is_new: true, status_code: "draft" },
  ],
  c3: [
    { id: "l12", collection_id: "c3", title: "第1课：问候与介绍", subtitle: "Lời chào và giới thiệu", thumbnail_url: "", item_count: 25, estimated_minutes: 20, sort_order: 1, is_free: false, min_plan: "pro", is_new: false, status_code: "published" },
    { id: "l13", collection_id: "c3", title: "第2课：时间与日期", subtitle: "Thời gian và ngày tháng", thumbnail_url: "", item_count: 22, estimated_minutes: 18, sort_order: 2, is_free: false, min_plan: "pro", is_new: false, status_code: "published" },
    { id: "l14", collection_id: "c3", title: "第3课：交通与方向", subtitle: "Giao thông và chỉ đường", thumbnail_url: "", item_count: 20, estimated_minutes: 16, sort_order: 3, is_free: false, min_plan: "pro", is_new: true, status_code: "draft" },
  ],
};

export const MOCK_ITEMS: Record<string, AdminLessonItem[]> = {
  l1: [
    { id: "li1", item_id: "v1", sense_id: "s1", sort_order: 1, is_key_item: true, custom_example_id: null, word: "勉強", reading: "べんきょう", meaning: "Việc học" },
    { id: "li2", item_id: "v2", sense_id: "s2", sort_order: 2, is_key_item: true, custom_example_id: null, word: "約束", reading: "やくそく", meaning: "Lời hứa" },
    { id: "li3", item_id: "v3", sense_id: "s3", sort_order: 3, is_key_item: false, custom_example_id: null, word: "親切", reading: "しんせつ", meaning: "Tử tế" },
    { id: "li4", item_id: "v4", sense_id: "s4", sort_order: 4, is_key_item: false, custom_example_id: null, word: "経験", reading: "けいけん", meaning: "Kinh nghiệm" },
    { id: "li5", item_id: "v5", sense_id: "s5", sort_order: 5, is_key_item: false, custom_example_id: null, word: "成長", reading: "せいちょう", meaning: "Trưởng thành" },
    { id: "li6", item_id: "v6", sense_id: "s6", sort_order: 6, is_key_item: false, custom_example_id: null, word: "失敗", reading: "しっぱい", meaning: "Thất bại" },
    { id: "li7", item_id: "v7", sense_id: "s7", sort_order: 7, is_key_item: false, custom_example_id: null, word: "努力", reading: "どりょく", meaning: "Nỗ lực" },
  ],
  l2: [
    { id: "li11", item_id: "v11", sense_id: "s11", sort_order: 1, is_key_item: true, custom_example_id: null, word: "一", reading: "いち", meaning: "Một" },
    { id: "li12", item_id: "v12", sense_id: "s12", sort_order: 2, is_key_item: true, custom_example_id: null, word: "二", reading: "に", meaning: "Hai" },
    { id: "li13", item_id: "v13", sense_id: "s13", sort_order: 3, is_key_item: false, custom_example_id: null, word: "三", reading: "さん", meaning: "Ba" },
    { id: "li14", item_id: "v14", sense_id: "s14", sort_order: 4, is_key_item: false, custom_example_id: null, word: "今日", reading: "きょう", meaning: "Hôm nay" },
    { id: "li15", item_id: "v15", sense_id: "s15", sort_order: 5, is_key_item: false, custom_example_id: null, word: "明日", reading: "あした", meaning: "Ngày mai" },
  ],
  l7: [
    { id: "li20", item_id: "ve1", sense_id: "se1", sort_order: 1, is_key_item: true, custom_example_id: null, word: "accomplish", reading: "/əˈkɑːmplɪʃ/", meaning: "Hoàn thành" },
    { id: "li21", item_id: "ve2", sense_id: "se2", sort_order: 2, is_key_item: true, custom_example_id: null, word: "determine", reading: "/dɪˈtɜːrmɪn/", meaning: "Xác định" },
    { id: "li22", item_id: "ve3", sense_id: "se3", sort_order: 3, is_key_item: false, custom_example_id: null, word: "negotiate", reading: "/nɪˈɡoʊʃieɪt/", meaning: "Đàm phán" },
    { id: "li23", item_id: "ve4", sense_id: "se4", sort_order: 4, is_key_item: false, custom_example_id: null, word: "revenue", reading: "/ˈrevənjuː/", meaning: "Doanh thu" },
    { id: "li24", item_id: "ve5", sense_id: "se5", sort_order: 5, is_key_item: false, custom_example_id: null, word: "significant", reading: "/sɪɡˈnɪfɪkənt/", meaning: "Đáng kể" },
  ],
};

export const MOCK_ACCESS_RULES: Record<string, AdminAccessRule> = {
  c1: { id: "ar1", collection_id: "c1", required_tier: "free", free_lesson_count: 2, allow_trial: true, allow_one_time_purchase: false, is_active: true },
  c2: { id: "ar2", collection_id: "c2", required_tier: "free", free_lesson_count: 3, allow_trial: true, allow_one_time_purchase: false, is_active: true },
  c3: { id: "ar3", collection_id: "c3", required_tier: "pro", free_lesson_count: 0, allow_trial: true, allow_one_time_purchase: true, is_active: true },
  c4: { id: "ar4", collection_id: "c4", required_tier: "pro", free_lesson_count: 2, allow_trial: false, allow_one_time_purchase: false, is_active: false },
  c5: { id: "ar5", collection_id: "c5", required_tier: "pro", free_lesson_count: 1, allow_trial: true, allow_one_time_purchase: false, is_active: true },
  c6: { id: "ar6", collection_id: "c6", required_tier: "free", free_lesson_count: 5, allow_trial: false, allow_one_time_purchase: false, is_active: true },
  c7: { id: "ar7", collection_id: "c7", required_tier: "free", free_lesson_count: 5, allow_trial: false, allow_one_time_purchase: false, is_active: false },
};

export const MOCK_VERSIONS: Record<string, AdminCollectionVersion[]> = {
  c1: [
    { id: "cv3", version: "3.0", author: "Minh Anh", date: "11/06/2026 09:00", status: "published", note: "Thêm bài 5–6; cập nhật mô tả; sửa lỗi chính tả.", isCurrent: true },
    { id: "cv2", version: "2.0", author: "Thảo Nguyễn", date: "05/06/2026 14:30", status: "published", note: "Sửa lỗi audio bài 1–4, cập nhật thumbnail." },
    { id: "cv1", version: "1.0", author: "Minh Anh", date: "01/06/2026 10:00", status: "published", note: "Phát hành lần đầu với 4 bài học." },
  ],
  c5: [
    { id: "cv5a", version: "1.0-rc", author: "Duy Phạm", date: "07/06/2026 16:00", status: "review", note: "Gửi duyệt lần đầu.", isCurrent: true },
    { id: "cv5b", version: "0.9", author: "Duy Phạm", date: "04/06/2026 10:00", status: "draft", note: "Bản nháp ban đầu." },
  ],
};

export const BULK_WORDS: Record<string, Array<{ w: string; r: string; m: string }>> = {
  ja: [
    { w: "通じる", r: "つうじる", m: "Thông qua" }, { w: "手伝う", r: "てつだう", m: "Giúp đỡ" },
    { w: "集まる", r: "あつまる", m: "Tập hợp" }, { w: "決める", r: "きめる", m: "Quyết định" },
    { w: "覚える", r: "おぼえる", m: "Ghi nhớ" }, { w: "届く", r: "とどく", m: "Đến nơi" },
    { w: "伝える", r: "つたえる", m: "Truyền đạt" }, { w: "迷う", r: "まよう", m: "Lưỡng lự" },
    { w: "戻る", r: "もどる", m: "Quay lại" }, { w: "選ぶ", r: "えらぶ", m: "Lựa chọn" },
  ],
  en: [
    { w: "analyze", r: "/ˈænəlaɪz/", m: "Phân tích" }, { w: "evaluate", r: "/ɪˈvæljueɪt/", m: "Đánh giá" },
    { w: "implement", r: "/ˈɪmplɪment/", m: "Triển khai" }, { w: "optimize", r: "/ˈɒptɪmaɪz/", m: "Tối ưu" },
    { w: "prioritize", r: "/praɪˈɒrɪtaɪz/", m: "Ưu tiên" }, { w: "collaborate", r: "/kəˈlæbəreɪt/", m: "Hợp tác" },
    { w: "facilitate", r: "/fəˈsɪlɪteɪt/", m: "Hỗ trợ" }, { w: "demonstrate", r: "/ˈdemənstreɪt/", m: "Chứng minh" },
    { w: "investigate", r: "/ɪnˈvestɪɡeɪt/", m: "Điều tra" }, { w: "summarize", r: "/ˈsʌməraɪz/", m: "Tóm tắt" },
  ],
  zh: [
    { w: "理解", r: "lǐ jiě", m: "Hiểu" }, { w: "发展", r: "fā zhǎn", m: "Phát triển" },
    { w: "机会", r: "jī huì", m: "Cơ hội" }, { w: "影响", r: "yǐng xiǎng", m: "Ảnh hưởng" },
    { w: "解决", r: "jiě jué", m: "Giải quyết" }, { w: "成功", r: "chéng gōng", m: "Thành công" },
    { w: "准备", r: "zhǔn bèi", m: "Chuẩn bị" }, { w: "保护", r: "bǎo hù", m: "Bảo vệ" },
    { w: "改变", r: "gǎi biàn", m: "Thay đổi" }, { w: "提高", r: "tí gāo", m: "Nâng cao" },
  ],
};
