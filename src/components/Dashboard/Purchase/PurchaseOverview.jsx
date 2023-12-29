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
} from "recharts";

import { getApi } from "../../Api";
import { format } from "date-fns";
import FadeLoader from "react-spinners/FadeLoader";
import { useDispatch, useSelector } from "react-redux";
import { Icon } from "@iconify/react";
import { removeData } from "../../../redux/actions";

export default function PurchaseOverview() {
  const [purchase, setPurchase] = useState([]);
  const [product, setProduct] = useState([]);
  const [purchaseLines, setPurchaseLines] = useState([]);
  const [popularProductsData, setPopularProductsData] = useState([]);
  const [stock, setStock] = useState([]);

  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.IduniqueData);
  const dipatch = useDispatch();

  const getPurchase = async () => {
    setLoading(true);
    let resData = await getApi("/purchase", token.accessToken);
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
    let resData = await getApi("/purchaselines", token.accessToken);
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

  const getProduct = async () => {
    setLoading(true);
    let resData = await getApi("/product", token.accessToken);
    if (resData.status) {
      setLoading(false);
      setProduct(resData.data);
    } else {
      setLoading(true);
    }
  };

  const getTotal = async () => {
    setLoading(true);
    let resData = await getApi("/orders/totals", token.accessToken);
    if (resData.status) {
      setLoading(false);
      setProduct(resData.data);
    } else {
      setLoading(true);
    }
  };

  const todayDate = format(new Date(), "dd.MM.yyyy"); // Get today's date in the same format as orderDate

  const filteredPurchase = purchase.filter((pur) => {
    const formattedOrderDate = format(new Date(pur.orderDate), "dd.MM.yyyy");
    return formattedOrderDate === todayDate;
  });

    //To show barchart for only today date
    const todayPurchaseDate  = filteredPurchase.map((item) => ({
      ...item,
      created: format(new Date(item.createdAt), "yyyy-MM-dd"),
    }));

  const todayPurchaseLine = purchaseLines.filter(
    (purchase) =>
      format(new Date(purchase.orderDate), "dd.MM.yyyy") === todayDate
  );

  const getProductQuantity = () => {
    // Calculate the total quantity of products purchased
    const totalQuantity = filteredPurchase.reduce(
      (total, purchaseLine) => total + purchaseLine.lines.length,
      0
    );
    return totalQuantity;
  };

  const todayTotalPurchase = filteredPurchase.reduce(
    (total, sale) => total + sale.total,
    0
  );

  useEffect(() => {
    getStockApi();
    getProduct();
    getPurchase();
    getTotal();
    getPurhaseLines();
  }, []);

  const formattedSaleData = purchase.map((item) => ({
    ...item,
    created: format(new Date(item.createdAt), "yyyy-MM-dd"),
  }));

  const todayStock = stock.filter(
    (stk) => format(new Date(stk.updatedAt), "dd.MM.yyyy") === todayDate
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

  return (
    <>
      <div className="px-8 w-full bg-pink-50">
        <div className="w-full  flex justify-between">
          <div className="px-2 py-4 w-64 flex  items-center bg-white justify-evenly rounded-md shadow-md">
            <Icon
              icon="icon-park-solid:buy"
              className="text-4xl text-cyan-700 font-semibold"
            />

            <div className="">
              <h3 className="font-bold text-slate-600 text-xl">
                Total Purchase
              </h3>
              <h4 className="text-lg font-bold text-slate-600">
                {todayTotalPurchase} mmk
              </h4>
            </div>
          </div>
          <div className="px-2 py-4 w-64 flex  items-center bg-white justify-evenly rounded-md shadow-md">
            <Icon
              icon="icons8:buy"
              className="text-5xl text-blue-700 font-semibold"
            />

            <div className="">
              <h3 className="font-bold text-slate-600 text-xl">
                Today Purchases
              </h3>
              <h4 className="text-lg font-bold text-slate-600">
                {filteredPurchase.length}
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
                    filteredPurchase.map(
                      (sal) => sal.partner && sal.partner._id
                    )
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
                Product Purchased
              </h3>
              <h4 className="text-lg font-bold text-slate-600">
                {getProductQuantity()}
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
                width={700}
                height={400}
                data={todayPurchaseDate}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 60,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="created"
                  angle={-60} // Rotate the text by -90 degrees
                  textAnchor="end" // Anchor the text at the end (right)
                />
                <YAxis dataKey="total" />
                <Tooltip />
                <Bar dataKey="total" barSize={20} fill="#8884d8" />
              </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="items-center w-2/5 ml-4 bg-white p-2 rounded-md shadow-md">
              <h1 className="text-slate-500 font-semibold text-lg mb-6">
                Most of sale products
              </h1>
              <ResponsiveContainer  height={300} className="mx-auto">
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
                Recents Purchase Order
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
                  {filteredPurchase.length > 0 ? (
                    filteredPurchase.map((sal) => (
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
                          {sal.location && sal.location.name}
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
                          {sal.state && sal.state}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <h2 className="text-center text-xl text-slate-600 font-semibold  h-32 w-full absolute mt-20">
                      No Currently Purchase
                    </h2>
                  )}
                </tbody>
              </table>
            </div>
            <div className="items-center w-1/4 bg-white p-2 ml-4 rounded-md h-fix shadow-md">
              <h1 className="text-slate-600 font-semibold text-lg mb-6">
                Purchase Products
              </h1>
              <div className="px-2 max-h-80 overflow-y-scroll custom-scrollbar mb-6">
                {todayPurchaseLine.length > 0 ? (
                  todayPurchaseLine.slice(0,3).map((purchaseLines) => (
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
                    No Currently Purchase product
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
