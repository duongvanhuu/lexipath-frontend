import type {
  CurrentSubscription,
  SubscriptionFeature,
  SubscriptionPayment,
  SubscriptionPlan,
} from "./types";

export const MOCK_CURRENT_SUBSCRIPTION: CurrentSubscription = {
  plan: "free",
  // plan: "pro",
  // startDate: "01/05/2026",
  // renewalDate: "01/07/2026",
  // billingLabel: "79.000₫/tháng · thanh toán hàng tháng",
};

export const MOCK_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Miễn phí",
    monthly: 0,
    yearly: 0,
    description: "Dành cho người mới bắt đầu",
    featureList: [
      { label: "3 bộ sưu tập", included: true },
      { label: "10 từ mới/ngày", included: true },
      { label: "Golden Time cơ bản", included: true },
      { label: "Sổ tay (100 từ)", included: true },
      { label: "Từ điển đầy đủ", included: false },
      { label: "Thống kê nâng cao", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    monthly: 79000,
    yearly: 699000,
    description: "Dành cho người học nghiêm túc",
    highlighted: true,
    featureList: [
      { label: "Bộ sưu tập không giới hạn", included: true },
      { label: "Từ mới không giới hạn", included: true },
      { label: "Golden Time đầy đủ", included: true },
      { label: "Sổ tay không giới hạn", included: true },
      { label: "Từ điển đầy đủ", included: true },
      { label: "Thống kê nâng cao", included: true },
    ],
  },
];

export const MOCK_FEATURE_USAGE_FREE: SubscriptionFeature[] = [
  { id: "new-words", label: "Từ mới hôm nay", icon: "sparkles", type: "quota", used: 8, limit: 10 },
  { id: "collections", label: "Bộ sưu tập đang học", icon: "library", type: "quota", used: 2, limit: 3 },
  { id: "notebook", label: "Từ lưu trong sổ tay", icon: "notebook-pen", type: "quota", used: 78, limit: 100 },
  { id: "golden-time", label: "Golden Time review", icon: "alarm-clock", type: "locked", lockedNote: "Cần nâng cấp lên Pro" },
  { id: "stats", label: "Thống kê nâng cao", icon: "bar-chart-2", type: "locked", lockedNote: "Cần nâng cấp lên Pro" },
  { id: "dictionary", label: "Từ điển đầy đủ", icon: "book-open", type: "locked", lockedNote: "Cần nâng cấp lên Pro" },
];

export const MOCK_FEATURE_USAGE_PRO: SubscriptionFeature[] = [
  { id: "new-words", label: "Từ mới hôm nay", icon: "sparkles", type: "quota", used: 8, limit: 10 },
  { id: "collections", label: "Bộ sưu tập đang học", icon: "library", type: "quota", used: 2, limit: 3 },
  { id: "notebook", label: "Từ lưu trong sổ tay", icon: "notebook-pen", type: "quota", used: 78, limit: 100 },
  { id: "golden-time", label: "Golden Time review", icon: "alarm-clock", type: "available", availNote: "Không giới hạn · kỹ năng chi tiết" },
  { id: "stats", label: "Thống kê nâng cao", icon: "bar-chart-2", type: "available", availNote: "Heatmap, phân tích kỹ năng, XP ledger" },
  { id: "dictionary", label: "Từ điển đầy đủ", icon: "book-open", type: "available", availNote: "Tìm kiếm không giới hạn" },
];

export const MOCK_PAYMENT_HISTORY: SubscriptionPayment[] = [
  { id: "1", order: "#LP-2026-08422", plan: "Gói Pro", amount: "85.320₫", provider: "VNPay", status: "success", created: "01/06/2026" },
  { id: "2", order: "#LP-2026-08421", plan: "Gói Pro", amount: "−79.000₫", provider: "VNPay", status: "refunded", created: "02/05/2026" },
  { id: "3", order: "#LP-2026-08420", plan: "Gói Pro", amount: "85.320₫", provider: "VNPay", status: "refund_pending", created: "01/05/2026" },
  { id: "4", order: "#LP-2026-08419", plan: "Gói Pro", amount: "85.320₫", provider: "Thẻ ···· 4242", status: "failed", created: "01/04/2026" },
  { id: "5", order: "#LP-2026-08418", plan: "Gói Pro", amount: "85.320₫", provider: "Momo", status: "pending", created: "30/03/2026" },
  { id: "6", order: "#LP-2026-08417", plan: "Gói Pro", amount: "85.320₫", provider: "Momo", status: "success", created: "01/03/2026" },
];
