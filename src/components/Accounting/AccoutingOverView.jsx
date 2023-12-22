import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Icon } from "@iconify/react";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Input,
  Listbox,
  ListboxItem,
} from "@nextui-org/react";

const tableData = [
  { type: "Gross Sale", balance: 100 },
  { type: "Purchase Cost", balance: 100 },
  {
    type: "Opex",
    balance: 200,
    subRows: [
      { type: "Fuel", balance: 50 },
      { type: "Salary", balance: 150 },
    ],
  },
  {
    type: "Fixed Cost",
    balance: 200,
    subRows: [
      { type: "Rental", balance: 50 },
      { type: "Loan", balance: 150 },
    ],
  },
];

const TableRow = ({ type, balance, subRows }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      <tr>
        <td className="border px-4 py-2">
          {type}
          {subRows && (
            <button
              className="text-blue-500 cursor-pointer focus:outline-none"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? (
                <Icon icon="ep:arrow-up" />
              ) : (
                <Icon icon="ep:arrow-down" />
              )}{" "}
            </button>
          )}
        </td>
        <td className="border px-4 py-2">{balance}</td>
      </tr>
      {!isCollapsed && subRows && (
        <>
          {subRows.map((row, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{row.type}</td>
              <td className="border px-4 py-2">{row.balance}</td>
            </tr>
          ))}
          <tr>
            <td className="border px-4 py-2">Total</td>
            <td className="border px-4 py-2">
              {subRows.reduce((total, row) => total + row.balance, 0)}
            </td>
          </tr>
        </>
      )}
    </>
  );
};

const MainTable = ({ data }) => (
  <table className="table-auto">
    <tbody>
      {data.map((row, index) => (
        <TableRow key={index} {...row} />
      ))}
      <tr>
        <td className="border px-4 py-2">Total Balance</td>
        <td className="border px-4 py-2">
          {data.reduce((total, row) => total + row.balance, 0)}
        </td>
      </tr>
    </tbody>
  </table>
);

const AccoutingOverView = () => {
  return (
    <>
      <div className="flex items-center">
        <h2 className="text-xl w-52 text-slate-600 font-semibold">
          Statement Report
        </h2>
        <div className="flex w-full justify-center">
          <Popover
            placement="bottom"
            classNames={{
              base: ["p-0 rounded-sm"],
              content: ["p-0 mx-2 rounded-sm"],
            }}
          >
            <PopoverTrigger>
              <button className="flex px-3 py-1.5 bg-slate-200 hover:bg-slate-300 rounded-sm">
                <Icon icon="uiw:date" className="text-slate-500 text-md" />
                <span className="text-sm ml-2">2023</span>
              </button>
            </PopoverTrigger>
            <PopoverContent>
              <Listbox>
                <ListboxItem className="rounded-none">This Month</ListboxItem>
                <ListboxItem className="rounded-none">This Quarter</ListboxItem>
                <ListboxItem className="border-b-slate-300 border-b-2 rounded-sm">
                  This Funancial
                </ListboxItem>

                <ListboxItem className="rounded-none">Last Month</ListboxItem>
                <ListboxItem className="rounded-none">Last Quarter</ListboxItem>
                <ListboxItem className="border-b-slate-300 border-b-2 rounded-none">
                  Last Funancial Year
                </ListboxItem>
              </Listbox>
              <div className="flex items-center py-3">
                <div className="flex items-center mr-3">
                  <span>From :</span>
                  <input
                    type="date"
                    placeholder="Select date"
                    className="border-none ml-2"
                  />
                </div>

                <div className="flex items-center">
                  <span>To :</span>
                  <input
                    type="date"
                    placeholder="Select date"
                    className="border-none ml-2"
                  />
                </div>
                <button className="px-3 py-1 hover:opacity-70 rounded-md mx-3 text-white font-semibold bg-[#56488f]">
                  Apply
                </button>
              </div>
            </PopoverContent>
          </Popover>

          <button className="flex px-3 mx-3 py-1.5 bg-slate-200 hover:bg-slate-300 rounded-sm">
            <Icon icon="carbon:filter" className="text-slate-500 text-xl" />

            <span className="text-sm ml-2">Filter</span>
          </button>
          <button className="flex px-3 mx-3 py-1.5 bg-slate-200 hover:bg-slate-300 rounded-sm">
            <Icon
              icon="mdi:report-timeline"
              className="text-slate-500 text-xl"
            />
            <span className="text-sm ml-2">Report</span>
          </button>
        </div>
      </div>
      <div className="container mx-auto mt-8">
        {/* <h1 className="text-xl font-bold mb-4">Statement Report</h1> */}
        <MainTable data={tableData} />
      </div>
    </>
  );
};

MainTable.propTypes = {
  data: PropTypes.array,
};

TableRow.propTypes = {
  type: PropTypes.string,
  balance: PropTypes.number,
  subRows: PropTypes.array,
};

export default AccoutingOverView;
