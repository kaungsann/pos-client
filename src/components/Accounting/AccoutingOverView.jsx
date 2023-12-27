import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
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
  addDays,
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
} from "@nextui-org/react";

import { useSelector } from "react-redux";

const AccoutingOverView = () => {
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(["text"]));

  const [text, setText] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  console.log("selected keys is a", selectedKeys);

  const [expandedIndex, setExpandedIndex] = useState(null);
  let [account, setAccount] = useState([]);
  const token = useSelector((state) => state.IduniqueData);

  const ACCOUNT_API = {
    INDEX: BASE_URL + "/account/totals",
  };

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );

  const handleDateSelection = (option) => {
    const currentDate = new Date();

    console.log("today date is a", currentDate);

    switch (option) {
      case "This Weekend":
        const startOfWeekend = startOfWeek(currentDate, { weekStartsOn: 6 }); // Saturday
        const endOfWeekend = endOfWeek(currentDate, { weekStartsOn: 6 }); // Sunday
        setStartDate(format(startOfWeekend, "MM-dd-yyyy"));
        setEndDate(format(endOfWeekend, "MM-dd-yyyy"));
        setText("This Weekend");
        break;
      case "This Month":
        setStartDate(format(startOfMonth(currentDate), "MM-dd-yyyy"));
        setEndDate(format(endOfMonth(currentDate), "MM-dd-yyyy"));
        // setText(format(addMonths(currentDate, -1), "MMMM"));
        setText(format(currentDate, "MMMM"));
        break;
      case "This Year":
        setStartDate(format(startOfYear(currentDate), "MM-dd-yyyy"));
        setEndDate(format(endOfYear(currentDate), "MM-dd-yyyy"));
        setText(new Date().getFullYear());
        break;

      case "Last Month":
        const lastMonthStartDate = startOfMonth(subMonths(currentDate, 1));
        const lastMonthEndDate = endOfMonth(subMonths(currentDate, 1));
        setStartDate(format(lastMonthStartDate, "MM-dd-yyyy"));
        setEndDate(format(lastMonthEndDate, "MM-dd-yyyy"));
        setText(format(lastMonthStartDate, "MMMM"));
        break;

      case "Last Year":
        const lastYearStartDate = startOfYear(subYears(currentDate, 1));
        const lastYearEndDate = endOfYear(subYears(currentDate, 1));
        setStartDate(format(lastYearStartDate, "MM-dd-yyyy"));
        setEndDate(format(lastYearEndDate, "MM-dd-yyyy"));
        setText(format(lastYearStartDate, "yyyy"));
        break;

      case "Last Quarter":
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

      default:
        break;
    }
  };

  console.log(
    "api is a",
    ACCOUNT_API.INDEX + `?startDate=${startDate}&endDate=${endDate}`
  );

  const handleApplyClick = () => {
    console.log("Selected Start Date:", startDate);
    console.log("Selected End Date:", endDate);
    setText(`${startDate}  to  ${endDate} `);
  };

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const response = await axios.get(
          ACCOUNT_API.INDEX + `?startDate=${startDate}&endDate=${endDate}`,
          {
            headers: {
              Authorization: `Bearer ${token.accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        setAccount(response.data?.data);
      } catch (error) {
        console.error("Error fetching account:", error);
      }
    };
    fetchAccountData();
  }, [token, handleDateSelection, handleApplyClick]);

  let count = 0;

  return (
    <>
      <div className="flex items-center">
        <h2 className="text-xl w-52 text-slate-600 font-semibold">
          Statement Report
        </h2>
        <div className="flex w-full justify-center">
          <Dropdown>
            <DropdownTrigger>
              <div className="flex px-4 mx-3 py-2 bg-slate-200 hover:bg-slate-300 rounded-sm">
                <Icon icon="carbon:filter" className="text-slate-500 text-xl" />

                <span className="text-sm ml-2">Filter</span>
              </div>
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
              <div className="flex px-4 mx-3 py-2 bg-slate-200 hover:bg-slate-300 rounded-sm">
                <Icon icon="uiw:date" className="text-slate-500 text-md" />
                <span className="text-sm ml-2">{new Date().getFullYear()}</span>
              </div>
            </PopoverTrigger>
            <PopoverContent>
              <Listbox>
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
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border-none ml-2"
                  />
                </div>

                <div className="flex items-center">
                  <span>To :</span>
                  <input
                    type="date"
                    placeholder="Select date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border-none ml-2"
                  />
                </div>
                <button
                  onClick={handleApplyClick}
                  className="px-3 py-1 hover:opacity-70 rounded-md mx-3 text-white font-semibold bg-[#56488f]"
                >
                  Apply
                </button>
              </div>
            </PopoverContent>
          </Popover>

          <div className="w-56 flex shadow-md justify-center px-3 mx-3 py-1.5 bg-white border-2 text-center rounded-sm">
            <h4 className="text-slate-500  font-semibold">{text}</h4>
          </div>
        </div>
      </div>
      <div className="w-2/4 mx-auto mt-20">
        <table className="w-full bg-white rounded-sm shadow-md">
          <tbody>
            {account
              .filter((acc) => !selectedKeys.has(acc.type))
              .map((acc, index) => (
                <div
                  key={index}
                  className="w-full px-4 py-1.5 hover:bg-slate-100 border-b-gray-200 border-b-2"
                >
                  <tr className="flex justify-between items-center">
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
                      {acc.balance.toFixed()}
                    </td>
                  </tr>
                  {expandedIndex === index && (
                    <tr className="w-full flex flex-col">
                      <td className="w-full">
                        {acc.subRow && acc.subRow.length > 0 && (
                          <>
                            {acc.subRow.map((sub, index) => (
                              <div
                                key={index}
                                className="flex w-full justify-between my-2"
                              >
                                <h2 className="mx-6 text-slate-600">
                                  {sub.type}
                                </h2>
                                <h2 className="mx-6 text-slate-600">
                                  {sub.amount.toFixed()}
                                </h2>
                              </div>
                            ))}
                            <tr className="w-full flex justify-between bg-slate-400 text-white">
                              <td className="px-4 py-2">Total</td>
                              <td className="px-4 py-2">
                                {/* Calculate the total outside of the subRow mapping */}
                                {acc.subRow &&
                                  acc.subRow.length > 0 &&
                                  acc.subRow.reduce(
                                    (total, row) => total + row.amount,
                                    0
                                  )}
                              </td>
                            </tr>
                          </>
                        )}
                      </td>
                    </tr>
                  )}
                </div>
              ))}
            <div className="w-full flex justify-between">
              <td className="border px-4 py-2 text-slate-600 font-semibold text-lg">
                Total Balance
              </td>
              <td className="border px-4 py-2 text-slate-600 font-semibold text-lg">
                {account
                  .filter((acc) => !selectedKeys.has(acc.type))
                  .reduce((total, row) => total + row.balance, 0)
                  .toFixed()}
              </td>
            </div>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AccoutingOverView;
