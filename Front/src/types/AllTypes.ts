// Define the Order type
export interface Item {
  product: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  items: Item[];
  totalAmount: number;
  createdAt: string;
  status: string;
}
