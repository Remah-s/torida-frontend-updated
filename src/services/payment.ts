// ============================================================
// Payment Service — /api/payments
// 🔒 All endpoints require Auth
// ============================================================

import api from './api';
import type { Payment, CreatePaymentData } from '@/types';

export const paymentService = {
  // ─── Get Payment for an Order ───────────────────────────
  // GET /api/payments/order/:order_id — Buyer or Seller
  //
  async getPaymentByOrder(orderId: number): Promise<Payment> {
    const response = await api.get<Payment>(
      `/payments/order/${orderId}`
    );
    return response.data;
  },

  // ─── Create Payment Record ──────────────────────────────
  // POST /api/payments — Buyer only
  // body: { order_id: 1, method: "cash_on_delivery" }
  //
  // Example:
  //   const payment = await paymentService.createPayment({
  //     order_id: 1,
  //     method: 'cash_on_delivery',
  //   });
  //
  async createPayment(data: CreatePaymentData): Promise<Payment> {
    const response = await api.post<Payment>('/payments', data);
    return response.data;
  },

  // ─── Process Payment (Simulated) ────────────────────────
  // POST /api/payments/:payment_id/pay — Buyer only
  // body (optional): { transaction_id: "TXN-..." }
  //
  async processPayment(
    paymentId: number,
    transactionId?: string
  ): Promise<Payment> {
    const response = await api.post<Payment>(
      `/payments/${paymentId}/pay`,
      transactionId ? { transaction_id: transactionId } : undefined
    );
    return response.data;
  },

  // ─── Refund Payment ─────────────────────────────────────
  // POST /api/payments/:payment_id/refund — Seller only
  // Only paid payments can be refunded.
  //
  async refundPayment(paymentId: number): Promise<Payment> {
    const response = await api.post<Payment>(
      `/payments/${paymentId}/refund`
    );
    return response.data;
  },
};

export default paymentService;
