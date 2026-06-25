import type { Metadata } from "next";
import { MOCK_ORDERS, MOCK_TRANSACTIONS } from "@/features/admin-payment";
import { OrdersClient } from "@/components/admin-payment/orders-client";

export const metadata: Metadata = { title: "Đơn hàng" };

export default function AdminPaymentOrdersPage() {
  return (
    <OrdersClient orders={MOCK_ORDERS} transactionsMap={MOCK_TRANSACTIONS} />
  );
}
