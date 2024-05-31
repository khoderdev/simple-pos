import { ClosedOrderViews } from "./views/closedOrdersViews";

// Define the Order type
export interface Item {
  totalAmount: number;
  product: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  tableId: any;
  _id: string;
  items: Item[];
  totalAmount: number;
  createdAt: string;
  status: string;
}

export type Product = {
  _id: string;
  name: string;
  image: string;
  price: number;
};

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

export enum CurrencyPosition {
  Left = "left",
  Right = "right",
}

export enum WeekStartDays {
  Auto = -1,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
  Sunday = 0,
}


export type AppViews = {
  closedOrders: ClosedOrderViews;
};