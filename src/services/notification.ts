// ============================================================
// Notification Service — /api/notifications
// 🔒 All endpoints require Auth
// ============================================================

import api from './api';
import type { Notification, PaginatedData } from '@/types';

export const notificationService = {
  // ─── List Notifications (paginated) ─────────────────────
  // GET /api/notifications?page=1&per_page=20&is_read=false
  //
  // Example:
  //   const result = await notificationService.getNotifications(1, 20, 'false');
  //   result.items.forEach(n => console.log(n.message, n.is_read));
  //
  async getNotifications(
    page = 1,
    perPage = 20,
    isRead?: 'true' | 'false'
  ): Promise<PaginatedData<Notification>> {
    let url = `/notifications?page=${page}&per_page=${perPage}`;
    if (isRead !== undefined) {
      url += `&is_read=${isRead}`;
    }
    return await api.getPaginated<Notification>(url);
  },

  // ─── Get Unread Count ───────────────────────────────────
  // GET /api/notifications/unread-count
  // Returns { unread_count: 5 }
  //
  async getUnreadCount(): Promise<{ unread_count: number }> {
    const response = await api.get<{ unread_count: number }>(
      '/notifications/unread-count'
    );
    return response.data;
  },

  // ─── Get Single Notification ────────────────────────────
  // GET /api/notifications/:id
  //
  async getNotification(id: number): Promise<Notification> {
    const response = await api.get<Notification>(`/notifications/${id}`);
    return response.data;
  },

  // ─── Mark as Read ───────────────────────────────────────
  // POST /api/notifications/:id/read
  //
  async markAsRead(id: number): Promise<void> {
    await api.post(`/notifications/${id}/read`);
  },

  // ─── Mark All as Read ───────────────────────────────────
  // POST /api/notifications/read-all
  //
  async markAllAsRead(): Promise<void> {
    await api.post('/notifications/read-all');
  },

  // ─── Delete Notification ────────────────────────────────
  // DELETE /api/notifications/:id
  //
  async deleteNotification(id: number): Promise<void> {
    await api.delete(`/notifications/${id}`);
  },
};

export default notificationService;
