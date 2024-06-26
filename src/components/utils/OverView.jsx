import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import useWindowSize from "./WindowSize";
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

const truncateLabel = (label, maxLength) => {
  return label.length > maxLength
    ? `${label.substring(0, maxLength)}...`
    : label;
};

const CustomizedAxisTick = ({ x, y, payload }) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="end" fill="#666">
        {truncateLabel(payload.value, 15)}
      </text>
    </g>
  );
};

export default function OverView() {
  const windowSize = useWindowSize();

  const calculateOuterRadius = () => {
    if (windowSize.width >= 1280) {
      // Desktop screen size
      return 80;
    } else if (windowSize.width >= 1024) {
      return 60;
    } else {
      return 40;
    }
  };
  const outerRadius = calculateOuterRadius();

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

  const saleAndCostByProductLimited = saleAndCostByProduct
    ? saleAndCostByProduct.slice(0, 5)
    : [];

  const saleQtyByProduct = calQtyByProduct(saleLines, purchaseLines);

  const saleQtyByProductLimited = saleQtyByProduct
    ? saleQtyByProduct.slice(0, 5)
    : [];

  const lowStockLimited = lowStock ? lowStock.slice(0, 5) : [];

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
            <div className="flex w-full justify-center items-center">
              <Select
                aria-label="location"
                variant="bordered"
                color="success"
                name="location"
                classNames={{
                  base: "w-52",
                  trigger: "h-9 py-4 rounded-md",
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
              <div className="w-56 flex shadow-sm justify-center mx-3 bg-white border-2 text-center rounded-sm ring-2 ring-purple-500 ring-offset-slate-50 dark:ring-offset-slate-900">
                <h4 className="text-slate-500 items-center py-0.5 font-semibold">
                  {selectedDate ?? "None"}
                </h4>
              </div>
            </div>
          </div>
          <div className="flex">
            {/* Sale Order  */}
            <div className="w-4/5 bg-white p-4 border-2 rounded-lg shadow-md">
              <div className="flex justify-between">
                <h3 className="text-lg lg:text-md font-semibold text-slate-700">
                  Sales Overview
                </h3>
              </div>
              <div className="flex px-4 mt-6">
                <div className="flex items-center xl:w-2/4 lg:w-2/5">
                  <div className="xl:p-3 2xl:p-4 bg-blue-200 lg:p-1 rounded-md">
                    <Icon
                      icon="solar:cart-4-outline"
                      className="xl:text-3xl 2xl:text-4xl lg:text-2xl text-cyan-600 font-extrabold"
                    />
                  </div>
                  <div className="w-full lg:mx-1.5 xl:mx-2 2xl:mx-3">
                    <h2 className="text-slate-400 lg:text-sm w-full xl:text-md 2xl:text-lg font-semibold">
                      Gross Sales
                    </h2>
                    <h2 className="text-slate-800 lg:text-sm xl:text-lg 2xl:text-xl font-extrabold my-2">
                      {totalGrossSale}
                    </h2>
                  </div>
                </div>
                <div className="flex items-center w-2/4 lg:md-2/5">
                  <div className="xl:p-3 2xl:p-4 lg:p-1 bg-yellow-100 rounded-md">
                    <Icon
                      icon="tdesign:undertake-transaction"
                      className="xl:text-3xl 2xl:text-4xl lg:text-2xl text-yellow-600 font-extrabold"
                    />
                  </div>
                  <div className="w-full lg:mx-1.5 xl:mx-2 2xl:mx-3">
                    <h2 className="text-slate-400 lg:text-sm xl:text-md 2xl:text-lg font-semibold">
                      Gross Profit
                    </h2>
                    <h2 className="text-slate-800 lg:text-sm xl:text-lg 2xl:text-xl font-extrabold my-2">
                      {totalGrossProfit}
                    </h2>
                  </div>
                </div>
                <div className="flex items-center w-2/4 lg:md-2/5">
                  <div className="xl:p-3 2xl:p-4 lg:p-1 bg-violet-300 rounded-md">
                    <Icon
                      icon="solar:sale-linear"
                      className="xl:text-3xl 2xl:text-4xl lg:text-2xl text-violet-600 font-extrabold"
                    />
                  </div>
                  <div className="w-full lg:mx-1.5 xl:mx-2 2xl:mx-3 lg:w-20">
                    <h2 className="text-slate-400 lg:text-sm xl:text-md 2xl:text-lg font-semibold">
                      Net Sales
                    </h2>
                    <h2 className="text-slate-800 lg:text-sm xl:text-lg 2xl:text-xl font-extrabold  my-2">
                      {totalGrossSale - totalDiscount}
                    </h2>
                  </div>
                </div>
                <div className="flex items-center w-2/4 lg:md-2/5">
                  <div className="xl:p-3 2xl:p-4 lg:p-1 bg-pink-100 rounded-md">
                    <Icon
                      icon="la:cart-arrow-down"
                      className="xl:text-3xl 2xl:text-4xl lg:text-2xl text-rose-600 font-extrabold"
                    />
                  </div>
                  <div className="w-full lg:mx-1.5 xl:mx-2 2xl:mx-3 lg:w-20">
                    <h2 className="text-slate-400 lg:text-sm xl:text-md 2xl:text-lg font-semibold">
                      Orders
                    </h2>
                    <h2 className="text-slate-800 lg:text-sm xl:text-lg 2xl:text-xl font-extrabold  my-2">
                      {totalSaleOrders}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="flex px-4 my-6">
                <div className="flex items-center xl:w-2/4 lg:w-2/5">
                  <div className="xl:p-3 2xl:p-4 lg:p-1 bg-orange-200 rounded-md">
                    <Icon
                      icon="carbon:purchase"
                      className="xl:text-3xl 2xl:text-4xl lg:text-2xl text-orange-600 font-extrabold"
                    />
                  </div>
                  <div className="w-full lg:mx-1.5 xl:mx-2 2xl:mx-3 lg:w-20">
                    <h2 className="text-slate-400 lg:text-sm xl:text-md 2xl:text-lg font-semibold">
                      Tax
                    </h2>
                    <h2 className="text-slate-800 lg:text-sm xl:text-lg 2xl:text-xl font-extrabold my-2">
                      {totalTax}
                    </h2>
                  </div>
                </div>
                <div className="flex items-center lg:w-2/5 xl:w-2/4">
                  <div className="xl:p-3 2xl:p-4 lg:p-1 bg-green-100 rounded-md">
                    <Icon
                      icon="uil:file-graph"
                      className="xl:text-3xl 2xl:text-4xl lg:text-2xl text-green-600 font-extrabold"
                    />
                  </div>
                  <div className="w-full lg:mx-1.5 xl:mx-2 2xl:mx-3 lg:w-20">
                    <h2 className="text-slate-400 lg:text-sm xl:text-md 2xl:text-lg font-semibold">
                      Discount
                    </h2>
                    <h2 className="text-slate-800 lg:text-sm xl:text-lg 2xl:text-xl font-extrabold my-2">
                      {totalDiscount}
                    </h2>
                  </div>
                </div>
                <div className="flex items-center lg:w-2/5 xl:w-2/4">
                  <div className="xl:p-3 2xl:p-4 lg:p-1 bg-[#d9f99d] rounded-md">
                    <Icon
                      icon="fluent-mdl2:product"
                      className="xl:text-3xl 2xl:text-4xl lg:text-2xl text-[#8AAF22] font-extrabold"
                    />
                  </div>
                  <div className="w-full lg:mx-1.5 xl:mx-2 2xl:mx-3 lg:w-20">
                    <h2 className="text-slate-400 lg:text-sm xl:text-md 2xl:text-lg font-semibold">
                      Items
                    </h2>
                    <h2 className="text-slate-800 lg:text-sm xl:text-lg 2xl:text-xl font-extrabold  my-2">
                      {totalSaleItems}
                    </h2>
                  </div>
                </div>
                <div className="flex items-center lg:w-2/5 xl:w-2/4">
                  <div className="xl:p-3 2xl:p-4 lg:p-1 bg-orange-100 rounded-md">
                    <Icon
                      icon="fluent-mdl2:product-variant"
                      className="xl:text-3xl 2xl:text-4xl lg:text-2xl text-orange-600"
                    />
                  </div>
                  <div className="w-full lg:mx-1.5 xl:mx-2 2xl:mx-3 lg:w-20">
                    <h2 className="text-slate-400 lg:text-sm xl:text-md 2xl:text-lg font-semibold">
                      Quantity
                    </h2>
                    <h2 className="text-slate-800 lg:text-sm xl:text-lg 2xl:text-xl font-extrabold  my-2">
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
              <div className="flex px-4 mt-6">
                <div className="flex items-center lg:w-2/5 xl:w-2/4">
                  <div className="xl:p-3 2xl:p-4 lg:p-1 bg-orange-100 rounded-md">
                    <Icon
                      icon="la:cart-plus"
                      className="xl:text-3xl 2xl:text-4xl lg:text-2xl text-violet-600 font-extrabold"
                    />
                  </div>
                  <div className="lg:mx-1.5 xl:mx-2 2xl:mx-3 lg:w-20">
                    <h2 className="text-slate-400 lg:text-sm xl:text-md 2xl:text-lg font-semibold">
                      Cost
                    </h2>
                    <h2 className="text-slate-800 lg:text-sm xl:text-lg 2xl:text-xl font-extrabold my-2">
                      {totalPurchaseAmount}
                    </h2>
                  </div>
                </div>
                <div className="flex items-center lg:w-2/5 xl:w-2/4">
                  <div className="xl:p-3 2xl:p-4 lg:p-1 bg-orange-100 rounded-md">
                    <Icon
                      icon="la:cart-arrow-down"
                      className="xl:text-3xl 2xl:text-4xl lg:text-2xl text-rose-600 font-extrabold"
                    />
                  </div>
                  <div className="lg:mx-1.5 xl:mx-2 2xl:mx-3 lg:w-20">
                    <h2 className="text-slate-400 lg:text-sm xl:text-md 2xl:text-lg font-semibold">
                      Orders
                    </h2>
                    <h2 className="text-slate-800 lg:text-sm xl:text-lg 2xl:text-xl font-extrabold my-2">
                      {totalPurchaseOrders}
                    </h2>
                  </div>
                </div>
              </div>
              {/* Monthly Sales */}
              <div className="flex px-4 my-6">
                <div className="flex items-center lg:w-2/5 xl:w-2/4">
                  <div className="xl:p-3 2xl:p-4 lg:p-1 bg-[#d9f99d] rounded-md">
                    <Icon
                      icon="fluent-mdl2:product"
                      className="xl:text-3xl 2xl:text-4xl lg:text-2xl text-[#8AAF22] font-extrabold"
                    />
                  </div>
                  <div className="lg:mx-1.5 xl:mx-2 2xl:mx-3 lg:w-20">
                    <h2 className="text-slate-400 lg:text-sm xl:text-md 2xl:text-lg font-semibold">
                      Products
                    </h2>
                    <h2 className="text-slate-800 lg:text-sm xl:text-lg 2xl:text-xl font-extrabold my-2">
                      {totalPurchaseItems}
                    </h2>
                  </div>
                </div>
                <div className="flex items-center lg:w-2/5 xl:w-2/4">
                  <div className="xl:p-3 2xl:p-4 lg:p-1 bg-orange-100 rounded-md">
                    <Icon
                      icon="fluent-mdl2:product-variant"
                      className="xl:text-3xl 2xl:text-4xl lg:text-2xl text-orange-600"
                    />
                  </div>
                  <div className="lg:mx-1.5 xl:mx-2 2xl:mx-3 lg:w-20">
                    <h2 className="text-slate-400 lg:text-sm xl:text-md 2xl:text-lg font-semibold">
                      Quantity
                    </h2>
                    <h2 className="text-slate-800 lg:text-sm xl:text-lg 2xl:text-xl font-extrabold my-2">
                      {totalPurchaseQty}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex my-4">
            <div className="w-3/5 bg-white rounded-lg shadow-md p-2">
              <h2 className="text-slate-600 text-lg font-semibold my-3">
                Gross Sales vs Cost by Product
              </h2>
              <ResponsiveContainer height={400} width="100%">
                <BarChart
                  width={800}
                  height={400}
                  data={saleAndCostByProductLimited}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="product" tick={<CustomizedAxisTick />} />
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
            <div className="w-2/5 ml-1.5 flex">
              <div className="w-2/4 bg-white rounded-lg shadow-md p-2 mr-1.5">
                <h2 className="text-slate-600 sm:text-sm md:text-sm lg:text-md xl:text-lg font-semibold my-1.5 lg:text-md">
                  Top Purchased Items
                </h2>
                <ResponsiveContainer height={400}>
                  <PieChart>
                    <Legend
                      layout="vertical"
                      verticalAlign="top"
                      align="top"
                      iconSize={10}
                      wrapperStyle={{ fontSize: "12px" }}
                    />

                    <Pie
                      data={popularPurchaseProducts}
                      cx="50%"
                      cy="30%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={outerRadius}
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
              <div className="w-2/4 bg-white  rounded-lg shadow-md p-2">
                <h2 className="text-slate-600 stext-slate-600 sm:text-sm md:text-sm lg:text-md xl:text-lg font-semibold my-1.5 lg:text-md">
                  Top Selling Items
                </h2>
                <ResponsiveContainer height={400}>
                  <PieChart>
                    <Legend
                      layout="vertical"
                      verticalAlign="top"
                      align="top"
                      iconSize={10}
                      wrapperStyle={{ fontSize: "12px" }}
                    />
                    <Pie
                      data={popularSaleProducts}
                      cx="50%"
                      cy="30%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={outerRadius}
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
          </div>
          <div className="flex my-4">
            <div className="w-3/5 bg-white rounded-lg shadow-md p-4 mr-2">
              <h2 className="text-slate-600 text-lg font-semibold my-3">
                Sales - Purchases Qty by Product
              </h2>
              <ResponsiveContainer height={400} width="100%">
                <BarChart
                  width={800}
                  height={300}
                  data={saleQtyByProductLimited}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="product" tick={<CustomizedAxisTick />} />
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
              <ResponsiveContainer height={400} width="100%">
                <BarChart width={500} height={400} data={lowStockLimited} x>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={<CustomizedAxisTick />} />
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
            </div>
          </div>
        </div>
      )}
    </>
  );
}

CustomizedAxisTick.propTypes = {
  x: PropTypes.string,
  y: PropTypes.string,
  payload: PropTypes.string,
};
