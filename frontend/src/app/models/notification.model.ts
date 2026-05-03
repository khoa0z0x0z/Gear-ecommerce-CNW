export interface Notification {
  id?: number;
  title: string;
  message: string;
  visibleToRoles?: string | null;
  visibleToUserIds?: string | null;
  expiresAt?: string | null;
  isActive?: boolean;
  createdAt?: string;
}
