import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  Rectangle,
} from "recharts";
import {
  format,
  subMonths,
  subQuarters,
  subYears,
  startOfMonth,
  startOfQuarter,
  startOfYear,
  endOfMonth,
  endOfQuarter,
  endOfYear,
  addDays,
  addMonths,
  addYears,
} from "date-fns";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Listbox,
  ListboxItem,
  Spinner,
  Select,
  SelectItem,
} from "@nextui-org/react";

import { getApi } from "../Api";
import { useSelector } from "react-redux";
import { Icon } from "@iconify/react";

export default function OverView() {
  const [loading, setLoading] = useState(false);

  const [location, setLocation] = useState([]);
  const [locationId, setLocationId] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const token = useSelector((state) => state.IduniqueData);

  const [totalPurchaseAmount, setTotalPurchaseAmount] = useState(0);
  const [totalPurchaseOrders, setTotalPurchaseOrders] = useState(0);
  const [totalPurchaseItems, setTotalPurchaseItems] = useState(0);
  const [totalPurchaseQty, setTotalPurchaseQty] = useState(0);
  const [totalPurchasePerDay, setTotalPurchasePerDay] = useState([]);
  const [purchaseLines, setPurchaseLines] = useState([]);
  const [popularPurchaseProducts, setPopularPurchaseProducts] = useState([]);

  const [totalGrossSale, setTotalGrossSale] = useState(0);
  const [totalGrossProfit, setTotalGrossProfit] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [totalTax, setTotalTax] = useState(0);
  const [totalSaleQty, setTotalSaleQty] = useState(0);
  const [totalSaleOrders, setTotalSaleOrders] = useState(0);
  const [totalSaleItems, setTotalSaleItems] = useState(0);
  const [totalSalePerDay, setTotalSalePerDay] = useState([]);
  const [popularSaleProducts, setPopularSaleProducts] = useState([]);
  const [saleLines, setSaleLines] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [selectedDate, setSelectedDate] = useState("Monthly");
  const [customDateRange, setCustomDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  const getTotals = async () => {
    try {
      setLoading(true);

      let apiUrl = `/orders/totals`;

      if (locationId === "Overall View") {
        setLocationId("");
      }

      if (locationId) {
        apiUrl += `?locationId=${locationId}`;
      }
      if (!locationId) {
        apiUrl = "/orders/totals";
      }

      if (startDate && endDate) {
        apiUrl += `${
          locationId ? "&" : "?"
        }startDate=${startDate}&endDate=${endDate}`;
      }

      let resData = await getApi(apiUrl, token.accessToken);

      // startDate=${startDate}&endDate=${endDate}
      // let resData = await getApi(
      //   `/orders/totals?location=65b0c67aee63cb06433d4e96`,
      //   token.accessToken
      // );

      if (resData.status) {
        setTotalPurchaseAmount(resData.data.purchases.totalAmount);
        setTotalPurchaseOrders(resData.data.purchases.totalOrders);
        setTotalPurchaseQty(resData.data.purchases.totalQty);
        setTotalPurchasePerDay(resData.data.purchases.totalsAmountPerDay);
        setTotalPurchaseItems(resData.data.purchases.totalItems);
        setPurchaseLines(resData.data.purchases.allLines);
        setPopularPurchaseProducts(resData.data.purchases.topProducts);
        setLowStock(resData.data.inventory.lowStockProducts);
        setTotalGrossSale(resData.data.sales.totalGrossSale);
        setTotalGrossProfit(resData.data.sales.totalGrossProfit);
        setTotalDiscount(resData.data.sales.totalDiscount);
        setTotalTax(resData.data.sales.totalTax);
        setTotalSaleQty(resData.data.sales.totalQty);
        setTotalSaleOrders(resData.data.sales.totalOrders);
        setTotalSalePerDay(resData.data.sales.totalsAmountPerDay);
        setPopularSaleProducts(resData.data.sales.topProducts);
        setSaleLines(resData.data.sales.allLines);
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

  const DATE_FILTER = {
    WEEKLY: "weekly",
    MONTHLY: "monthly",
    YEARLY: "yearly",
    LAST_MONTH: "last_month",
    LAST_QUARTER: "last_quarter",
    LAST_YEAR: "last_year",
  };

  const getDateRangeString = (startDate, endDate) => {
    return `${startDate} to ${endDate}`;
  };

  const calculateDates = (interval) => {
    const today = new Date();

    let startDate, endDate;

    switch (interval) {
      case "weekly":
        startDate = addDays(today, -7);
        endDate = today;
        break;
      case "monthly":
        startDate = addMonths(today, -1);
        endDate = today;
        break;
      case "yearly":
        startDate = addYears(today, -1);
        endDate = today;
        break;
      case "last_month":
        startDate = startOfMonth(subMonths(today, 1));
        endDate = endOfMonth(subMonths(today, 1));
        break;
      case "last_quarter":
        startDate = startOfQuarter(subQuarters(today, 1));
        endDate = endOfQuarter(subQuarters(today, 1));
        break;
      case "last_year":
        startDate = startOfYear(subYears(today, 1));
        endDate = endOfYear(subYears(today, 1));
        break;
      default:
        throw new Error(
          'Invalid interval. Please specify "weekly", "monthly", or "yearly".'
        );
    }

    const formattedStartDate = format(startDate, "MM-dd-yyyy");
    const formattedEndDate = format(endDate, "MM-dd-yyyy");
    const dateRange = getDateRangeString(formattedStartDate, formattedEndDate);

    setStartDate(formattedStartDate);
    setEndDate(formattedEndDate);
    setSelectedDate(dateRange);
  };

  function calTotalByProduct(sales, purchases) {
    const productMap = {};

    sales.forEach((sale) => {
      const { product, unitPrice, qty } = sale;
      const { name, _id } = product;
      if (!productMap[_id]) {
        productMap[_id] = {
          id: _id,
          product: name,
          sale: unitPrice * qty,
          purchase: 0,
        };
      } else {
        productMap[_id].sale += unitPrice * qty;
      }
    });

    purchases.forEach((purchase) => {
      const { product, unitPrice, qty } = purchase;
      const { name, _id } = product;
      if (!productMap[_id]) {
        productMap[_id] = {
          id: _id,
          product: name,
          sale: 0,
          purchase: unitPrice * qty,
        };
      } else {
        productMap[_id].purchase += unitPrice * qty;
      }
    });

    const combinedData = Object.values(productMap);

    return combinedData;
  }

  function calQtyByProduct(sales, purchases) {
    const productMap = {};

    sales.forEach((sale) => {
      const { product, qty } = sale;
      const { name, _id } = product;
      if (!productMap[_id]) {
        productMap[_id] = {
          id: _id,
          product: name,
          sale: qty,
          purchase: 0,
        };
      } else {
        productMap[_id].sale += qty;
      }
    });

    purchases.forEach((purchase) => {
      const { product, qty } = purchase;
      const { name, _id } = product;
      if (!productMap[_id]) {
        productMap[_id] = {
          id: _id,
          product: name,
          sale: 0,
          purchase: qty,
        };
      } else {
        productMap[_id].purchase += qty;
      }
    });

    const combinedData = Object.values(productMap);

    return combinedData;
  }

  const saleAndCostByProduct = calTotalByProduct(saleLines, purchaseLines);

  const saleQtyByProduct = calQtyByProduct(saleLines, purchaseLines);

  const onApplyCustomDate = () => {
    setSelectedDate(
      getDateRangeString(customDateRange.startDate, customDateRange.endDate)
    );
    setStartDate(customDateRange.startDate);
    setEndDate(customDateRange.endDate);
  };

  useEffect(() => {
    getTotals();
  }, [startDate, endDate, locationId]);

  useEffect(() => {
    const getLocation = async () => {
      const resData = await getApi("/location", token.accessToken);
      const filteredLocation = resData.data.filter((la) => la.active === true);
      setLocation(filteredLocation);
    };

    getLocation();
  }, []);

  const COLORS = ["#A2C3DB", "#8871A0", "#8AAF22", "#DCB12D", "#3F9F9F"];
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <>
      {loading ? (
        <div className="w-full h-screen flex items-center justify-center bg-slate-50 opacity-75">
          <Spinner />
        </div>
      ) : (
        <div className="relative">
          <div className="flex justify-end mb-3">
            {/* {locationId ? (
              <h1 className="font-bold w-48 text-slate-500 text-xl">
                {" ( " +
                  location.find((loc) => loc.id === locationId)?.name +
                  " ) "}
              </h1>
            ) : (
              <h1 className="font-bold w-48 text-slate-500 text-xl"></h1>
            )} */}

            <div className="flex w-full justify-center items-center">
              {/* <Popover
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
                    <Icon icon="tdesign:location" className="text-md" />
                    <span className="text-sm ml-1">Filter</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Listbox
                    aria-label="Select location"
                    onAction={(key) => setLocationId(key)}
                  >
                    {location.map((loc) => (
                      <ListboxItem
                        className="rounded-none"
                        key={loc.id}
                        value={loc.id}
                      >
                        {loc.name}
                      </ListboxItem>
                    ))}
                  </Listbox>
                </PopoverContent>
              </Popover> */}
              <Select
                aria-label="location"
                variant="bordered"
                color="success"
                name="location"
                classNames={{
                  base: "w-52",
                  trigger: "h-10 py-3 rounded-md",
                }}
                selectedKeys={[locationId]?.filter(Boolean) || []}
                placeholder="Select an location"
                onChange={(e) => setLocationId(e.target.value)}
              >
                <SelectItem
                  className="rounded-none"
                  key="Overall View"
                  value="Overall View"
                >
                  All Location
                </SelectItem>
                {location.map((loc) => (
                  <SelectItem
                    className="rounded-none"
                    key={loc.id}
                    value={loc.id}
                  >
                    {loc.name}
                  </SelectItem>
                ))}
              </Select>
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
                  <Listbox aria-label="Select Date">
                    <ListboxItem
                      className="rounded-none"
                      onClick={() => calculateDates(DATE_FILTER.WEEKLY)}
                    >
                      Weekly
                    </ListboxItem>
                    <ListboxItem
                      className="rounded-none"
                      onClick={() => calculateDates(DATE_FILTER.MONTHLY)}
                    >
                      Monthly
                    </ListboxItem>
                    <ListboxItem
                      className="border-b-slate-300 border-b-2 rounded-sm"
                      onClick={() => calculateDates(DATE_FILTER.YEARLY)}
                    >
                      Yearly
                    </ListboxItem>
                    <ListboxItem
                      className="rounded-none"
                      onClick={() => calculateDates(DATE_FILTER.LAST_MONTH)}
                    >
                      Last Month
                    </ListboxItem>
                    <ListboxItem
                      className="rounded-none"
                      onClick={() => calculateDates(DATE_FILTER.LAST_QUARTER)}
                    >
                      Last Quarter
                    </ListboxItem>
                    <ListboxItem
                      className="border-b-slate-300 border-b-2 rounded-none"
                      onClick={() => calculateDates(DATE_FILTER.LAST_YEAR)}
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
                        onChange={(e) =>
                          setCustomDateRange((prev) => {
                            return {
                              ...prev,
                              startDate: format(
                                new Date(e.target.value),
                                "MM-dd-yyyy"
                              ),
                            };
                          })
                        }
                        className="border-none ml-2"
                      />
                    </div>

                    <div className="flex items-center">
                      <span>To :</span>
                      <input
                        type="date"
                        placeholder="Select date"
                        onChange={(e) =>
                          setCustomDateRange((prev) => {
                            return {
                              ...prev,
                              endDate: format(
                                new Date(e.target.value),
                                "MM-dd-yyyy"
                              ),
                            };
                          })
                        }
                        className="border-none ml-2"
                      />
                    </div>
                    <button
                      onClick={onApplyCustomDate}
                      className="px-3 py-1 hover:opacity-70 rounded-md mx-3 text-white font-semibold bg-[#56488f]"
                    >
                      Apply
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
              <div className="w-56 flex shadow-sm justify-center px-3 mx-3 py-1 bg-white border-2 text-center rounded-sm ring-2 ring-purple-500  ring-offset-slate-50 dark:ring-offset-slate-900">
                <h4 className="text-slate-500 items-center font-semibold ">
                  {selectedDate ?? "None"}
                </h4>
              </div>
            </div>
          </div>
          <div className="flex">
            {/* Sale Order  */}
            <div className="w-4/5	bg-white p-4 border-2 rounded-lg shadow-md">
              <div className="flex justify-between">
                <h3 className="text-lg font-semibold text-slate-700">
                  Sales Overview
                </h3>
              </div>
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
                      Gross Sales
                    </h2>
                    <h2 className="text-slate-800 text-xl font-extrabold my-2">
                      {totalGrossSale}
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
                      Gross Profit
                    </h2>
                    <h2 className="text-slate-800 text-xl font-extrabold  my-2">
                      {totalGrossProfit}
                    </h2>
                  </div>
                </div>
                <div className="flex items-center w-2/4">
                  <div className="p-4 bg-violet-300 rounded-md">
                    <Icon
                      icon="solar:sale-linear"
                      className="text-4xl text-violet-600 font-extrabold"
                    />
                  </div>
                  <div className="px-3">
                    <h2 className="text-slate-400 text-md font-semibold">
                      Net Sales
                    </h2>
                    <h2 className="text-slate-800 text-xl font-extrabold  my-2">
                      {totalGrossSale - totalDiscount}
                    </h2>
                  </div>
                </div>
                <div className="flex items-center w-2/4">
                  <div className="p-4 bg-pink-100 rounded-md">
                    <Icon
                      icon="la:cart-arrow-down"
                      className="text-4xl text-rose-600 font-extrabold"
                    />
                  </div>
                  <div className="px-3">
                    <h2 className="text-slate-400 text-md font-semibold">
                      Orders
                    </h2>
                    <h2 className="text-slate-800 text-xl font-extrabold  my-2">
                      {totalSaleOrders}
                    </h2>
                  </div>
                </div>
              </div>

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
                      Tax
                    </h2>
                    <h2 className="text-slate-800 text-xl font-extrabold  my-2">
                      {totalTax}
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
                      Discount
                    </h2>
                    <h2 className="text-slate-800 text-xl font-extrabold  my-2">
                      {totalDiscount}
                    </h2>
                  </div>
                </div>
                <div className="flex items-center w-2/4">
                  <div className="p-4 bg-[#d9f99d] rounded-md">
                    <Icon
                      icon="fluent-mdl2:product"
                      className="text-4xl text-[#8AAF22] font-extrabold"
                    />
                  </div>
                  <div className="px-3">
                    <h2 className="text-slate-400 text-md font-semibold">
                      Items
                    </h2>
                    <h2 className="text-slate-800 text-xl font-extrabold  my-2">
                      {totalSaleItems}
                    </h2>
                  </div>
                </div>
                <div className="flex items-center w-2/4">
                  <div className="p-4 bg-orange-100 rounded-md">
                    <Icon
                      icon="fluent-mdl2:product-variant"
                      className="text-4xl text-orange-600"
                    />
                  </div>
                  <div className="px-3">
                    <h2 className="text-slate-400 text-md font-semibold">
                      Quantity
                    </h2>
                    <h2 className="text-slate-800 text-xl font-extrabold  my-2">
                      {totalSaleQty}
                    </h2>
                  </div>
                </div>
              </div>
            </div>

            {/* Purchase Order */}
            <div className="w-2/5	bg-white p-4 border-2 rounded-lg mx-3 shadow-md">
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
                      Cost
                    </h2>
                    <h2 className="text-slate-800 text-xl font-extrabold my-2">
                      {totalPurchaseAmount}
                    </h2>
                  </div>
                </div>
                <div className="flex items-center w-2/4">
                  <div className="p-4 bg-pink-100 rounded-md">
                    <Icon
                      icon="la:cart-arrow-down"
                      className="text-4xl text-rose-600 font-extrabold"
                    />
                  </div>
                  <div className="px-3">
                    <h2 className="text-slate-400 text-md font-semibold">
                      Orders
                    </h2>
                    <h2 className="text-slate-800 text-xl font-extrabold my-2">
                      {totalPurchaseOrders}
                    </h2>
                  </div>
                </div>
              </div>
              {/* Monthly Sales */}
              <div className=" my-3 px-4 flex">
                <div className="flex items-center w-2/4	">
                  <div className="p-4 bg-[#d9f99d] rounded-md">
                    <Icon
                      icon="fluent-mdl2:product"
                      className="text-4xl text-[#8AAF22] font-extrabold"
                    />
                  </div>
                  <div className="mx-3">
                    <h2 className="text-slate-400 text-md font-semibold">
                      Products
                    </h2>
                    <h2 className="text-slate-800 text-xl font-extrabold my-2">
                      {totalPurchaseItems}
                    </h2>
                  </div>
                </div>
                <div className="flex items-center w-2/4	">
                  <div className="p-4 bg-orange-100 rounded-md">
                    <Icon
                      icon="fluent-mdl2:product-variant"
                      className="text-4xl text-orange-600"
                    />
                  </div>
                  <div className="px-3">
                    <h2 className="text-slate-400 text-md font-semibold">
                      Quantity
                    </h2>
                    <h2 className="text-slate-800 text-xl font-extrabold my-2">
                      {totalPurchaseQty}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex my-4">
            <div className="w-3/5 bg-white rounded-lg shadow-md p-4">
              <h2 className="text-slate-600 text-lg font-semibold my-3">
                Gross Sales vs Cost by Product
              </h2>
              <ResponsiveContainer height={300} width="100%">
                <BarChart
                  width={500}
                  height={300}
                  data={saleAndCostByProduct}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="product" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="sale"
                    fill="#82ca9d"
                    activeBar={<Rectangle fill="pink" stroke="blue" />}
                  />
                  <Bar
                    dataKey="purchase"
                    fill="#8884d8"
                    activeBar={<Rectangle fill="gold" stroke="purple" />}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/5 bg-white rounded-lg shadow-md p-4 mx-3">
              <h2 className="text-slate-600 text-lg font-semibold my-3">
                Top Purchased Items
              </h2>
              <ResponsiveContainer height={300} className="text-center">
                <PieChart>
                  <Legend layout="vertical" verticalAlign="top" align="top" />
                  <Pie
                    data={popularPurchaseProducts}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
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
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/5 bg-white rounded-lg shadow-md p-4">
              <h2 className="text-slate-600 text-lg font-semibold my-3">
                Top Selling Items
              </h2>
              <ResponsiveContainer height={300} className="text-center">
                <PieChart>
                  <Legend layout="vertical" verticalAlign="top" align="top" />
                  <Pie
                    data={popularSaleProducts}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {popularSaleProducts.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="flex my-4">
            <div className="w-3/5 bg-white rounded-lg shadow-md p-4 mr-2">
              <h2 className="text-slate-600 text-lg font-semibold my-3">
                Sales - Purchases Qty by Product
              </h2>
              <ResponsiveContainer height={300} width="100%">
                <BarChart
                  width={500}
                  height={300}
                  data={saleQtyByProduct}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="product" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="sale"
                    fill="#82ca9d"
                    activeBar={<Rectangle fill="pink" stroke="blue" />}
                  />
                  <Bar
                    dataKey="purchase"
                    fill="#8884d8"
                    activeBar={<Rectangle fill="gold" stroke="purple" />}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="w-2/5 bg-white rounded-lg shadow-md p-4 ml-1">
              <h2 className="text-slate-600 text-lg font-semibold my-3">
                Low Stock Qty by Product
              </h2>
              <ResponsiveContainer height={300} width="100%">
                <BarChart
                  width={500}
                  height={300}
                  data={lowStock}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="onHand"
                    fill="#82ca9d"
                    activeBar={<Rectangle fill="pink" stroke="blue" />}
                  />
                </BarChart>
              </ResponsiveContainer>
              {/* <ResponsiveContainer width="100%" height={300}>
                <BarChart width={500} height={300} data={lowStock}>
                  <Bar dataKey="onHand" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer> */}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
