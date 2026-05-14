import { useState, useEffect } from "react";
// import "./index.css";
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver';
import './output.css'
import Nav from './components/Nav'
function App() {
  const [weights, setweights] = useState([]);
  const [stock1, setstock1] = useState("no data found");
  const [stock2, setstock2] = useState("no data found");
  const [rate, setRate] = useState();
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://192.168.38.103:3000/data");
      const data = await response.json();
      setweights(data);
      const response2 = await fetch("http://192.168.38.103:3000/data2");
      const data2 = await response2.json();
      setstock1(data2);
      const response3 = await fetch("http://192.168.38.103:3000/data3");
      const data3 = await response3.json();
      setstock2(data3);
    };

    fetchData();
  });

  const exportToExcel = () => {
    // Get the table element by ID
    const table = document.getElementById("my-table");

    // Convert the HTML table to a worksheet
    const workbook = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });

    // Convert workbook to binary
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Save the file
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "table_data.xlsx");
  };
  const totalWeight = weights.reduce((sum, w) => sum + Number(w), 0);
  const totalCost = weights.reduce((sum, w) => sum + Number(w) * rate, 0);

  return (
    <>
      <Nav/> 
      {/* // stock details */}

      <div className="max-w-3xl mx-auto bg-gray-300 rounded-xl shadow-sm overflow-hidden mt-5 border border-gray-100">
        {/* Stock Cards - Compact Version */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
          {/* Wheat Stock Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 transition-all hover:shadow-sm">
            <div className="mb-3">
              <h3 className="text-base font-medium text-gray-700 flex gap-[3px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#000000"
                >
                  <path d="M240-120q-33 0-56.5-23.5T160-200v-342q-37-22-58.5-58.5T80-680q0-66 47-113t113-47h480q66 0 113 47t47 113q0 43-21.5 79.5T800-542v342q0 33-23.5 56.5T720-120H240Zm0-80h480v-388l40-24q18-11 29-29t11-39q0-33-23.5-56.5T720-760H240q-33 0-56.5 23.5T160-680q0 22 10.5 40.5T200-610l40 22v388Zm212-92q12 11 28.5 11t27.5-11l120-120q12-12 12-28.5T628-468L508-588q-11-12-27.5-12T452-588L332-468q-11 11-11 27.5t11 28.5l120 120Zm28-84-64-64 64-64 64 64-64 64Zm0-104Z" />
                </svg>
                Wheat Stock
              </h3>
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {stock1}{" "}
              <span className="text-sm font-normal text-gray-500"></span>
            </p>
          </div>

          {/* Rice Stock Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 transition-all hover:shadow-sm">
            <div className="mb-3">
              <h3 className="text-base font-medium text-gray-700 flex gap-[3px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#000000"
                >
                  <path d="M320-80v-70q-105-42-172.5-130T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 112-67.5 200T640-150v70H320Zm80-400h160v-310q-20-5-40-7.5t-40-2.5q-20 0-40 2.5t-40 7.5v310Zm-240 0h160v-277q-75 43-117.5 117T160-480Zm480 0h160q0-86-42.5-160T640-757v277ZM400-160h160v-44q72-29 133-76.5T784-400H176q30 72 91 119.5T400-204v44Zm0 0h160-160Z" />
                </svg>
                Rice Stock
              </h3>
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {stock2}{" "}
              <span className="text-sm font-normal text-gray-500"></span>
            </p>
          </div>

          {/* Total Stock Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 transition-all hover:shadow-sm">
            <div className="mb-3">
              <h3 className="text-base font-medium text-gray-700 flex gap-[3px]">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M240-160v-80l260-240-260-240v-80h480v120H431l215 200-215 200h289v120H240Z"/></svg>Total Stock
              </h3>
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {(stock1 + stock2)?(stock1 + stock2):0}{" "}
              <span className="text-sm font-normal text-gray-500"></span>
            </p>
          </div>
        </div>

        {/* Rate Input Section - Compact Version */}
        <div className="bg-gray-50 mx-6 mb-6 p-6 rounded-lg border border-gray-200">
          <div className="max-w-md mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center">
              <label className="text-base font-medium text-gray-700 mb-2 md:mb-0 md:mr-4">
                Rate per Metric Ton:
              </label>
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-700 font-semibold">₹</span>
                </div>
                <input
                  type="number"
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full pl-8 pr-12 py-2.5 text-base border border-gray-300 rounded-lg bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter rate"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">/Kg</span>
                </div>
              </div>
            </div>

            {/* Value Display - Compact */}
            
          </div>
        </div>
      </div>
      {/* table  */}
      <div className="flex justify-center mx-28 ">
        <table
          id="my-table"
          className="min-w-full border border-black  shadow-sm rounded-md overflow-hidden m-10"
        >
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2 border-b border-gray-300 text-sm font-medium text-gray-700">
                S.No
              </th>
              <th className="px-4 py-2 border-b border-gray-300 text-sm font-medium text-gray-700">
                Load 1 (kg)
              </th>
              <th className="px-4 py-2 border-b border-gray-300 text-sm font-medium text-gray-700">
                Cost
              </th>
            </tr>
          </thead>
          <tbody>
            {weights.map((weight, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-800">
                  {index + 1}
                </td>
                <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-800">
                  {weight}
                </td>
                <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-800">
                  {(Number(weight) * rate).toFixed(2)}
                </td>
              </tr>
            ))}
            <tr className="hover:bg-gray-100">
              <td className="px-4 py-2 border-b border-gray-400 bg-slate-100 text-sm text-gray-800">
                Total
              </td>
              <td className="px-4 py-2 border-b border-gray-400 bg-slate-100 text-sm text-gray-800">
                {totalWeight.toFixed(2)}
              </td>
              <td className="px-4 py-2 border-b border-gray-400 bg-slate-100 text-sm text-gray-800">
                {totalCost.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex justify-center">
        <button
          onClick={exportToExcel}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          export
        </button>
      </div>
    </>
  );
}

export default App;