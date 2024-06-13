import { MouseEventHandler, ReactNode } from "react";
export interface Item {
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
    isReserved: string;
    status: string;
    tableId: string;
    _id: string;
  };
  totalAmount: number;
  createdAt: string;
}

export interface Product {
  createdAt: string | number | Date;
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
