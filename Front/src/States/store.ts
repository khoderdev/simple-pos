import { createStore, atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// Define atoms for different states
export const ordersAtom = atomWithStorage("Orders", []);
export const persistedIsLoggedInAtom = atomWithStorage("isLoggedIn", false);
export const isLoggedInAtom = atom(false);
export const tokenAtom = atom("");
export const userNameAtom = atomWithStorage("userName", "");
export const userRolesAtom = atomWithStorage("userRoles", ["Admin", "User"]);
export const Users = [
  { username: "khoder", password: "admin123", role: "Admin" },
  { username: "ucef", password: "user123", role: "User" },
];

const store = createStore(
  ordersAtom,
  userNameAtom,
  isLoggedInAtom,
  tokenAtom,
  userRolesAtom,
  persistedIsLoggedInAtom
);

export default store;
