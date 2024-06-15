import { atom, createStore } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { CartItem, Order, Product, Table } from "../types/AllTypes";
import {
  DefaultStateInterface,
  PosModes,
  DefaultDataInterface,
} from "../types/NewTypes";

// export const ordersAtom = atomWithStorage<Order[]>("Order",[]);
export const ordersAtom = atom<Order[]>([]);
export const salesAtom = atomWithStorage<Order[]>("Sales", []);
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

export const getTerminalAtom = atom((get) => get(terminalStateAtom));
export const terminalStateAtom = atom({ terminal: undefined });

export const orderSummaryAtom = atom<JSX.Element | null>(null);
export const isModalOpenAtom = atom(false);

export const startingCashAtom = atomWithStorage<number | null>(
  "startingCash",
  null
);
export const totalSalesAtom = atomWithStorage("totalSales", 0);
export const initialCash = atomWithStorage("initialCash", 0);

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

export const defaultState = atomWithStorage<DefaultStateInterface>(
  "pos-state",
  {
    q: "",
    added: [],
    selected: 0,
    selectedVariant: 0,
    quantity: 1,
    rate: 0,
    adjustment: 0,
    cartItemType: "quantity",
    tax: undefined,
  }
);

export const defaultData = atomWithStorage<DefaultDataInterface>(
  "pos-default-data",
  {
    defaultTax: undefined,
    defaultDiscount: undefined,
    defaultPaymentType: undefined,
    enableShortcuts: true,
    displayShortcuts: false,
    enableTouch: false,
    defaultMode: PosModes.pos,
    searchBox: true,
    customerBox: true,
    requireCustomerBox: false,
  }
);

const store = createStore(
  defaultState,
  defaultData,
  getTerminalAtom,
  terminalStateAtom,
  ordersAtom,
  salesAtom,
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
  tableReservedAtom,
  startingCashAtom,
  totalSalesAtom,
  initialCash
);

export default store;
