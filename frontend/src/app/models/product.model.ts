export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    oldPrice?: number;
    image: string;
    category: string;
    rating: string;
    isNew?: boolean;
}

export interface CartItem extends Product {
    quantity: number;
}
