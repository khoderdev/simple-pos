// useCloseOrderMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { tableAvailableAtom, tableReservedAtom } from "../States/store";

// useCloseOrderMutation.ts
const closeOrder = async (tableNumber: string): Promise<void> => {
  const response = await fetch(
    `http://localhost:5200/orders/close/${tableNumber}`,
    {
      method: "POST",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to close the order");
  }
  await response.json();
};

export const useCloseOrderMutation = () => {
  const queryClient = useQueryClient();
  const [, setTableAvailable] = useAtom(tableAvailableAtom);
  const [, setTableReserved] = useAtom(tableReservedAtom);

  return useMutation({
    mutationFn: (tableNumber: string) => closeOrder(tableNumber),
    onSuccess: async (_data, variables) => {
      const tableNumber = variables;
      setTableReserved((prev) =>
        prev.filter((table) => table !== `Table ${tableNumber}`)
      );
      setTableAvailable((prev) => [...prev, `Table ${tableNumber}`]);

      // Update the table status in the database
      await fetch(`http://localhost:5200/tables/reserved`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tableId: `Table ${tableNumber}`,
          isReserved: "Available",
        }),
      });

      queryClient.invalidateQueries({
        queryKey: ["orders", `Table ${tableNumber}`],
      });
      queryClient.invalidateQueries({
        queryKey: ["tables"],
      });
    },
  });
};

// const closeOrder = async (tableNumber: string): Promise<void> => {
//   const response = await fetch(
//     `http://localhost:5200/orders/close/${tableNumber}`,
//     {
//       method: "POST",
//     }
//   );
//   if (!response.ok) {
//     throw new Error("Failed to close the order");
//   }
//   await response.json();
// };

// export const useCloseOrderMutation = () => {
//   const queryClient = useQueryClient();
//   const [, setTableAvailable] = useAtom(tableAvailableAtom);
//   const [, setTableReserved] = useAtom(tableReservedAtom);

//   return useMutation({
//     mutationFn: (tableNumber: string) => closeOrder(tableNumber),
//     onSuccess: (_data, variables) => {
//       const tableNumber = variables;
//       setTableReserved((prev) =>
//         prev.filter((table) => table !== `Table ${tableNumber}`)
//       );
//       setTableAvailable((prev) => [...prev, `Table ${tableNumber}`]);
//       queryClient.invalidateQueries({
//         queryKey: ["orders", `Table ${tableNumber}`],
//       });
//     },
//   });
// };
