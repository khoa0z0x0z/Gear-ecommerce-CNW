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
    isNew?: boolean;
    sold?: number;
    isFavorited?: boolean;
}

export interface CartItem extends Product {
    quantity: number;
}

export interface Category {
    id: number;
    name: string;
    description?: string;
}
