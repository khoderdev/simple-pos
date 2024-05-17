// import { useAtom } from "jotai";
// import { useNavigate } from "react-router-dom";
// import { atomWithStorage } from "jotai/utils";
// import "./Tables.css";

// const seatAvailableAtom = atomWithStorage("seatAvailable", [
//   "Table 1",
//   "Table 2",
//   "Table 3",
//   "Table 4",
//   "Table 5",
//   "Table 6",
//   "Table 7",
//   "Table 8",
//   "Table 9",
// ]);
// const seatReservedAtom = atomWithStorage("seatReserved", []);

// const Tables = () => {
//   const [seatAvailable, setSeatAvailable] = useAtom(seatAvailableAtom);
//   const [seatReserved, setSeatReserved] = useAtom(seatReservedAtom);
//   const navigate = useNavigate();

//   const onClickData = (seat) => {
//     if (seatReserved.includes(seat)) {
//       setSeatAvailable([...seatAvailable, seat]);
//       setSeatReserved(seatReserved.filter((res) => res !== seat));
//     } else {
//       setSeatReserved([...seatReserved, seat]);
//       setSeatAvailable(seatAvailable.filter((res) => res !== seat));
//     }

//     // Set the selected table ID in localStorage
//     localStorage.setItem("selectedTableId", seat);

//     // Navigate to POSPage
//     navigate(`/pos/${seat}`);
//   };

//   return (
//     <div className="justify-center items-center">
//       <div className="tables-container">
//         <h1 className="table-heading">Tables</h1>
//         <div className="flex flex-col">
//           <DrawGrid
//             seatAvailable={seatAvailable}
//             seatReserved={seatReserved}
//             onClickData={onClickData}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// const DrawGrid = ({ seatAvailable, seatReserved, onClickData }) => {
//   const allSeats = [...seatAvailable, ...seatReserved].sort((a, b) => {
//     const aNum = parseInt(a.split(' ')[1]);
//     const bNum = parseInt(b.split(' ')[1]);
//     return aNum - bNum;
//   });

//   return (
//     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-9 gap-6 p-2">
//       {allSeats.map((table) => (
//         <div
//           className={`table ${seatAvailable.includes(table) ? 'available' : 'reserved'}`}
//           key={table}
//           onClick={() => onClickData(table)}
//         >
//           {table}
//           <span className="status-text">
//             {seatAvailable.includes(table) ? 'Available' : 'Reserved'}
//           </span>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Tables;


import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { atomWithStorage } from "jotai/utils";
import "./Tables.css";

const tableAvailableAtom = atomWithStorage("tableAvailable", [
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
const tableReservedAtom = atomWithStorage("tableReserved", []);

const Tables = () => {
  const [tableAvailable, setTableAvailable] = useAtom(tableAvailableAtom);
  const [tableReserved, setTableReserved] = useAtom(tableReservedAtom);
  const navigate = useNavigate();

  const onClickData = (table) => {
    if (tableReserved.includes(table)) {
      setTableAvailable([...tableAvailable, table]);
      setTableReserved(tableReserved.filter((res) => res !== table));
    } else {
      setTableReserved([...tableReserved, table]);
      setTableAvailable(tableAvailable.filter((res) => res !== table));
    }

    // Set the selected table ID in localStorage
    localStorage.setItem("selectedTableId", table);

    // Navigate to POSPage
    navigate(`/pos/${table}`);
  };

  return (
    <div className="justify-center items-center">
      <div className="tables-container">
        <h1 className="table-heading">Tables</h1>
        <div className="flex flex-col">
          <DrawGrid
            tableAvailable={tableAvailable}
            tableReserved={tableReserved}
            onClickData={onClickData}
          />
        </div>
      </div>
    </div>
  );
};

const DrawGrid = ({ tableAvailable, tableReserved, onClickData }) => {
  const allTables = [...tableAvailable, ...tableReserved].sort((a, b) => {
    const aNum = parseInt(a.split(' ')[1]);
    const bNum = parseInt(b.split(' ')[1]);
    return aNum - bNum;
  });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-9 gap-6 p-2">
      {allTables.map((table) => (
        <div
          className={`table ${tableAvailable.includes(table) ? 'available' : 'reserved'}`}
          key={table}
          onClick={() => onClickData(table)}
        >
          {table}
          <span className="status-text">
            {tableAvailable.includes(table) ? 'Available' : 'Reserved'}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Tables;
