import { MouseEventHandler, ReactNode } from "react";

export interface Item {
  _id: unknown;
  totalAmount: number;
  product: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  tableId: string;
  _id: string;
  items: Item[];
  table: {
    tableNumber(tableNumber: unknown): void;
    isReserved: string;
    status: string;
    tableId: string;
    _id: string;
  };
  totalAmount: number;
  createdAt: Date;
}

export interface Product {
  createdAt: Date | string | number;
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
}

export interface NewProduct {
  name: string;
  price: number;
  quantity: number;
  image: string | File | null;
  isUploading: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  totalAmount: number;
}

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

export interface OrderSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPrintModal?: boolean;
  orderDetails: Order | null;
}

export interface ModalProps {
  onClose: MouseEventHandler<HTMLDivElement>;
  children: ReactNode;
}

export interface LockContextValue {
  isLocked: boolean;
  lockApp: () => void;
  unlockApp: () => void;
}

export type SetCartFunction = (cart: CartItem[]) => void;

export type SetProductsFunction = (products: Product[]) => void;

export type SetOrdersFunction = (newValue: Order[]) => void;

export interface Cash {
  cashAmount: number;
  startDay: (initialCash: number) => void;
  endDay: () => DailyReport;
}

export interface DailyReport {
  startingCash: number;
  endingCash: number;
  totalSales: number;
}

// Define the shape of your API context
export interface ApiContextType {
  orders: Order[];
  loading: boolean;
  fetchOrders: () => void;
  closeOrder: (tableNumber: string) => Promise<void>;
  
}
