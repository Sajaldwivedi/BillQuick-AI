export interface Product {
  id: string;
  userId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface BillItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Bill {
  id: string;
  userId: string;
  customerName: string;
  items: BillItem[];
  total: number;
  createdAt: Date;
}
