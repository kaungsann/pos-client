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
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Input,
  Listbox,
  ListboxItem,
} from "@nextui-org/react";

import FadeLoader from "react-spinners/FadeLoader";
import { getApi } from "../Api";
import { useDispatch, useSelector } from "react-redux";
import { removeData } from "../../redux/actions";
import { Icon } from "@iconify/react";
import { IoMdArrowRoundForward, IoMdArrowRoundBack } from "react-icons/io";

export default function OverView() {
  const [filter, setFilter] = useState("");
  const [day, setDay] = useState("1");
  const [month, setMonth] = useState("January");
  const [year, setYear] = useState("2023");
  const [StartDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [ShowFilter, setShowFilter] = useState(false);
  const [showFilterDateBox, setShowFilterDateBox] = useState(false);

  const handleDayChange = (e) => setDay(e.target.value);
  const handleMonthChange = (e) => setMonth(e.target.value);
  const handleYearChange = (e) => setYear(e.target.value);

  const token = useSelector((state) => state.IduniqueData);
  const dipatch = useDispatch();

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
  const [text, setText] = useState("Monthly");

  const todayDate = format(new Date(), "MM-dd-yyyy");

  const calculateStartDate = () => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 7); // Subtract 7 days
    return format(startDate, "MM-dd-yyyy");
  };

  const calculateMonthlyStartDate = () => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setMonth(today.getMonth() - 1); // Subtract 1 month for "Monthly"
    return format(startDate, "MM-dd-yyyy");
  };

  const calculateYearlyStartDate = () => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setFullYear(today.getFullYear() - 1); // Subtract 1 year for "Yearly"
    return format(startDate, "MM-dd-yyyy");
  };

  const handleFilterChange = (e) => {
    setEndDate(todayDate);
    setFilter(e.target.value);
  };

  const calculateDailyFilter = () => {
    setMonth("");
    setYear("");
    setDay("");
    getTotals();
    setText(`${StartDate}  to  ${endDate} `);
  };

  const getTotals = async () => {
    let startDate;
    let resData;
    if (day === "7") {
      // Weekly
      startDate = calculateStartDate();
    } else if (month === "Monthly") {
      // Monthly
      startDate = calculateMonthlyStartDate();
    } else if (year === "Yearly") {
      // Yearly
      startDate = calculateYearlyStartDate();
    } else if (StartDate && endDate) {
      // Yearly
      startDate = StartDate;
    } else {
      // Default to daily (today)
      resData = await getApi(`/orders/totals`, token.accessToken);
    }

    if (startDate) {
      let formattedStartDate = format(new Date(startDate), "MM-dd-yyyy");
      let formattedEndDate = format(new Date(endDate), "MM-dd-yyyy");

      //day === "7" & month === "Monthly" &  year === "Yearly"
      resData = await getApi(
        `/orders/totals?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
        token.accessToken
      );
    }

    if (resData.status) {
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
  }, [day, month, year, StartDate]);

  const orderList = Array.from(
    new Set(orderPurchaseLines.map((line) => line.orderId._id))
  ).map(
    (orderId) =>
      orderPurchaseLines.find((line) => line.orderId._id === orderId).orderId
  );

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
        totalPurchaseWithTax: item1.totalWithTax,
        totalSaleWithTax: matchingItem2.totalWithTax,
        totalSaleTax: item1.totalTax,
        totalPurchaseTax: matchingItem2.totalTax,
      };
    }

    return item1;
  });

  const COLORS = ["#96c3ea", "#88c3c7", "#b8bd85", "#8f90c9"];

  return (
    <>
      <div className="relative">
        <div className="flex justify-end mb-3">
          <div className="flex w-full justify-center">
            <Popover
              placement="bottom"
              classNames={{
                base: ["p-0 rounded-sm"],
                content: ["p-0 mx-2 rounded-sm"],
              }}
            >
              <PopoverTrigger>
                <button className="flex items-center px-3 py-2 bg-white shadow-md rounded-sm">
                  <Icon icon="uiw:date" className="text-slate-500 text-md" />
                  <span className="text-sm ml-2">2023</span>
                </button>
              </PopoverTrigger>
              <PopoverContent>
                <Listbox>
                  <ListboxItem
                    className="rounded-none"
                    onClick={() => {
                      setMonth("");
                      setYear("");
                      setEndDate(todayDate); // Set end date to today
                      setDay("7");
                      getTotals();
                      setText("Weekly");
                    }}
                  >
                    Weekly
                  </ListboxItem>
                  <ListboxItem
                    className="rounded-none"
                    onClick={() => {
                      setDay("");
                      setYear("");
                      setEndDate(todayDate); // Set end date to today
                      setMonth("Monthly"); // Set month to "Monthly"
                      getTotals();
                      setText("Monthly");
                    }}
                  >
                    Monthly
                  </ListboxItem>
                  <ListboxItem
                    className="border-b-slate-300 border-b-2 rounded-sm"
                    onClick={() => {
                      setDay("");
                      setMonth("");
                      setEndDate(todayDate); // Set end date to today
                      setYear("Yearly"); // Set year to "Yearly"
                      getTotals();
                      setText("Yearly");
                    }}
                  >
                    Yearly
                  </ListboxItem>

                  <ListboxItem className="rounded-none">Last Month</ListboxItem>
                  <ListboxItem className="rounded-none">
                    Last Quarter
                  </ListboxItem>
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
                      onChange={(e) => setStartDate(e.target.value)}
                      className="border-none ml-2"
                    />
                  </div>

                  <div className="flex items-center">
                    <span>To :</span>
                    <input
                      type="date"
                      placeholder="Select date"
                      onChange={(e) => setEndDate(e.target.value)}
                      className="border-none ml-2"
                    />
                  </div>
                  <button
                    onClick={calculateDailyFilter}
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
        <div className="flex">
          {/* Sale Order  */}
          <div className="w-3/5	bg-white p-4 border-2 rounded-lg shadow-md">
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold text-slate-700">
                Sales Overview
              </h3>
            </div>
            {/* Annula Sales */}
            <div className=" my-3 px-4 flex">
              <div className="flex items-center w-2/4">
                <div className="p-4 bg-blue-200 rounded-md">
                  <Icon
                    icon="solar:cart-4-outline"
                    className="text-4xl text-cyan-600 font-extrabold"
                  />
                </div>
                <div className="mx-3">
                  <h2 className="text-slate-400 text-md font-semibold w-full">
                    Total Sales (Inc. Tax)
                  </h2>
                  <h2 className="text-slate-800 text-xl font-extrabold my-2">
                    {totalSaleAmount.toFixed()}
                  </h2>
                </div>
              </div>
              <div className="flex items-center w-2/4">
                <div className="p-4 bg-yellow-100 rounded-md">
                  <Icon
                    icon="tdesign:undertake-transaction"
                    className="text-4xl text-yellow-600 font-extrabold"
                  />
                </div>
                <div className="px-3">
                  <h2 className="text-slate-400 text-md font-semibold">
                    Total Transactions
                  </h2>
                  <h2 className="text-slate-800 text-xl font-extrabold  my-2">
                    {totalSaleOrders.toFixed()}
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
                  <h2 className="text-slate-800 text-xl font-extrabold  my-2">
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
                  <h2 className="text-slate-800 text-xl font-extrabold  my-2">
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
                  <h2 className="text-slate-800 text-xl font-extrabold my-2">
                    {totalPurchaseAmount.toFixed()}
                  </h2>
                </div>
              </div>
              <div className="flex items-center w-2/4">
                <div className="p-4 bg-pink-100 rounded-md">
                  <Icon
                    icon="tdesign:undertake-transaction"
                    className="text-4xl text-pink-600 font-extrabold"
                  />
                </div>
                <div className="px-3">
                  <h2 className="text-slate-400 text-md font-semibold">
                    Total Transactions
                  </h2>
                  <h2 className="text-slate-800 text-xl font-extrabold my-2">
                    {totalPurchaseOrders.toFixed()}
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
                  <h2 className="text-slate-800 text-xl font-extrabold my-2">
                    {totalPurchaseItems.toFixed()}
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
                  <h2 className="text-slate-800 text-xl font-extrabold my-2">
                    {(totalPurchaseAmount / totalPurchaseItems).toFixed()}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex my-4">
          <div className="w-3/5 bg-white rounded-lg shadow-md p-4">
            <h2 className="text-slate-600 text-lg font-semibold my-3">
              Sales Statistics
            </h2>
            <ResponsiveContainer height={500} width="100%">
              <LineChart data={lineChartData} margin={{ right: 20, top: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 14 }} />
                <YAxis tick={{ fontSize: 12 }} padding={{ left: 50 }} />
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
                <Pie
                  data={popularPurchaseProducts}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({
                    cx,
                    cy,
                    midAngle,
                    innerRadius,
                    outerRadius,
                    index,
                  }) => {
                    const radius =
                      innerRadius + (outerRadius - innerRadius) * 1;
                    const x =
                      cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                    const y =
                      cy + radius * Math.sin(-midAngle * (Math.PI / 180));

                    return (
                      <text
                        x={x}
                        y={y}
                        fill="black"
                        textAnchor={x > cx ? "start" : "end"}
                        dominantBaseline="central"
                      >
                        {popularPurchaseProducts[index].product}
                      </text>
                    );
                  }}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {popularPurchaseProducts.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                {/* <Pie dataKey="value" data={popularPurchaseProducts} fill="#8884d8" label /> */}
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}
