import { useEffect, useState } from "react";
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
  Tooltip,
  Legend,
} from "recharts";
import { format } from "date-fns";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Listbox,
  ListboxItem,
  Spinner,
} from "@nextui-org/react";

import { getApi } from "../Api";
import { useSelector } from "react-redux";
import { Icon } from "@iconify/react";

export default function OverView() {
  const [loading, setLoading] = useState(false);

  const [StartDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [startDayFilter, setStartDayFilter] = useState("");
  const [endDayFilter, setEndDayFilter] = useState("");

  const token = useSelector((state) => state.IduniqueData);

  const [totalPurchaseAmount, setTotalPurchaseAmount] = useState(0);
  const [totalPurchaseOrders, setTotalPurchaseOrders] = useState(0);
  const [totalPurchaseItems, setTotalPurchaseItems] = useState(0);
  const [totalPurchasePerDay, setTotalPurchasePerDay] = useState([]);
  const [popularPurchaseProducts, setPopularPurchaseProducts] = useState([]);
  const [totalSaleAmount, setTotalSaleAmount] = useState(0);
  const [totalSaleOrders, setTotalSaleOrders] = useState(0);
  const [totalSaleItems, setTotalSaleItems] = useState(0);
  const [totalSalePerDay, setTotalSalePerDay] = useState([]);
  const [text, setText] = useState("");

  const getTotals = async () => {
    try {
      setLoading(true);

      let resData = await getApi(
        `/orders/totals?startDate=${StartDate}&endDate=${endDate}`,
        token.accessToken
      );

      console.log(
        "res data is a",
        `/orders/totals?startDate=${StartDate}&endDate=${endDate}`
      );

      console.log(" data is a", resData);

      if (resData.status) {
        setText(
          StartDate && endDate ? `${StartDate} to ${endDate}` : "This Month"
        );

        setTotalPurchaseAmount(resData.data.purchases.totalAmountWithTax);
        setTotalPurchaseOrders(resData.data.purchases.totalOrders);
        setTotalPurchasePerDay(resData.data.purchases.totalsAmountPerDay);
        setTotalPurchaseItems(resData.data.purchases.totalItems);
        setPopularPurchaseProducts(resData.data.purchases.topProducts);
        setTotalSaleAmount(resData.data.sales.totalAmountWithTax);
        setTotalSaleOrders(resData.data.sales.totalOrders);
        setTotalSalePerDay(resData.data.sales.totalsAmountPerDay);
        setTotalSaleItems(resData.data.sales.totalItems);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
    setLoading(false);
  };

  const calculateWeeklyDates = () => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 7); // Subtract 7 days

    const formattedStartDate = format(startDate, "MM-dd-yyyy");
    const formattedEndDate = format(today, "MM-dd-yyyy");

    setStartDate(formattedStartDate);
    setEndDate(formattedEndDate);
  };

  const calculateMonthlyDates = () => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setMonth(today.getMonth() - 1); // Subtract 1 month for "Monthly"

    const formattedStartDate = format(startDate, "MM-dd-yyyy");
    const formattedEndDate = format(today, "MM-dd-yyyy");

    setStartDate(formattedStartDate);
    setEndDate(formattedEndDate);
  };

  const calculateYearlyDates = async () => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setFullYear(today.getFullYear() - 1); // Subtract 1 year for "Yearly"

    const formattedStartDate = format(startDate, "MM-dd-yyyy");
    const formattedEndDate = format(today, "MM-dd-yyyy");

    setStartDate(formattedStartDate);
    setEndDate(formattedEndDate);
  };

  const calculateLastMonthDates = () => {
    const today = new Date();
    const lastMonthStartDate = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );
    const lastMonthEndDate = new Date(today.getFullYear(), today.getMonth(), 0);

    const formattedStartDate = format(lastMonthStartDate, "MM-dd-yyyy");
    const formattedEndDate = format(lastMonthEndDate, "MM-dd-yyyy");

    setStartDate(formattedStartDate);
    setEndDate(formattedEndDate);
  };

  const calculateLastFinancialYearDates = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const lastFinancialYearStartDate = new Date(currentYear - 1, 3, 1); // Financial year starts on April 1
    const lastFinancialYearEndDate = new Date(currentYear, 2, 31); // Financial year ends on March 31

    const formattedStartDate = format(lastFinancialYearStartDate, "MM-dd-yyyy");
    const formattedEndDate = format(lastFinancialYearEndDate, "MM-dd-yyyy");
    setStartDate(formattedStartDate);
    setEndDate(formattedEndDate);
  };

  const calculateLastQuarterDates = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const startMonth = currentMonth - (currentMonth % 3);
    const lastQuarterStartDate = new Date(today.getFullYear(), startMonth, 1);
    const lastQuarterEndDate = new Date(
      today.getFullYear(),
      currentMonth + 1,
      0
    );

    const formattedStartDate = format(lastQuarterStartDate, "MM-dd-yyyy");
    const formattedEndDate = format(lastQuarterEndDate, "MM-dd-yyyy");
    setStartDate(formattedStartDate);
    setEndDate(formattedEndDate);
  };

  const calculateDailyFilter = () => {
    setStartDate(startDayFilter);
    setEndDate(endDayFilter);
  };

  useEffect(() => {
    getTotals();
  }, [StartDate, endDate]);

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
          <div className="flex w-full justify-center items-center">
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
                  <span className="text-sm ml-2">
                    {new Date().getFullYear()}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Listbox>
                  <ListboxItem
                    className="rounded-none"
                    onClick={() => {
                      calculateWeeklyDates();
                    }}
                  >
                    Weekly
                  </ListboxItem>
                  <ListboxItem
                    className="rounded-none"
                    onClick={() => {
                      calculateMonthlyDates();
                    }}
                  >
                    Monthly
                  </ListboxItem>
                  <ListboxItem
                    className="border-b-slate-300 border-b-2 rounded-sm"
                    onClick={() => {
                      calculateYearlyDates();
                    }}
                  >
                    Yearly
                  </ListboxItem>
                  <ListboxItem
                    className="rounded-none"
                    onClick={() => {
                      calculateLastMonthDates();
                    }}
                  >
                    Last Month
                  </ListboxItem>
                  <ListboxItem
                    className="rounded-none"
                    onClick={() => {
                      calculateLastQuarterDates();
                    }}
                  >
                    Last Quarter
                  </ListboxItem>
                  <ListboxItem
                    className="border-b-slate-300 border-b-2 rounded-none"
                    onClick={() => {
                      calculateLastFinancialYearDates();
                    }}
                  >
                    Last Financial Year
                  </ListboxItem>
                </Listbox>
                <div className="flex items-center py-3">
                  <div className="flex items-center mr-3">
                    <span>From :</span>
                    <input
                      type="date"
                      placeholder="Select date"
                      onChange={(e) => setStartDayFilter(e.target.value)}
                      className="border-none ml-2"
                    />
                  </div>

                  <div className="flex items-center">
                    <span>To :</span>
                    <input
                      type="date"
                      placeholder="Select date"
                      onChange={(e) => setEndDayFilter(e.target.value)}
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

            <div className="w-56 flex shadow-sm justify-center px-3 mx-3 py-1 bg-white border-2 text-center rounded-sm">
              <h4 className="text-slate-500 items-center font-semibold">
                {text}
              </h4>
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
                  <h2 className="text-slate-800 my-2">Unavailable</h2>
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

        {loading && (
          <div className="absolute top-0 w-full h-screen flex items-center justify-center bg-slate-50 opacity-75">
            <Spinner />
          </div>
        )}
      </div>
    </>
  );
}
