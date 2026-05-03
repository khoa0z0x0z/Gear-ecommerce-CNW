export interface Review {
  id: number;
  userId: number;
  userName?: string;
  productId: number;
  rating: number;
  comment?: string;
  isApproved: boolean;
  createdAt: string;
}

export interface ReviewUpsert {
  productId: number;
  rating: number;
  comment?: string;
}
