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
  Legend,
  Rectangle,
} from "recharts";

import { getApi } from "../../Api";
import { format } from "date-fns";
import FadeLoader from "react-spinners/FadeLoader";
import { useDispatch, useSelector } from "react-redux";
import { Icon } from "@iconify/react";
import { removeData } from "../../../redux/actions";

export default function SaleView() {
  const [purchase, setPurchase] = useState([]);
  const [purchaseLines, setPurchaseLines] = useState([]);
  const [popularProductsData, setPopularProductsData] = useState([]);
  const [stock, setStock] = useState([]);

  const [totalAmount, setTotalAmount] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPerDay, setTotalPerDay] = useState([]);
  const [orderLines, setOrderLines] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);

  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.IduniqueData);
  const dipatch = useDispatch();

  const getPurchase = async () => {
    setLoading(true);
    let resData = await getApi("/sale", token.accessToken);
    if (resData.message == "Token Expire , Please Login Again") {
      dipatch(removeData(null));
    }
    if (resData.success) {
      setLoading(false);
      setPurchase(resData.data);
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

  const getPurhaseLines = async () => {
    setLoading(true);
    let resData = await getApi("/salelines", token.accessToken);
    if (resData.message == "Token Expire , Please Login Again") {
      dipatch(removeData(null));
    }

    if (resData.status) {
      setLoading(false);
      setPurchaseLines(resData.data);
    } else {
      setLoading(true);
    }
  };

  const lineChartData = orderLines.map((line) => {
    return {
      id: line._id,
      orderRef: line.orderId.orderRef,
      productId: line.product.name,
      total: line.subTotal,
    };
  });

  const todayDate = format(new Date(), "MM-dd-yyyy"); // Get today's date in the same format as orderDate

  const todayPurchaseLine = purchaseLines.filter(
    (purchase) =>
      format(new Date(purchase.orderDate), "MM-dd-yyyy") === todayDate
  );

  const getTotals = async () => {
    setLoading(true);
    let resData = await getApi(
      `/orders/totals?startDate=${todayDate.toString()}`,
      token.accessToken
    );

    console.log("res data s a", resData);
    if (resData.status) {
      setTotalAmount(resData.data.sales.totalAmountWithTax);
      setTotalOrders(resData.data.sales.totalOrders);
      setTotalPerDay(resData.data.sales.totalsAmountPerDay);
      setTotalItems(resData.data.sales.totalItems);
      setOrderLines(resData.data.sales.allLines);
      setPopularProducts(resData.data.sales.topProducts);
      setLoading(false);
    } else {
      setLoading(true);
    }
  };

  useEffect(() => {
    getStockApi();
    getPurchase();
    getTotals();
    getPurhaseLines();
  }, []);

  const todayStock = stock.filter(
    (stk) => format(new Date(stk.updatedAt), "MM-dd-yyyy") === todayDate
  );

  const orderList = Array.from(
    new Set(orderLines.map((line) => line.orderId._id))
  ).map(
    (orderId) => orderLines.find((line) => line.orderId._id === orderId).orderId
  );

  useEffect(() => {
    // Count the quantity sold for each product
    const productCount = purchaseLines.reduce((acc, purchaseLine) => {
      const productId = purchaseLine.product._id;
      acc[productId] = (acc[productId] || 0) + purchaseLine.qty;
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
        purchaseLines.find((purchase) => purchase.product._id === productId)
          ?.product.name || `Product ${index + 1}`,
      value: productCount[productId],
    }));

    setPopularProductsData(pieChartData);
  }, [purchaseLines]);

  const getStockQuantity = (productId) => {
    const todayStockEntry = todayStock.find(
      (stockItem) => stockItem.product._id === productId
    );
    return todayStockEntry ? todayStockEntry.onHand : 0;
  };

  console.log("sale lines is a", orderLines);

  return (
    <>
      <div className="px-8 w-full">
        <div className="w-full  flex justify-between">
          <div className="px-2 py-4 w-64 flex  items-center bg-white justify-evenly rounded-md shadow-md">
            <Icon
              icon="icon-park-solid:buy"
              className="text-4xl text-cyan-700 font-semibold"
            />
            <div className="">
              <h3 className="font-bold text-slate-600 text-xl">
                Total Sales <span className="text-sm">(Inc. Tax)</span>
              </h3>
              <h4 className="text-lg font-bold text-slate-600">
                {totalAmount}
              </h4>
            </div>
          </div>
          <div className="px-2 py-4 w-64 flex  items-center bg-white justify-evenly rounded-md shadow-md">
            <Icon
              icon="icons8:buy"
              className="text-5xl text-blue-700 font-semibold"
            />

            <div className="">
              <h3 className="font-bold text-slate-600 text-xl">Transactions</h3>
              <h4 className="text-lg font-bold text-slate-600">
                {totalOrders}
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
                    orderList.map((line) => line.partner && line.partner._id)
                  ).size
                }
              </h4>
            </div>
          </div>

          <div className="px-2 py-4 w-64 flex  items-center bg-white justify-evenly rounded-md shadow-md">
            <Icon
              icon="fluent-mdl2:product-variant"
              className="text-4xl text-green-500"
            />

            <div>
              <h3 className="font-bold text-slate-600 text-xl">
                Product Sales
              </h3>
              <h4 className="text-lg font-bold text-slate-600">{totalItems}</h4>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <div className="w-full flex my-4">
            <div className="w-3/5 bg-white p-2 rounded-md shadow-md">
              <h3 className="text-slate-500 font-semibold text-lg mb-6">
                Daily Sale Order Dashboard
              </h3>
              <ResponsiveContainer height={300} className="mx-auto">
                <BarChart
                  width={500}
                  height={300}
                  data={lineChartData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="orderRef" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {/* <Bar
                    dataKey="pv"
                    fill="#8884d8"
                    activeBar={<Rectangle fill="pink" stroke="blue" />}
                  /> */}
                  <Bar
                    dataKey="total"
                    fill="#82ca9d"
                    activeBar={<Rectangle fill="gold" stroke="purple" />}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="items-center w-2/5 ml-4 bg-white p-2 rounded-md shadow-md">
              <h1 className="text-slate-500 font-semibold text-lg mb-6">
                All Time Popular Products
              </h1>
              <ResponsiveContainer height={300} className="mx-auto">
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
            <div className="w-3/4 bg-white p-2 rounded-md shadow-md">
              <h2 className="text-slate-600 font-semibold text-lg mb-3">
                Recents Sale Order
              </h2>
              <table className="w-full mb-6">
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
                  {orderList.length > 0 ? (
                    orderList.map((sal) => (
                      <tr key={sal._id}>
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
                          {sal.location && sal.location.name}
                        </td>
                        <td
                          className={`lg:px-4 py-2 text-center font-semibold ${
                            sal.state == "pending"
                              ? "text-red-400"
                              : sal.state == "deliver"
                              ? "text-cyan-700"
                              : sal.state == "confirmed"
                              ? "text-green-600"
                              : ""
                          }`}
                        >
                          {sal.state && sal.state}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <h2 className="text-center text-xl text-slate-600 font-semibold  h-32 w-full absolute mt-20">
                      No Currently Sale
                    </h2>
                  )}
                </tbody>
              </table>
            </div>
            <div className="items-center w-1/4 bg-white p-2 ml-4 rounded-md h-fix shadow-md">
              <h1 className="text-slate-600 font-semibold text-lg mb-6">
                Sale Products
              </h1>
              <div className="px-2 max-h-80 overflow-y-scroll custom-scrollbar mb-6">
                {todayPurchaseLine.length > 0 ? (
                  todayPurchaseLine.slice(0, 3).map((purchaseLines) => (
                    <div
                      key={purchaseLines._id}
                      className="w-full flex justify-between mb-3 border-b-2 pb-3"
                    >
                      <div className="flex flex-col">
                        <h4 className="text-md text-slate-700 font-bold">
                          {purchaseLines.product.name}
                        </h4>
                        <h4 className="font-bold text-green-700">
                          Stock in {getStockQuantity(purchaseLines.product._id)}
                        </h4>
                      </div>
                      <p className="text-slate-500 font-semibold">
                        {purchaseLines.product.salePrice} mmk
                      </p>
                    </div>
                  ))
                ) : (
                  <h2 className="text-center text-md text-slate-600 font-semibold h-32  mt-20">
                    No Currently sale product
                  </h2>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {purchase.length > 0 && (
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
