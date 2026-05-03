export interface Coupon {
  id?: number;
  code: string;
  description?: string;
  isPercentage: boolean;
  discountValue: number;
  maxDiscount?: number;
  startAt?: string | null;
  expiryAt?: string | null;
  isActive?: boolean;
  createdAt?: string;
}
