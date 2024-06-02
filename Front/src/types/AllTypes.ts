// Define the Order type
export interface Item {
  totalAmount: number;
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

export interface Product {
  createdAt: string | number | Date;
  _id: string;
  name: string;
  price: string;
  quantity: number;
  image: string | null;
}

export interface NewProduct {
  name: string;
  price: string;
  quantity: number;
  image: string | File | null;
  isUploading: boolean;
}


export type CartItem = Product & {
  quantity: number;
  totalAmount: number;
};

export type Table = string;

export interface OrderItem {
  product: string;
  quantity: number;
  totalAmount: number;
}

export interface ProductNameMap {
  [productId: string]: string;
}

export interface DrawGridProps {
  tableAvailable: Table[];
  tableReserved: Table[];
  onClickData: (table: Table) => void;
}

export interface OrderDetailsProps {
  table: Table;
  orders: Order[];
  closeOrder: () => void;
}

export interface ToastProps {
  message: string;
}
