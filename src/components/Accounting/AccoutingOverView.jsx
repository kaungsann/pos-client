import { useState } from "react";
import PropTypes from "prop-types";
import { Icon } from "@iconify/react";

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
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Statement Report</h1>
      <MainTable data={tableData} />
    </div>
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
