import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Bar,
  Tooltip,
  Legend,
} from "recharts";
import { format } from "date-fns";

import FadeLoader from "react-spinners/FadeLoader";
import { getApi } from "../Api";
import { useDispatch, useSelector } from "react-redux";
import { removeData } from "../../redux/actions";
import { Icon } from "@iconify/react";
import { IoMdArrowRoundForward, IoMdArrowRoundBack } from "react-icons/io";

export default function OverView() {
  const [day, setDay] = useState("1");
  const [month, setMonth] = useState("January");
  const [year, setYear] = useState("2023");

  const [ShowFilter, setShowFilter] = useState(false);
  const [showFilterDateBox, setShowFilterDateBox] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleDayChange = (e) => setDay(e.target.value);
  const handleMonthChange = (e) => setMonth(e.target.value);
  const handleYearChange = (e) => setYear(e.target.value);

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

  const token = useSelector((state) => state.IduniqueData);
  const dipatch = useDispatch();

  const [totalPurchaseAmount, setTotalPurchaseAmount] = useState(0);
  const [totalPurchaseOrders, setTotalPurchaseOrders] = useState(0);
  const [totalPurchaseItems, setTotalPurchaseItems] = useState(0);
  const [totalPurchasePerDay, setTotalPurchasePerDay] = useState([]);
  const [orderPurchaseLines, setOrderPurchaseLines] = useState([]);
  const [popularPurchaseProducts, setPopularPurchaseProducts] = useState([]);
  const [totalSaleAmount, setTotalSaleAmount] = useState(0);
  const [totalSaleOrders, setTotalSaleOrders] = useState(0);
  const [totalSaleItems, setTotalSaleItems] = useState(0);
  const [totalSalePerDay, setTotalSalePerDay] = useState([]);
  const [orderSaleLines, setOrderSaleLines] = useState([]);
  const [popularSaleProducts, setPopularSaleProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const todayDate = format(new Date(), "MM-dd-yyyy"); // Get today's date in the same format as orderDate

  const getTotals = async () => {
    setLoading(true);
    let resData = await getApi(
      `/orders/totals?startDate=${todayDate.toString()}`,
      token.accessToken
    );
    if (resData.status) {
      console.log(resData.data);
      setTotalPurchaseAmount(resData.data.purchases.totalAmountWithTax);
      setTotalPurchaseOrders(resData.data.purchases.totalOrders);
      setTotalPurchasePerDay(resData.data.purchases.totalsAmountPerDay);
      setTotalPurchaseItems(resData.data.purchases.totalItems);
      setOrderPurchaseLines(resData.data.purchases.allLines);
      setPopularPurchaseProducts(resData.data.purchases.topProducts);
      setTotalSaleAmount(resData.data.sales.totalAmountWithTax);
      setTotalSaleOrders(resData.data.sales.totalOrders);
      setTotalSalePerDay(resData.data.sales.totalsAmountPerDay);
      setTotalSaleItems(resData.data.sales.totalItems);
      setOrderSaleLines(resData.data.sales.allLines);
      setPopularSaleProducts(resData.data.sales.topProducts);
      setLoading(false);
    } else {
      setLoading(true);
    }
  };

  useEffect(() => {
    getTotals();
  }, []);

  const orderList = Array.from(
    new Set(orderPurchaseLines.map((line) => line.orderId._id))
  ).map(
    (orderId) =>
      orderPurchaseLines.find((line) => line.orderId._id === orderId).orderId
  );

  console.log(orderList);

  const lineChartDatas = orderPurchaseLines.map((line) => {
    return {
      id: line._id,
      orderRef: line.orderId.orderRef,
      productId: line.product.name,
      total: line.subTotal,
    };
  });

  const lineChartData = totalPurchasePerDay.map((item1) => {
    const matchingItem2 = totalSalePerDay.find(
      (item2) => item2.date === item1.date
    );

    if (matchingItem2) {
      return {
        date: item1.date,
        totalSaleWithTax: item1.totalWithTax,
        totalPurchaseWithTax: matchingItem2.totalWithTax,
        totalSaleTax: item1.totalTax,
        totalPurchaseTax: matchingItem2.totalTax,
      };
    }

    return item1;
  });
  
  return (
    <>
      <div className="relative">
        <div className="flex">
          {/* Sale Order  */}
          <div className="w-3/5	bg-white p-4 border-2 rounded-lg shadow-md">
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold text-slate-700">
                Sales Overview
              </h3>
              <div>
                {/* <Icon
                  onClick={() => setShowFilter(true)}
                  icon="icon-park-outline:filter"
                  className="text-[#8b5cf6] hover:text-[#4f3b80] font-extrabold text-xl"
                /> */}
              </div>
            </div>
            {/* Annula Sales */}
            <div className=" my-3 px-4 flex">
              <div className="flex items-center w-2/4	">
                <div className="p-4 bg-blue-200 rounded-md">
                  <Icon
                    icon="solar:cart-4-outline"
                    className="text-4xl text-cyan-600 font-extrabold"
                  />
                </div>
                <div className="mx-3 w-2/4">
                  <h2 className="text-slate-400 text-md font-semibold">
                    Total Sales (Inc. Tax)
                  </h2>
                  <h2 className="text-slate-800 text-xl font-extrabold">
                    {totalSaleAmount}
                  </h2>
                </div>
              </div>
              <div className="flex items-center w-2/4	">
                <div className="p-4 bg-yellow-100 rounded-md">
                  <Icon
                    icon="uil:file-graph"
                    className="text-4xl text-yellow-600 font-extrabold"
                  />
                </div>
                <div className="px-3">
                  <h2 className="text-slate-400 text-md font-semibold">
                    Total Transactions
                  </h2>
                  <h2 className="text-slate-800 text-xl font-extrabold">
                    {totalSaleOrders}
                  </h2>
                </div>
              </div>
            </div>
            {/* Monthly Sales */}
            <div className=" my-3 px-4 flex">
              <div className="flex items-center w-2/4	">
                <div className="p-4 bg-orange-200 rounded-md">
                  {/* <Icon
                    icon="solar:cart-4-outline"
                    className="text-4xl text-orange-600 font-extrabold"
                  /> */}
                </div>
                <div className="mx-3 w-2/4">
                  <h2 className="text-slate-400 text-md font-semibold">
                    Total Items
                  </h2>
                  <h2 className="text-slate-800 text-xl font-extrabold">
                    {totalSaleItems}
                  </h2>
                </div>
              </div>
              <div className="flex items-center w-2/4	">
                <div className="p-4 bg-green-100 rounded-md">
                  <Icon
                    icon="uil:file-graph"
                    className="text-4xl text-green-600 font-extrabold"
                  />
                </div>
                <div className="px-3">
                  <h2 className="text-slate-400 text-md font-semibold">
                    Monthly Profits
                  </h2>
                  <h2 className="text-slate-800 text-xl font-extrabold">
                    12456
                  </h2>
                </div>
              </div>
            </div>
          </div>

          {/* Purchase Order */}
          <div className="w-3/5	bg-white p-4 border-2 rounded-lg mx-3 shadow-md">
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold text-slate-700">
                Purchases Overview
              </h3>
              <div>
                <Icon
                  onClick={() => setShowFilter(true)}
                  icon="icon-park-outline:filter"
                  className="text-[#8b5cf6] font-extrabold text-xl"
                />
              </div>
            </div>
            {/* Annula Purchase */}
            <div className=" my-3 px-4 flex">
              <div className="flex items-center w-2/4">
                <div className="p-4 bg-violet-300 rounded-md">
                  <Icon
                    icon="la:cart-plus"
                    className="text-4xl text-violet-600 font-extrabold"
                  />
                </div>
                <div className="mx-3">
                  <h2 className="text-slate-400 text-md font-semibold">
                    Total Purchase (Inc. Tax)
                  </h2>
                  <h2 className="text-slate-800 text-xl font-extrabold">
                    {totalPurchaseAmount}
                  </h2>
                </div>
              </div>
              <div className="flex items-center w-2/4">
                <div className="p-4 bg-pink-100 rounded-md">
                  <Icon
                    icon="pepicons-pencil:cart-off"
                    className="text-4xl text-pink-600 font-extrabold"
                  />
                </div>
                <div className="px-3">
                  <h2 className="text-slate-400 text-md font-semibold">
                    Total Transactions
                  </h2>
                  <h2 className="text-slate-800 text-xl font-extrabold">
                    {totalPurchaseOrders}
                  </h2>
                </div>
              </div>
            </div>
            {/* Monthly Sales */}
            <div className=" my-3 px-4 flex">
              <div className="flex items-center w-2/4	">
                <div className="p-4 bg-orange-200 rounded-md">
                  <Icon
                    icon="carbon:purchase"
                    className="text-4xl text-orange-600 font-extrabold"
                  />
                </div>
                <div className="mx-3">
                  <h2 className="text-slate-400 text-md font-semibold">
                    Total Items
                  </h2>
                  <h2 className="text-slate-800 text-xl font-extrabold">
                    {totalPurchaseItems}
                  </h2>
                </div>
              </div>
              <div className="flex items-center w-2/4	">
                <div className="p-4 bg-rose-100 rounded-md">
                  <Icon
                    icon="la:cart-arrow-down"
                    className="text-4xl text-rose-600 font-extrabold"
                  />
                </div>
                <div className="px-3">
                  <h2 className="text-slate-400 text-md font-semibold">
                    Avg. Purchase Amount
                  </h2>
                  <h2 className="text-slate-800 text-xl font-extrabold">
                    {totalPurchaseAmount / totalPurchaseItems}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center my-6">
             <button className="font-bold rounded-sm shadow-sm flex items-cente text-blue-700 border-blue-500 border-2 hover:opacity-75 text-md hover:text-white hover:bg-blue-700 px-6 py-2">
                 Weekly
              </button>
              <button className="font-bold mx-4 rounded-sm shadow-sm flex items-cente text-blue-700 border-blue-500 border-2 hover:opacity-75 text-md hover:text-white hover:bg-blue-700 px-6 py-2">
                 Monthly
              </button>
              <button className="font-bold rounded-sm shadow-sm flex items-cente text-blue-700 border-blue-500 border-2 hover:opacity-75 text-md hover:text-white hover:bg-blue-700 px-6 py-2">
                 Yearly
              </button>
        </div>
        <div className="flex my-4">
          <div className="w-3/5 bg-white rounded-lg shadow-md p-4">
            <h2 className="text-slate-600 text-lg font-semibold my-3">
              Sales Statistics
            </h2>
            <ResponsiveContainer height={450} width="100%">
              <LineChart data={lineChartData} margin={{ right: 25, top: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="totalSaleWithTax"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="totalPurchaseWithTax"
                  stroke="#82ca9d"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="w-2/5 bg-white rounded-lg shadow-md p-4 mx-3">
            <h2 className="text-slate-600 text-lg font-semibold my-3">
              Top Selling Items
            </h2>
            <ResponsiveContainer height={400}>
              <PieChart>
                <Pie dataKey="value" data={popularPurchaseProducts} fill="#8884d8" label />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        {ShowFilter && (
          <div className="w-2/4 bg-white rounded-sm shadow-md absolute top-24 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="px-3 bg-slate-600 py-3 w-full flex justify-between items-center">
              <h1 className="font-bold text-xl text-white">
                Filter by Date & Months & Year
              </h1>
              {showFilterDateBox ? (
                <IoMdArrowRoundBack
                  onClick={() => setShowFilterDateBox(false)}
                  className="text-white text-xl hover:text-slate-300"
                />
              ) : (
                <IoMdArrowRoundForward
                  onClick={() => setShowFilterDateBox(true)}
                  className="text-white text-2xl hover:text-slate-300"
                />
              )}
            </div>
            {showFilterDateBox ? (
              <div className="mx-auto pb-4 bg-white">
                <div className="flex w-3/5 mx-auto">
                  <div className="flex flex-col items-center w-2/4">
                    <label className="my-2 text-lg font-semibold text-slate-500">
                      From
                    </label>
                    <input
                      type="date"
                      onChange={(e) => setStartDate(e.target.value)}
                      className="p-3 bg-slate-100"
                    />
                  </div>
                  <div className="flex flex-col items-center w-2/4">
                    <label className="my-2 text-lg font-semibold text-slate-500">
                      To
                    </label>
                    <input
                      type="date"
                      onChange={(e) => setEndDate(e.target.value)}
                      className="p-3 bg-slate-100"
                    />
                  </div>
                </div>
                <div className="w-3/5 mx-auto my-4 flex justify-end">
                  <button
                    onClick={() => setShowFilter(false)}
                    className="text-md py-2 px-4 bg-slate-200 rounded-sm hover:bg-slate-300"
                  >
                    Cancel
                  </button>
                  <button className="text-md py-2 px-6 bg-blue-600 rounded-sm text-white hover:bg-blue-700 ml-6">
                    Filter
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="w-3/5 mx-auto flex justify-between">
                  <div className="flex flex-col items-center">
                    <label className="my-3 text-lg font-semibold text-slate-500">
                      Days
                    </label>
                    <select
                      value={day}
                      onChange={handleDayChange}
                      className="custom-scrollbar w-16 h-12 p-2 bg-slate-100"
                    >
                      {Array.from({ length: 31 }, (_, index) => index + 1).map(
                        (day) => (
                          <option
                            key={day}
                            value={day}
                            className="custom-scrollbar"
                          >
                            {day}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  <div className="flex flex-col items-center">
                    <label className="my-3 text-lg font-semibold text-slate-500">
                      Months
                    </label>
                    <select
                      value={month}
                      onChange={handleMonthChange}
                      className="p-2 h-12 bg-slate-100"
                    >
                      {months.map((month) => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col items-center">
                    <label className="my-3 text-lg font-semibold text-slate-500">
                      Years
                    </label>
                    <select
                      value={year}
                      onChange={handleYearChange}
                      className="p-2 h-12 bg-slate-100"
                    >
                      {/* Add options for years (e.g., 2023 to 2030) */}
                      {Array.from(
                        { length: 8 },
                        (_, index) => 2023 + index
                      ).map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="w-3/5 mx-auto my-4 flex justify-end">
                  <button
                    onClick={() => setShowFilter(false)}
                    className="text-md py-2 px-4 bg-slate-200 rounded-sm hover:bg-slate-300"
                  >
                    Cancel
                  </button>
                  <button className="text-md py-2 px-6 bg-blue-600 rounded-sm text-white hover:bg-blue-700 ml-6">
                    Filter
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
