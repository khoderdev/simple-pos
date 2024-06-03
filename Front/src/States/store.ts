// // // import { createStore, atom } from "jotai";
// // // import { atomWithStorage } from "jotai/utils";
// // // import {SetOrdersFunction, CartItem, Order, Product, Table } from "../types/AllTypes";

// // // // Define the ordersAtom atom with the setter function type
// // // export const ordersAtom = atom<Order[], SetOrdersFunction>(
// // //   [], // Initial value
// // //   (get) => get(ordersAtom) // Getter (optional)
// // // );
// // // // export const ordersAtom = atom([]);
// // // export const persistedIsLoggedInAtom = atomWithStorage("isLoggedIn", false);
// // // export const isLoggedInAtom = atom(false);
// // // export const tokenAtom = atom("");
// // // export const userNameAtom = atomWithStorage("userName", "");
// // // export const userRolesAtom = atomWithStorage("userRoles", ["Admin", "User"]);
// // // export const Users = [
// // //   { username: "khoder", password: "admin123", role: "Admin" },
// // //   { username: "ucef", password: "user123", role: "User" },
// // // ];

// // // export const startDateAtom = atom<string>("");
// // // export const endDateAtom = atom<string>("");
// // // export const selectedOrderAtom = atom<Order | null>(null);

// // // export const productsAtom = atomWithStorage<Product[]>("Products", []);
// // // export const isLoadingAtom = atom(false);
// // // export const cartAtom = atom<CartItem[]>([]);
// // // export const totalAmountAtom = atom(0);
// // // export const orderSummaryAtom = atom(null);
// // // export const isModalOpenAtom = atom(false);

// // // export const tableAvailableAtom = atom<Table[]>([]);
// // // export const tableReservedAtom = atom<Table[]>([]);

// // // const store = createStore(
// // //   ordersAtom,
// // //   startDateAtom,
// // //   endDateAtom,
// // //   selectedOrderAtom,
// // //   userNameAtom,
// // //   isLoggedInAtom,
// // //   tokenAtom,
// // //   userRolesAtom,
// // //   persistedIsLoggedInAtom,
// // //   productsAtom,
// // //   isLoadingAtom,
// // //   cartAtom,
// // //   totalAmountAtom,
// // //   orderSummaryAtom,
// // //   isModalOpenAtom,
// // //   tableAvailableAtom,
// // //   tableReservedAtom
// // // );

// // // export default store;

// // import { createStore, atom } from "jotai";
// // import { atomWithStorage } from "jotai/utils";
// // import {
// //   CartItem,
// //   Order,
// //   Product,
// //   Table,
// // } from "../types/AllTypes";

// // // Define the ordersAtom atom with the correct setter function type
// // export const ordersAtom = atom<Order[], Order[], void>(
// //   [], // Initial value
// //   (get, set, newValue) => {
// //     set(ordersAtom, newValue);
// //   }
// // );

// // export const persistedIsLoggedInAtom = atomWithStorage("isLoggedIn", false);
// // export const isLoggedInAtom = atom(false);
// // export const tokenAtom = atom("");
// // export const userNameAtom = atomWithStorage("userName", "");
// // export const userRolesAtom = atomWithStorage("userRoles", ["Admin", "User"]);
// // export const Users = [
// //   { username: "khoder", password: "admin123", role: "Admin" },
// //   { username: "ucef", password: "user123", role: "User" },
// // ];

// // export const startDateAtom = atom<string>("");
// // export const endDateAtom = atom<string>("");
// // export const selectedOrderAtom = atom<Order | null>(null);

// // export const productsAtom = atomWithStorage<Product[]>("Products", []);
// // export const isLoadingAtom = atom(false);
// // export const cartAtom = atom<CartItem[]>([]);
// // export const totalAmountAtom = atom(0);
// // export const orderSummaryAtom = atom(null);
// // export const isModalOpenAtom = atom(false);

// // export const tableAvailableAtom = atom<Table[]>([]);
// // export const tableReservedAtom = atom<Table[]>([]);

// // const store = createStore(
// //   ordersAtom,
// //   startDateAtom,
// //   endDateAtom,
// //   selectedOrderAtom,
// //   userNameAtom,
// //   isLoggedInAtom,
// //   tokenAtom,
// //   userRolesAtom,
// //   persistedIsLoggedInAtom,
// //   productsAtom,
// //   isLoadingAtom,
// //   cartAtom,
// //   totalAmountAtom,
// //   orderSummaryAtom,
// //   isModalOpenAtom,
// //   tableAvailableAtom,
// //   tableReservedAtom
// // );

// // export default store;

// import { atom, createStore } from "jotai";
// import { atomWithStorage } from "jotai/utils";
// import { CartItem, Order, Product, Table } from "../types/AllTypes";

// export const ordersAtom = atom<Order[]>([]); // Simple atom with Order array
// export const persistedIsLoggedInAtom = atomWithStorage("isLoggedIn", false);
// export const isLoggedInAtom = atom(false);
// export const tokenAtom = atom("");
// export const userNameAtom = atomWithStorage("userName", "");
// export const userRolesAtom = atomWithStorage("userRoles", ["Admin", "User"]);
// export const startDateAtom = atom<string>("");
// export const endDateAtom = atom<string>("");
// export const selectedOrderAtom = atom<Order | null>(null);
// export const productsAtom = atomWithStorage<Product[]>("Products", []);
// export const isLoadingAtom = atom(false);
// export const cartAtom = atom<CartItem[]>([]);
// export const totalAmountAtom = atom(0);
// export const orderSummaryAtom = atom(null);
// export const isModalOpenAtom = atom(false);
// export const tableAvailableAtom = atom<Table[]>([]);
// export const tableReservedAtom = atom<Table[]>([]);

// const store = createStore(
//   ordersAtom,
//   startDateAtom,
//   endDateAtom,
//   selectedOrderAtom,
//   userNameAtom,
//   isLoggedInAtom,
//   tokenAtom,
//   userRolesAtom,
//   persistedIsLoggedInAtom,
//   productsAtom,
//   isLoadingAtom,
//   cartAtom,
//   totalAmountAtom,
//   orderSummaryAtom,
//   isModalOpenAtom,
//   tableAvailableAtom,
//   tableReservedAtom
// );

// export default store;
// store/index.ts
import { atom, createStore } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { CartItem, Order, Product, Table } from "../types/AllTypes";

// export const ordersAtom = atomWithStorage<Order[]>("Order",[]);
export const ordersAtom = atom<Order[]>([]);
export const orderStatusAtom = atom<{ [key: string]: string }>({});
export const persistedIsLoggedInAtom = atomWithStorage("isLoggedIn", false);
export const isLoggedInAtom = atom(false);
export const tokenAtom = atom("");
export const userNameAtom = atomWithStorage("userName", "");
export const userRolesAtom = atomWithStorage("userRoles", ["Admin", "User"]);
export const startDateAtom = atom<string>("");
export const endDateAtom = atom<string>("");
export const selectedOrderAtom = atom<Order | null>(null);
export const productsAtom = atomWithStorage<Product[]>("Products", []);
export const isLoadingAtom = atom(false);
export const cartAtom = atom<CartItem[]>([]);
export const totalAmountAtom = atom(0);
export const orderSummaryAtom = atom<JSX.Element | null>(null); // Update type here
export const isModalOpenAtom = atom(false);
// export const tableAvailableAtom = atom<Table[]>([]);
// export const tableReservedAtom = atom<Table[]>([]);

export const tableAvailableAtom = atomWithStorage<Table[]>("tableAvailable", [
  "Table 1",
  "Table 2",
  "Table 3",
  "Table 4",
  "Table 5",
  "Table 6",
  "Table 7",
  "Table 8",
  "Table 9",
]);

export const tableReservedAtom = atomWithStorage<Table[]>("tableReserved", []);

const store = createStore(
  ordersAtom,
  orderStatusAtom,
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
