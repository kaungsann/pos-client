import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { BASE_URL } from "../Api";
import axios from "axios";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfYear,
  endOfYear,
  format,
  subMonths,
  subYears,
  startOfQuarter,
  endOfQuarter,
  subQuarters,
} from "date-fns";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Listbox,
  ListboxItem,
  Dropdown,
  DropdownItem,
  DropdownTrigger,
  DropdownMenu,
  Button,
  Spinner,
} from "@nextui-org/react";

import { useSelector } from "react-redux";

const AccoutingOverView = () => {
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(["text"]));

  const [text, setText] = useState("This Month");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [expandedIndex, setExpandedIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  let [account, setAccount] = useState([]);
  let [totalYear, setTotalYear] = useState([]);
  const token = useSelector((state) => state.IduniqueData);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const ACCOUNT_API = {
    INDEX: BASE_URL + "/account/totals",
    YEAR: BASE_URL + "/account/totalByYear",
  };

  const handleDateSelection = React.useCallback(
    (option) => {
      const currentDate = new Date();

      switch (option) {
        case "This Weekend": {
          const startOfWeekend = startOfWeek(currentDate, { weekStartsOn: 6 }); // Saturday
          const endOfWeekend = endOfWeek(currentDate, { weekStartsOn: 6 }); // Sunday
          setStartDate(format(startOfWeekend, "MM-dd-yyyy"));
          setEndDate(format(endOfWeekend, "MM-dd-yyyy"));
          setText("This Weekend");
          break;
        }
        case "This Month": {
          setStartDate(format(startOfMonth(currentDate), "MM-dd-yyyy"));
          setEndDate(format(endOfMonth(currentDate), "MM-dd-yyyy"));
          // setText(format(addMonths(currentDate, -1), "MMMM"));
          setText(format(currentDate, "MMMM"));
          break;
        }

        case "This Year": {
          setStartDate(format(startOfYear(currentDate), "MM-dd-yyyy"));
          setEndDate(format(endOfYear(currentDate), "MM-dd-yyyy"));
          setText(new Date().getFullYear());
          break;
        }

        case "Last Month": {
          const lastMonthStartDate = startOfMonth(subMonths(currentDate, 1));
          const lastMonthEndDate = endOfMonth(subMonths(currentDate, 1));
          setStartDate(format(lastMonthStartDate, "MM-dd-yyyy"));
          setEndDate(format(lastMonthEndDate, "MM-dd-yyyy"));
          setText(format(lastMonthStartDate, "MMMM"));
          break;
        }

        case "Last Year": {
          const lastYearStartDate = startOfYear(subYears(currentDate, 1));
          const lastYearEndDate = endOfYear(subYears(currentDate, 1));
          setStartDate(format(lastYearStartDate, "MM-dd-yyyy"));
          setEndDate(format(lastYearEndDate, "MM-dd-yyyy"));
          setText(format(lastYearStartDate, "yyyy"));
          break;
        }
        case "Last Quarter": {
          const lastQuarterStartDate = startOfQuarter(
            subQuarters(currentDate, 1)
          );
          const lastQuarterEndDate = endOfQuarter(subQuarters(currentDate, 1));
          setStartDate(format(lastQuarterStartDate, "MM-dd-yyyy"));
          setEndDate(format(lastQuarterEndDate, "MM-dd-yyyy"));
          setText(
            `${format(lastQuarterStartDate, "MMMM")} - ${format(
              lastQuarterEndDate,
              "MMMM"
            )}`
          );
          break;
        }

        default:
          break;
      }
    },
    [startDate, endDate, setText]
  );

  const handleAccountYearly = React.useCallback(
    (year) => {
      let currentYear = new Date().getFullYear();
      switch (year) {
        case "lastyear":
          setSelectedYear(currentYear - 1);
          break;
        case "currentyear":
          setSelectedYear(currentYear);
          break;
        default:
          break;
      }
    },
    [selectedYear]
  );

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          ACCOUNT_API.INDEX + `?startDate=${startDate}&endDate=${endDate}`,
          {
            headers: {
              Authorization: `Bearer ${token.accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data?.success) {
          setLoading(false);
          setAccount(response.data?.data);
        }
      } catch (error) {
        console.error("Error fetching account:", error);
        setLoading(false);
      }
    };
    const fetchYearlyData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          ACCOUNT_API.YEAR + `?year=${selectedYear}`,
          {
            headers: {
              Authorization: `Bearer ${token.accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data?.success) {
          setLoading(false);
          setTotalYear(response.data?.data);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error fetching year cost:", error.response?.data);
      }
    };
    fetchAccountData();
    fetchYearlyData();
  }, [token, handleDateSelection, handleAccountYearly]);

  return (
    <>
      <div className="flex items-center mb-6">
        <div className="flex w-full justify-center items-center">
          <Dropdown>
            <DropdownTrigger>
              <Button
                size="sm"
                className="rounded-sm ml-3 transition shadow-sm flex items-centertext-[#4338ca] border-[#4338ca] hover:bg-[#4338ca]
                 border-2 hover:opacity-75 text-sm hover:text-white bg-white  font-bold px-3 py-1.5`"
              >
                <Icon icon="basil:filter-outline" className="text-lg" />
                Filter
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Multiple selection example"
              variant="flat"
              selectionMode="multiple"
              selectedKeys={selectedKeys}
              onSelectionChange={setSelectedKeys}
            >
              {account.map((acc) => (
                <DropdownItem key={acc.type}>{acc.type}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          <Popover
            placement="bottom"
            classNames={{
              base: ["p-0 rounded-sm"],
              content: ["p-0 mx-2 rounded-sm"],
            }}
          >
            <PopoverTrigger>
              <Button
                size="sm"
                className="rounded-sm ml-3 transition shadow-sm flex items-centertext-[#4338ca] border-[#4338ca] hover:bg-[#4338ca]
                 border-2 hover:opacity-75 text-sm hover:text-white bg-white  font-bold px-3 py-1.5`"
              >
                <Icon icon="uiw:date" className="text-md" />

                <span className="text-sm ml-2">{new Date().getFullYear()}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Listbox aria-label="Select an option">
                <ListboxItem
                  className=" rounded-sm"
                  onClick={() => handleDateSelection("This Weekend")}
                >
                  This Weekend
                </ListboxItem>
                <ListboxItem
                  className="rounded-none"
                  onClick={() => handleDateSelection("This Month")}
                >
                  This Month
                </ListboxItem>
                <ListboxItem
                  className="rounded-none border-b-slate-300 border-b-2"
                  onClick={() => handleDateSelection("This Year")}
                >
                  This Year
                </ListboxItem>

                <ListboxItem
                  className="rounded-none"
                  onClick={() => handleDateSelection("Last Month")}
                >
                  Last Month
                </ListboxItem>
                <ListboxItem
                  className="rounded-none"
                  onClick={() => handleDateSelection("Last Quarter")}
                >
                  Last Quarter
                </ListboxItem>
                <ListboxItem
                  className="border-b-slate-300 border-b-2 rounded-none"
                  onClick={() => handleDateSelection("Last Year")}
                >
                  Last Year
                </ListboxItem>
              </Listbox>
              <div className="flex items-center py-3">
                <div className="flex items-center mr-3">
                  <span>From :</span>
                  <input
                    type="date"
                    placeholder="Select date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setText(`${e.target.value} to ${endDate}`);
                    }}
                    className="border-none ml-2"
                  />
                </div>

                <div className="flex items-center">
                  <span>To :</span>
                  <input
                    type="date"
                    placeholder="Select date"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setText(`${startDate} to ${e.target.value}`);
                    }}
                    className="border-none ml-2"
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <div className="w-56 flex shadow-sm justify-center px-3 mx-3 py-1 bg-white border-2 text-center rounded-sm">
            <h4 className="text-slate-500  font-semibold">{text}</h4>
          </div>
        </div>
      </div>
      <div className="w-4/5 mx-auto mt-16">
        <h2 className="text-xl text-slate-600 font-semibold mb-6">
          Statement Report
        </h2>

        <table className="w-full bg-white rounded-sm shadow-md">
          <tbody>
            {[
              "Gross Sale",
              "Opex",
              "Waste",
              "Discount",
              "Fixed Cost",
              "Variable Cost",
              "Purchase Cost",
            ]
              .map((type) => account.find((acc) => acc.type === type))
              .filter((acc) => acc && !selectedKeys.has(acc.type))
              .map((acc, index) => (
                <React.Fragment key={index}>
                  <tr className="flex justify-between items-center p-3">
                    <td className="text-slate-500 font-semibold items-center">
                      {acc.type}
                      {acc.subRow && acc.subRow.length > 0 && (
                        <button
                          className="text-blue-500 cursor-pointer focus:outline-none"
                          onClick={() =>
                            setExpandedIndex(
                              expandedIndex === index ? null : index
                            )
                          }
                        >
                          {expandedIndex === index ? (
                            <Icon
                              icon="ep:arrow-up"
                              className="text-md ml-3 font-bold"
                            />
                          ) : (
                            <Icon
                              icon="ep:arrow-down"
                              className="text-md ml-3 font-bold"
                            />
                          )}
                        </button>
                      )}
                    </td>
                    <td className="text-slate-600 font-bold">
                      {acc.balance.toLocaleString()}
                    </td>
                  </tr>
                  {expandedIndex === index && (
                    <tr className="w-full flex flex-col">
                      <td className="w-full">
                        {acc.subRow && acc.subRow.length > 0 && (
                          <>
                            {acc.subRow.map((sub, subIndex) => (
                              <div
                                key={subIndex}
                                className="flex w-full justify-between my-2 hover:bg-blue-100 p-2 text-slate-500 font-semibold"
                              >
                                <h2 className="mx-6 text-slate-600">
                                  {sub.type}
                                </h2>
                                <h2 className="mx-6 text-slate-600">
                                  {sub.quantity ? sub.quantity : sub.amount}
                                </h2>
                              </div>
                            ))}
                            <tr className="w-full flex justify-between bg-slate-200 text-slate-700 font-bold">
                              <td className="px-4 py-2">Total</td>
                              <td className="px-4 py-2">
                                {/* {acc.subRow &&
                                  acc.subRow.length > 0 &&
                                  acc.subRow.reduce(
                                    (total, row) => total + row.amount,
                                    0
                                  )} */}

                                {acc.subRow &&
                                  acc.subRow.length > 0 &&
                                  acc.subRow
                                    .reduce((total, row) => {
                                      if (row.quantity) {
                                        return row.quantity + total;
                                      } else {
                                        return row.amount + total;
                                      }
                                    }, 0)
                                    .toLocaleString()}
                              </td>
                            </tr>
                          </>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}

            <tr className="w-full flex justify-between">
              <td className="px-4 py-2 text-slate-600 font-semibold text-lg">
                Total Balance
              </td>
              <td className="px-4 py-2 text-slate-600 font-semibold text-lg">
                {[
                  "Gross Sale",
                  "Opex",
                  "Waste",
                  "Discount",
                  "Fixed Cost",
                  "Variable Cost",
                  "Purchase Cost",
                ]
                  .map((type) => account.find((acc) => acc.type === type))
                  .reduce((total, row) => total + (row ? row.balance : 0), 0)
                  .toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <hr className="my-16 bg-slate-200 h-1 border-none" />

      <div className="flex items-center mb-8">
        <h2 className="text-slate-500 font-semibold text-xl mr-4">
          Yearly Report - {selectedYear}
        </h2>
        <Dropdown>
          <DropdownTrigger>
            <Button
              size="sm"
              className="rounded-sm ml-3 transition shadow-sm flex items-centertext-[#4338ca] border-[#4338ca] hover:bg-[#4338ca]
                 border-2 hover:opacity-75 text-sm hover:text-white bg-white  font-bold px-3 py-1.5`"
            >
              <Icon icon="basil:filter-outline" className="text-lg" />
              Filter
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Single selection example"
            variant="flat"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
          >
            <DropdownItem
              key="lastyear"
              onClick={() => handleAccountYearly("lastyear")}
            >
              Last Year
            </DropdownItem>
            <DropdownItem
              key="currentyear"
              onClick={() => handleAccountYearly("currentyear")}
            >
              This Year
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      <table className="w-full">
        <thead className="flex justify-between border-2">
          <th className="w-28"></th>
          {months.map((month, index) => (
            <th key={index} className="w-24 text-slate-500 text-lg my-2">
              {month}
            </th>
          ))}
        </thead>
        <tbody>
          {totalYear[0] &&
            totalYear[0].map((_, colIndex) => (
              <tr
                key={colIndex}
                className="p-3 flex items-center justify-between my-1 border-2"
              >
                <td className="w-28 text-center text-slate-400 text-md font-semibold">
                  {totalYear[0][colIndex].type}
                </td>
                {totalYear.map((rowData, rowIndex) => (
                  <td key={rowIndex} className="w-24 text-center">
                    {rowData[colIndex] ? rowData[colIndex].balance : 0}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
      {loading && (
        <div className="absolute top-0 w-full h-screen flex items-center justify-center bg-slate-50 opacity-75">
          <Spinner />
        </div>
      )}
    </>
  );
};

export default AccoutingOverView;
