import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Pie,
  Cell,
  PieChart,
  ReferenceLine,
} from "recharts";
import { getApi } from "../../Api";
import { format } from "date-fns";
import FadeLoader from "react-spinners/FadeLoader";
import { useDispatch, useSelector } from "react-redux";
import { Icon } from "@iconify/react";
import { removeData } from "../../../redux/actions";

export default function View() {
  const [sale, setSale] = useState([]);
  const [stock, setStock] = useState([]);
  const [popularProductsData, setPopularProductsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saleLines, setSaleLines] = useState([]);
  const token = useSelector((state) => state.IduniqueData);
  const dipatch = useDispatch();

  const getSaleOrder = async () => {
    setLoading(true);
    let resData = await getApi("/sale", token.accessToken);
    if (resData.message == "Token Expire , Please Login Again") {
      dipatch(removeData(null));
    }
    if (resData.status) {
      setLoading(false);
      setSale(resData.data);
    } else {
      setLoading(true);
    }
  };

  const getSaleLinesApi = async () => {
    setLoading(true);
    let resData = await getApi("/salelines", token.accessToken);
    if (resData.message == "Token Expire , Please Login Again") {
      dipatch(removeData(null));
    }
    if (resData.status) {
      setLoading(false);
      setSaleLines(resData.data);
    } else {
      setLoading(true);
    }
  };

  const getStockApi = async () => {
    setLoading(true);
    let resData = await getApi("/stock", token.accessToken);
    if (resData.message == "Token Expire , Please Login Again") {
      dipatch(removeData(null));
    }
    if (resData.status) {
      setLoading(false);
      setStock(resData.data);
    } else {
      setLoading(true);
    }
  };

  const formattedSaleData = sale.map((item) => ({
    ...item,
    created: format(new Date(item.createdAt), "yyyy-MM-dd"),
  }));

  const todayDate = format(new Date(), "dd.MM.yyyy"); // Get today's date in the same format as orderDate

  //Filter the sale data based on the order date matching the current date
  const filteredSales = sale.filter((sl) => {
    const formattedOrderDate = format(new Date(sl.orderDate), "dd.MM.yyyy");

    return formattedOrderDate === todayDate;
  });

  //To show barchart for only today date
  const todaySaleDate  = filteredSales.map((item) => ({
    ...item,
    created: format(new Date(item.createdAt), "yyyy-MM-dd"),
  }));

  console.log("sale date is" , filteredSales)

  const todaySaleLines = saleLines.filter(
    (saleLine) =>
      format(new Date(saleLine.orderDate), "dd.MM.yyyy") === todayDate
  );

  const todayStock = stock.filter(
    (stk) => format(new Date(stk.updatedAt), "dd.MM.yyyy") === todayDate
  );

  // Sum up the "total" values of the filtered sale data
  const todayTotalSales = filteredSales.reduce(
    (total, sale) => total + sale.total,
    0
  );

  const getStockQuantity = (productId) => {
    const todayStockEntry = todayStock.find(
      (stockItem) => stockItem.product._id === productId
    );
    return todayStockEntry ? todayStockEntry.onHand : 0;
  };

  const totalProfit = todaySaleLines.reduce((sum, line) => {
    // Check if purchasePrice is a valid number
    if (
      typeof line.product.purchasePrice === "number" &&
      !isNaN(line.product.purchasePrice)
    ) {
      // Check if marginProfit is a valid number
      if (
        typeof line.product.marginProfit === "number" &&
        !isNaN(line.product.marginProfit)
      ) {
        // const profit =
        //   line.product.purchasePrice +
        //   (line.product.marginProfit / 100) * line.qty;

        const profit =
          parseFloat(line.product.purchasePrice) *
          (parseFloat(line.product.marginProfit) / 100) *
          line.qty;

        return sum + profit;
      } else {
        console.error("Invalid marginProfit:", line.product.marginProfit);
      }
    } else {
      console.error("Invalid purchasePrice:", line.product.purchasePrice);
    }

    return sum; // Return the sum without adding anything if there's an issue
  }, 0);

  useEffect(() => {
    getStockApi();
    getSaleOrder();
    getSaleLinesApi();
  }, []);

  console.log("date is", formattedSaleData);
  console.log("today  dte  is", todayDate);

  useEffect(() => {
    // Count the quantity sold for each product
    const productCount = saleLines.reduce((acc, saleLine) => {
      const productId = saleLine.product._id;
      acc[productId] = (acc[productId] || 0) + saleLine.qty;
      return acc;
    }, {});

    // Sort products by quantity sold in descending order
    const sortedProducts = Object.keys(productCount).sort(
      (a, b) => productCount[b] - productCount[a]
    );

    // Take the top 4 products
    const topProducts = sortedProducts.slice(0, 5);

    // Create data for the pie chart
    const pieChartData = topProducts.map((productId, index) => ({
      name:
        saleLines.find((saleLine) => saleLine.product._id === productId)
          ?.product.name || `Product ${index + 1}`,
      value: productCount[productId],
    }));

    setPopularProductsData(pieChartData);
  }, [saleLines]);

  return (
    <>
      <div className="px-8 w-full">
        <div className="w-full  flex justify-between">
          <div className="px-2 py-4 w-64 flex  items-center bg-white justify-evenly rounded-md shadow-md">
            <Icon icon="bi:cart-fill" className="text-4xl text-cyan-600" />
            <div className="">
              <h3 className="font-bold text-slate-600 text-xl">
                Today Total Sales
              </h3>
              <h4 className="text-lg font-bold text-slate-600">
                {todayTotalSales} mmk
              </h4>
            </div>
          </div>
          <div className="px-2 py-4 w-64 flex items-center bg-white justify-evenly rounded-md shadow-md">
            <Icon icon="solar:cart-bold" className="text-4xl text-blue-600" />
            <div>
              <h3 className="font-bold text-slate-600 text-xl">Today Orders</h3>

              <h4 className="text-lg font-bold text-slate-600">
                {filteredSales.length} orders
              </h4>
            </div>
          </div>
          <div className="px-2 py-4 w-64 flex  items-center bg-white justify-evenly rounded-md shadow-md">
            <Icon icon="fa:users" className="text-4xl text-[#8884d8]" />
            <div>
              <h3 className="font-bold text-slate-600 text-xl">
                Total Customer
              </h3>
              <h4 className="text-lg font-bold text-slate-600">
                {
                  new Set(
                    filteredSales.map((sal) => sal.partner && sal.partner._id)
                  ).size
                }
              </h4>
            </div>
          </div>
          <div className="px-2 py-4 w-64 flex  items-center bg-white justify-evenly rounded-md shadow-md">
            <Icon
              icon="game-icons:profit"
              className="text-5xl text-green-600"
            />
            <div>
              <h3 className="font-bold text-slate-600 text-xl">Today Profit</h3>
              <h4 className="text-lg font-bold text-slate-600">
                {totalProfit} mmk
              </h4>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="w-full flex my-4">
            <div className="w-3/5 bg-white p-2 rounded-md shadow-md">
              <h3 className="text-slate-500 font-semibold text-lg mb-6">
                Purchase Order Dashboard
              </h3>
     
             <ResponsiveContainer height={300} className="mx-auto">
              <BarChart
                width="100%"
                height={300}
                data={todaySaleDate}
                // Filter data for today's date
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 60
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="created"
                  angle={-60} // Rotate the text by -60 degrees
                  textAnchor="end" // Anchor the text at the end (right)
                />
                <YAxis dataKey="total" />
                <Tooltip />
                <Bar dataKey="total" barSize={20} fill="#8884d8" />

                {/* Add the following ReferenceLine component */}
                <ReferenceLine
                  y={1} // Set the y-value where you want the line to appear
                  stroke="#8884d8" // Set the color of the line
                  strokeDasharray="3 3" // Optional: Add a dashed pattern to the line
                />
              </BarChart>
            </ResponsiveContainer>

            </div>
            <div className="items-center w-2/5 ml-4 bg-white p-2 rounded-md shadow-md">
              <h1 className="text-slate-500 font-semibold text-lg mb-2">
                Most of sale products
              </h1>
              <ResponsiveContainer height={300} className="mx-auto ">
                <PieChart>
                  <Pie
                    dataKey="value"
                    data={popularProductsData}
                    fill="#8884d8"
                    label={(entry) => entry.name}
                  >
                    {popularProductsData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`#${Math.floor(Math.random() * 16777215).toString(
                          16
                        )}`}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="w-full flex">
            <div className="w-3/4 bg-white px-2 py-4 rounded-md shadow-md h-auto ">
              <h2 className="text-slate-600 font-semibold text-lg mb-3">
                Recents Order
              </h2>
              <table className="w-full">
                <tr className="bg-[#e2e8f0]">
                  <th className="lg:px-4 py-2 text-center text-slate-800">
                    Customer Name
                  </th>
                  <th className="lg:px-4 py-2 text-center text-slate-800">
                    Order Date
                  </th>
                  <th className="lg:px-4 py-2 text-center text-slate-800">
                    Order Total
                  </th>
                  <th className="lg:px-4 py-2 text-center text-slate-800">
                    Address
                  </th>
                  <th className="lg:px-4 py-2 text-center text-slate-800">
                    Order Status
                  </th>
                </tr>

                <tbody className="w-full space-y-10 relative">
                  {filteredSales.length > 0 ? (
                    filteredSales.map((sal) => (
                      <tr key={sal.id}>
                        <td className="lg:px-4 py-2 text-center">
                          {sal.partner && sal.partner.name}
                        </td>
                        <td className="lg:px-4 py-2 text-center">
                          {format(new Date(sal.orderDate), "yyyy-MM-dd")}
                        </td>
                        <td className="lg:px-4 py-2 text-center">
                          {sal.total}
                        </td>
                        <td className="lg:px-4 py-2 text-center">
                          {sal.location ? sal.location.name : "store customer"}
                        </td>
                        <td
                          className={`lg:px-4 py-2 text-center font-semibold ${
                            sal.state == "pending"
                              ? "text-red-400"
                              : sal.state == "deliver"
                              ? "text-cyan-700"
                              : sal.state == "arrived"
                              ? "text-green-600"
                              : ""
                          }`}
                        >
                          {sal.state ? sal.state : "store customer"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <h2 className="text-center text-xl text-slate-600 font-semibold  h-32 w-full absolute mt-20">
                      No Currently sales
                    </h2>
                  )}
                </tbody>
              </table>
            </div>

            <div className="items-center w-1/4 bg-white px-2 py-4 ml-4 rounded-md h-auto shadow-md">
              <h1 className="text-slate-600 font-semibold text-lg mb-6">
                Today Sale Products
              </h1>
              <div className="px-2 max-h-80 overflow-y-scroll custom-scrollbar">
                {todaySaleLines.length > 0 ? (
                  todaySaleLines.map((saleLine) => (
                    <div
                      key={saleLine._id}
                      className="w-full flex justify-between mb-3 border-b-2 pb-3"
                    >
                      <div className="flex flex-col">
                        <h4 className="text-md text-slate-700 font-bold">
                          {saleLine.product.name}
                        </h4>
                        <h4 className="font-bold text-green-700">
                          Stock in {getStockQuantity(saleLine.product._id)}
                        </h4>
                      </div>
                      <p className="text-slate-500 font-semibold">
                        {saleLine.product.salePrice} mmk
                      </p>
                    </div>
                  ))
                ) : (
                  <h2 className="text-center text-md text-slate-600 font-semibold h-32 mt-20">
                    No Currently sale product
                  </h2>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {sale.length > 0 && (
        <div className="absolute inset-0 flex justify-center items-center">
          {loading && (
            <FadeLoader
              color={"#0284c7"}
              loading={loading}
              size={20}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          )}
        </div>
      )}
    </>
  );
}
