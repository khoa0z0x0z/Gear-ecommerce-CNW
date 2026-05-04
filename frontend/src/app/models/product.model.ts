export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    oldPrice?: number;
    image?: string;
    imageUrls?: string[];
    category?: string;
    categoryName?: string;
    rating?: string;
    averageRating?: number;
    ratingCount?: number;
    totalStars?: number;
    isNew?: boolean;
    sold?: number;
}

export interface CartItem extends Product {
    quantity: number;
}

export interface Category {
    id: number;
    name: string;
    description?: string;
}
