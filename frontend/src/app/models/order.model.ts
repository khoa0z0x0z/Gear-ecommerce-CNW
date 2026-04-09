export interface Order {
    id: number;
    orderDate: string;
    totalAmount: number;
    status: string;
    items: OrderDetail[];
    shippingAddress: string;
    paymentMethod: string;
}

export interface OrderDetail {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
}
