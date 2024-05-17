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
//     <div className="tables-container">
//       <h1 className="table-heading">Tables</h1>
//       <div className="grid-container">
//         <DrawGrid
//           seatAvailable={seatAvailable}
//           seatReserved={seatReserved}
//           onClickData={onClickData}
//         />
//       </div>
//       <div className="total-seats">
//         <AvailableList available={seatAvailable} />
//         <ReservedList reserved={seatReserved} />
//       </div>
//     </div>
//   );
// };

// const DrawGrid = ({ seatAvailable, seatReserved, onClickData }) => {
//   return (
//     <div className="table-grid">
//       <table className="grid">
//         <tbody>
//           <tr>
//             {seatAvailable.map((row) => (
//               <td
//                 className="available"
//                 key={row}
//                 onClick={() => onClickData(row)}
//               >
//                 {row}
//               </td>
//             ))}
//             {seatReserved.map((row) => (
//               <td
//                 className="reserved"
//                 key={row}
//                 onClick={() => onClickData(row)}
//               >
//                 {row}
//               </td>
//             ))}
//           </tr>
//         </tbody>
//       </table>
//     </div>
//   );
// };

// const AvailableList = ({ available }) => {
//   const seatCount = available.length;
//   return (
//     <div className="seat-list">
//       <h2 className="list-heading">Available Tables</h2>
//       <ul>
//         {available.map((res) => (
//           <li key={res}>{res}</li>
//         ))}
//       </ul>
//       <p className="seat-count">{`Total: ${seatCount}`}</p>
//     </div>
//   );
// };

// const ReservedList = ({ reserved }) => {
//   return (
//     <div className="seat-list">
//       <h2 className="list-heading">Reserved Tables</h2>
//       <ul>
//         {reserved.map((res) => (
//           <li key={res}>{res}</li>
//         ))}
//       </ul>
//       <p className="seat-count">{`Total: ${reserved.length}`}</p>
//     </div>
//   );
// };

// export default Tables;

import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { atomWithStorage } from "jotai/utils";
import "./Tables.css";

const seatAvailableAtom = atomWithStorage("seatAvailable", [
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
const seatReservedAtom = atomWithStorage("seatReserved", []);

const Tables = () => {
  const [seatAvailable, setSeatAvailable] = useAtom(seatAvailableAtom);
  const [seatReserved, setSeatReserved] = useAtom(seatReservedAtom);
  const navigate = useNavigate();

  const onClickData = (seat) => {
    if (seatReserved.includes(seat)) {
      setSeatAvailable([...seatAvailable, seat]);
      setSeatReserved(seatReserved.filter((res) => res !== seat));
    } else {
      setSeatReserved([...seatReserved, seat]);
      setSeatAvailable(seatAvailable.filter((res) => res !== seat));
    }

    // Set the selected table ID in localStorage
    localStorage.setItem("selectedTableId", seat);

    // Navigate to POSPage
    navigate(`/pos/${seat}`);
  };

  return (
    <div className="flex justify-center items-center">
      <div className="tables-container">
        <h1 className="table-heading">Tables</h1>
        <div className="flex flex-col">
          <DrawGrid
            seatAvailable={seatAvailable}
            seatReserved={seatReserved}
            onClickData={onClickData}
          />
        </div>
        <div className="total-seats">
          <AvailableList available={seatAvailable} />
          <ReservedList reserved={seatReserved} />
        </div>
      </div>
    </div>
  );
};

const DrawGrid = ({ seatAvailable, seatReserved, onClickData }) => {
  return (
    <div className="table-grid">
      {seatAvailable.map((table) => (
        <div
          className="table available"
          key={table}
          onClick={() => onClickData(table)}
        >
          {table}
        </div>
      ))}
      {seatReserved.map((table) => (
        <div
          className="table reserved"
          key={table}
          onClick={() => onClickData(table)}
        >
          {table}
        </div>
      ))}
    </div>
  );
};

const AvailableList = ({ available }) => {
  const seatCount = available.length;
  return (
    <div className="seat-list">
      <h2 className="list-heading">Available Tables</h2>
      <ul>
        {available.map((res) => (
          <li key={res}>{res}</li>
        ))}
      </ul>
      <p className="seat-count">{`Total: ${seatCount}`}</p>
    </div>
  );
};

const ReservedList = ({ reserved }) => {
  return (
    <div className="seat-list">
      <h2 className="list-heading">Reserved Tables</h2>
      <ul>
        {reserved.map((res) => (
          <li key={res}>{res}</li>
        ))}
      </ul>
      <p className="seat-count">{`Total: ${reserved.length}`}</p>
    </div>
  );
};

export default Tables;
