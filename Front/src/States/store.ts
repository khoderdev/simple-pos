import { createStore, atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Order, Product, Table } from "../types/AllTypes";

// Define atoms for different states
export const ordersAtom = atom([]);
export const persistedIsLoggedInAtom = atomWithStorage("isLoggedIn", false);
export const isLoggedInAtom = atom(false);
export const tokenAtom = atom("");
export const userNameAtom = atomWithStorage("userName", "");
export const userRolesAtom = atomWithStorage("userRoles", ["Admin", "User"]);
export const Users = [
  { username: "khoder", password: "admin123", role: "Admin" },
  { username: "ucef", password: "user123", role: "User" },
];

export const startDateAtom = atom<string>("");
export const endDateAtom = atom<string>("");
export const selectedOrderAtom = atom<Order | null>(null);

export const productsAtom = atomWithStorage<Product[]>("Products", []);
export const isLoadingAtom = atom(false);
export const cartAtom = atom([]);
export const totalAmountAtom = atom(0);
export const orderSummaryAtom = atom(null);
export const isModalOpenAtom = atom(false);

export const tableAvailableAtom = atom<Table[]>([]);
export const tableReservedAtom = atom<Table[]>([]);

const store = createStore(
  ordersAtom,
  startDateAtom,
  endDateAtom,
  selectedOrderAtom,
  userNameAtom,
  isLoggedInAtom,
  tokenAtom,
  userRolesAtom,
  persistedIsLoggedInAtom,
  productsAtom,
  isLoadingAtom,
  cartAtom,
  totalAmountAtom,
  orderSummaryAtom,
  isModalOpenAtom,
  tableAvailableAtom,
  tableReservedAtom
);

export default store;
