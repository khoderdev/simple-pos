// import { DateTime } from "luxon";

// export const POS2 = async (productId: number) => {
//   let price = 0;

//   try {
//     const response = await fetch(
//       `http://localhost:2000/api/products/${productId}`
//     );
//     if (!response.ok) {
//       throw new Error("Failed to fetch product");
//     }
//     const product = await response.json();

//     if (product.basePrice) {
//       price = product.basePrice;
//     }

//     if (product.prices && product.prices.length > 0) {
//       for (let itemPrice of product.prices) {
//         if (!itemPrice.basePrice) {
//           continue;
//         }

//         // Based on date
//         if (itemPrice.date) {
//           if (
//             DateTime.fromISO(itemPrice.date).toFormat("d") ===
//             DateTime.now().toFormat("d")
//           ) {
//             price = itemPrice.basePrice;
//             break;
//           }
//         }

//         // Based on time
//         if (itemPrice.time && itemPrice.timeTo) {
//           if (
//             DateTime.fromISO(itemPrice.time).toFormat("HH:mm") >=
//               DateTime.now().toFormat("HH:mm") &&
//             DateTime.fromISO(itemPrice.timeTo).toFormat("HH:mm") <=
//               DateTime.now().toFormat("HH:mm")
//           ) {
//             price = itemPrice.basePrice;
//             break;
//           }
//         }

//         // Based on day
//         if (itemPrice.day) {
//           if (itemPrice.day === DateTime.now().toFormat("cccc")) {
//             price = itemPrice.basePrice;
//             break;
//           }
//         }

//         // Based on week
//         if (itemPrice.week) {
//           if (itemPrice.week === +DateTime.now().toFormat("W")) {
//             price = itemPrice.basePrice;
//             break;
//           }
//         }

//         // Based on month
//         if (itemPrice.month) {
//           if (itemPrice.month === +DateTime.now().toFormat("L")) {
//             price = itemPrice.basePrice;
//             break;
//           }
//         }

//         // Based on quarter
//         if (itemPrice.quarter) {
//           if (itemPrice.quarter === +DateTime.now().toFormat("q")) {
//             price = itemPrice.basePrice;
//             break;
//           }
//         }
//       }
//     }
//   } catch (error) {
//     console.error("Failed to fetch product price:", error);
//   }

//   return price;
// };

import { DateTime } from "luxon";
import { Product, CartItem, Tax, Discount } from "../types/AllTypes";
// import { useMemo } from "react";
// import { useAtom } from "jotai"; // Assuming this is the state management library used
// import { defaultData } from "../States/store"; // Assuming defaultData is imported
// import { PosModes } from "./PosMode"; // Assuming PosModes is imported


export const finalTotal = (
  added: CartItem[],
  tax?: Tax,
  discountAmount?: number,
  discountRateType?: string,
  discount?: Discount
): number => {
  const subtotal = subTotal(added);
  const taxTotalAmount = taxTotal(added, tax);
  const discountTotalAmount = discountTotal(
    added,
    tax,
    discountAmount,
    discountRateType,
    discount
  );
  const couponTotalAmount = couponTotal();

  return subtotal + taxTotalAmount - discountTotalAmount - couponTotalAmount;
};

export const getRealProductPrice = (item: Product): number => {
  let price = 0;

  if (!item) return price;

  if (item.basePrice) {
    price = item.basePrice;
  }

  if (item.prices && item.prices.length > 0) {
    for (const itemPrice of item.prices) {
      if (!itemPrice.basePrice) {
        continue;
      }

      // Based on date
      if (
        itemPrice.date &&
        DateTime.fromISO(itemPrice.date).toFormat("d") ===
          DateTime.now().toFormat("d")
      ) {
        price = itemPrice.basePrice;
        break;
      }

      // Based on time
      if (
        itemPrice.time &&
        itemPrice.timeTo &&
        DateTime.fromISO(itemPrice.time).toFormat("HH:mm") >=
          DateTime.now().toFormat("HH:mm") &&
        DateTime.fromISO(itemPrice.timeTo).toFormat("HH:mm") <=
          DateTime.now().toFormat("HH:mm")
      ) {
        price = itemPrice.basePrice;
        break;
      }

      // Based on day
      if (itemPrice.day && itemPrice.day === DateTime.now().toFormat("cccc")) {
        price = itemPrice.basePrice;
        break;
      }

      // Based on week
      if (itemPrice.week && itemPrice.week === +DateTime.now().toFormat("W")) {
        price = itemPrice.basePrice;
        break;
      }

      // Based on month
      if (
        itemPrice.month &&
        itemPrice.month === +DateTime.now().toFormat("L")
      ) {
        price = itemPrice.basePrice;
        break;
      }

      // Based on quarter
      if (
        itemPrice.quarter &&
        itemPrice.quarter === +DateTime.now().toFormat("q")
      ) {
        price = itemPrice.basePrice;
        break;
      }
    }
  }

  return price;
};
