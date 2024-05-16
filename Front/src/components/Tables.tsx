// // import React from "react";
// // import "./app.css";

// // class Tables extends React.Component {
// //   constructor(props) {
// //     super(props);
// //     this.state = {
// //       seat: [
// //         "Table-1 ",
// //         "Table-2 ",
// //         "Table-3 ",
// //         "Table-4 ",
// //         "Table-5 ",
// //         "Table-6 ",
// //         "Table-7 ",
// //         "Table-8 ",
// //         "Table-9 ",
// //       ],
// //       seatAvailable: [
// //         "Table-1 ",
// //         "Table-2 ",
// //         "Table-3 ",
// //         "Table-4 ",
// //         "Table-5 ",
// //         "Table-6 ",
// //         "Table-7 ",
// //         "Table-8 ",
// //         "Table-9 ",
// //       ],
// //       seatReserved: [],
// //     };
// //   }

// //   onClickData(seat) {
// //     if (this.state.seatReserved.indexOf(seat) > -1) {
// //       this.setState({
// //         seatAvailable: this.state.seatAvailable.concat(seat),
// //         seatReserved: this.state.seatReserved.filter((res) => res !== seat),
// //       });
// //     } else {
// //       this.setState({
// //         seatReserved: this.state.seatReserved.concat(seat),
// //         seatAvailable: this.state.seatAvailable.filter((res) => res !== seat),
// //       });
// //     }
// //   }

// //   compareValues(seat, table) {
// //     if (this.state.seat.indexOf(seat) === this.props.table.indexOf(table)) {
// //       console.log(">>>>>>>>>");
// //     } else {
// //       console.log("^^^^^^^^^^");
// //     }
// //   }

// //   render() {
// //     return (
// //       <div className="body">
// //         <div className="header">
// //           <h1>Restaurant Seat Reservation System</h1>
// //         </div>
// //         <br />
// //         <div>
// //           <button className="btnSubmit" onClick={this.compareValues}>
// //             <b>check</b>
// //           </button>

// //           <DrawGrid
// //             seat={this.state.seat}
// //             available={this.state.seatAvailable}
// //             reserved={this.state.seatReserved}
// //             onClickData={this.onClickData.bind(this)}
// //             compareValues={this.compareValues.bind(this)}
// //           ></DrawGrid>
// //         </div>
// //         <div></div>
// //       </div>
// //     );
// //   }
// // }

// // class ResevationGrid extends React.Component {
// //   constructor(props) {
// //     super(props);
// //     this.state = {
// //       custName: "",
// //       tableNo: "",
// //       reservations: [],
// //     };
// //   }

// //   handleClick = () => {
// //     if (this.state.custName !== null && this.state.custName !== "") {
// //       let reservations = this.state.reservations;
// //       let obj = { custName: this.state.custName, tableNo: this.state.tableNo };
// //       reservations.push(obj);
// //       this.setState({
// //         reservations: reservations,
// //         custName: "",
// //         tableNo: "",
// //       });
// //     }
// //   };

// //   clickToDel = (i) => {
// //     let reservations = this.state.reservations;
// //     reservations.splice(i, 1);
// //     this.setState({
// //       reservations: reservations,
// //     });
// //   };

// //   compare(seat, table) {
// //     this.props.compareValues(seat, table);
// //   }

// //   handleSelect = (e) => {
// //     this.setState({
// //       tableNo: e.target.value,
// //     });
// //   };
// //   render() {
// //     return (
// //       <div>

// //       </div>
// //     );
// //   }
// // }

// // class DrawGrid extends React.Component {
// //   render() {
// //     return (
// //       <div className="container">
// //         <ResevationGrid table={this.props.seat} />
// //         <div className="tableGrid">
// //           <table className="grid">
// //             <tbody>
// //               <tr>
// //                 {this.props.seat.map((row) => (
// //                   <td
// //                     className={
// //                       this.props.reserved.indexOf(row) > -1
// //                         ? "reserved"
// //                         : "available"
// //                     }
// //                     key={row}
// //                     onClick={(e) => this.onClickSeat(row)}
// //                   >
// //                     {row}
// //                   </td>
// //                 ))}
// //               </tr>
// //             </tbody>
// //           </table>
// //         </div>
// //         <br />
// //         <div className="totalSeats">
// //           <AvailableList available={this.props.available} />
// //           <ReservedList reserved={this.props.reserved} />
// //         </div>
// //       </div>
// //     );
// //   }

// //   onClickSeat(seat) {
// //     this.props.onClickData(seat);
// //   }
// // }

// // class AvailableList extends React.Component {
// //   render() {
// //     const seatCount = this.props.available.length;
// //     return (
// //       <div className="left">
// //         <h4>
// //           Available Seats: ({seatCount === 0 ? "No seats available" : seatCount}
// //           )
// //         </h4>
// //         <ul>
// //           {this.props.available.map((res) => (
// //             <li key={res}>{res}</li>
// //           ))}
// //         </ul>
// //       </div>
// //     );
// //   }
// // }

// // class ReservedList extends React.Component {
// //   render() {
// //     return (
// //       <div className="right">
// //         <h4>Reserved Seats: ({this.props.reserved.length})</h4>
// //         <ul>
// //           {this.props.reserved.map((res) => (
// //             <li key={res}>{res}</li>
// //           ))}
// //         </ul>
// //       </div>
// //     );
// //   }
// // }

// // export default Tables;

// import { useState } from "react";
// import "./app.css";

// const Tables = () => {
//   const [seatAvailable, setSeatAvailable] = useState([
//     "Table-1",
//     "Table-2",
//     "Table-3",
//     "Table-4",
//     "Table-5",
//     "Table-6",
//     "Table-7",
//     "Table-8",
//     "Table-9",
//   ]);
//   const [seatReserved, setSeatReserved] = useState([]);

//   const onClickData = (seat) => {
//     if (seatReserved.includes(seat)) {
//       setSeatAvailable([...seatAvailable, seat]);
//       setSeatReserved(seatReserved.filter((res) => res !== seat));
//     } else {
//       setSeatReserved([...seatReserved, seat]);
//       setSeatAvailable(seatAvailable.filter((res) => res !== seat));
//     }
//   };

//   return (
//     <div className="">
//       <h1>Restaurant Seat Reservation System</h1>
//       <br />
//       <div>
//         <DrawGrid
//           seatAvailable={seatAvailable}
//           seatReserved={seatReserved}
//           onClickData={onClickData}
//         />
//       </div>
//     </div>
//   );
// };

// const DrawGrid = ({ seatAvailable, seatReserved, onClickData }) => {
//   return (
//     <div className="container">
//       <div className="tableGrid">
//         <table className="grid">
//           <tbody>
//             <tr>
//               {seatAvailable.map((row) => (
//                 <td
//                   className="available"
//                   key={row}
//                   onClick={() => onClickData(row)}
//                 >
//                   {row}
//                 </td>
//               ))}
//               {seatReserved.map((row) => (
//                 <td
//                   className="reserved"
//                   key={row}
//                   onClick={() => onClickData(row)}
//                 >
//                   {row}
//                 </td>
//               ))}
//             </tr>
//           </tbody>
//         </table>
//       </div>
//       <br />
//       <div className="totalSeats">
//         <AvailableList available={seatAvailable} />
//         <ReservedList reserved={seatReserved} />
//       </div>
//     </div>
//   );
// };

// const AvailableList = ({ available }) => {
//   const seatCount = available.length;
//   return (
//     <div className="left">
//       <h4>
//         Available Seats: ({seatCount === 0 ? "No seats available" : seatCount})
//       </h4>
//       <ul>
//         {available.map((res) => (
//           <li key={res}>{res}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// const ReservedList = ({ reserved }) => {
//   return (
//     <div className="right">
//       <h4>Reserved Seats: ({reserved.length})</h4>
//       <ul>
//         {reserved.map((res) => (
//           <li key={res}>{res}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Tables;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Tables.css";

const Tables = () => {
  const [seatAvailable, setSeatAvailable] = useState([
    "Table 1 ",
    "Table 2 ",
    "Table 3 ",
    "Table 4 ",
    "Table 5 ",
    "Table 6 ",
    "Table 7 ",
    "Table 8 ",
    "Table 9 ",
  ]);
  const [seatReserved, setSeatReserved] = useState([]);
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
    <div className="">
      <h1 className="text-center">Tables</h1>
      <br />
      <div>
        <DrawGrid
          seatAvailable={seatAvailable}
          seatReserved={seatReserved}
          onClickData={onClickData}
        />
      </div>
    </div>
  );
};

const DrawGrid = ({ seatAvailable, seatReserved, onClickData }) => {
  return (
    <div className="container">
      <div className="tableGrid">
        <table className="grid">
          <tbody>
            <tr>
              {seatAvailable.map((row) => (
                <td
                  className="available"
                  key={row}
                  onClick={() => onClickData(row)}
                >
                  {row}
                </td>
              ))}
              {seatReserved.map((row) => (
                <td
                  className="reserved"
                  key={row}
                  onClick={() => onClickData(row)}
                >
                  {row}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <br />
      <div className="totalSeats">
        <AvailableList available={seatAvailable} />
        <ReservedList reserved={seatReserved} />
      </div>
    </div>
  );
};

const AvailableList = ({ available }) => {
  const seatCount = available.length;
  return (
    <div className="left">
      <h4>
        Available Seats: ({seatCount === 0 ? "No seats available" : seatCount})
      </h4>
      <ul>
        {available.map((res) => (
          <li key={res}>{res}</li>
        ))}
      </ul>
    </div>
  );
};

const ReservedList = ({ reserved }) => {
  return (
    <div className="right">
      <h4>Reserved Seats: ({reserved.length})</h4>
      <ul>
        {reserved.map((res) => (
          <li key={res}>{res}</li>
        ))}
      </ul>
    </div>
  );
};

export default Tables;
