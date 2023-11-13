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
  PieChart,
} from "recharts";
import { getApi } from "../../Api";
import { format } from "date-fns";
import FadeLoader from "react-spinners/FadeLoader";
import { useDispatch, useSelector } from "react-redux";
import { Icon } from "@iconify/react";

export default function View() {
  const [sale, setSale] = useState([]);
  const [product, setProduct] = useState([]);
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

  const data = [
    { name: "Group A", value: 400 },
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
    { name: "Group D", value: 200 },
  ];

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

  useEffect(() => {
    getProduct();
    getSaleOrder();
    getSaleLinesApi();
  }, []);

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

  // Sum up the "total" values of the filtered sale data
  const todayTotalSales = filteredSales.reduce(
    (total, sale) => total + sale.total,
    0
  );

  const calculateProductQuantity = () => {
    const productQuantityMap = {};

    // Iterate through the filtered sales data
    filteredSales.forEach((sale) => {
      // Iterate through the lines of each sale
      sale.lines.forEach((line) => {
        const productId = line.product && line.product._id;

        // Update the quantity for the product
        if (productId) {
          productQuantityMap[productId] =
            (productQuantityMap[productId] || 0) + line.qty;
        }
      });
    });

    return productQuantityMap;
  };

  const getTop5Products = () => {
    const productQuantityMap = calculateProductQuantity();

    // Convert the product quantity map to an array of objects
    const productQuantityArray = Object.entries(productQuantityMap).map(
      ([productId, quantity]) => ({
        productId,
        quantity,
      })
    );

    // Sort the array in descending order based on quantity
    const sortedProducts = productQuantityArray.sort(
      (a, b) => b.quantity - a.quantity
    );

    // Take the top 5 products
    const top5Products = sortedProducts.slice(0, 5);

    return top5Products;
  };

  return (
    <>
      {sale.length > 0 ? (
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
                <h3 className="font-bold text-slate-600 text-xl">
                  Today Orders
                </h3>

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
                <h3 className="font-bold text-slate-600 text-xl">
                  Today Profit
                </h3>
                <h4 className="text-lg font-bold text-slate-600">0 mmk</h4>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="w-full flex my-4">
              <div className="w-3/5 bg-white p-2 rounded-md shadow-md">
                <h3 className="text-slate-500 font-semibold text-lg mb-6">
                  Purchase Order Dashboard
                </h3>
                <BarChart
                  width={700}
                  height={400}
                  data={formattedSaleData}
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
              </div>
              <div className="items-center w-2/5 ml-4 bg-white p-2 rounded-md shadow-md">
                <h1 className="text-slate-500 font-semibold text-lg mb-6">
                  Most of sale products
                </h1>
                <ResponsiveContainer
                  width={300}
                  height={300}
                  className="mx-auto"
                >
                  <PieChart>
                    <Pie dataKey="value" data={data} fill="#8884d8" label />
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

                  <tbody className="w-full space-y-10">
                    {filteredSales.length > 0 &&
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
                            {sal.location
                              ? sal.location.name
                              : "store customer"}
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
                      ))}
                  </tbody>
                </table>
              </div>
              <div className="items-center w-1/4 bg-white px-2 py-4 ml-4 rounded-md h-auto shadow-md">
                <h1 className="text-slate-600 font-semibold text-lg mb-6">
                  Popular Products
                </h1>
                <div className="px-2">
                  {getTop5Products().map(({ id, qty }) => {
                    const product = product.find((item) => item._id === id);

                    return (
                      <div
                        key={qty}
                        className="w-full flex justify-between mb-3 border-b-2 pb-3"
                      >
                        <div className="flex flex-col">
                          <h4 className="text-md text-slate-700 font-bold">
                            {product.name}
                          </h4>
                          <h4 className="font-bold text-green-700">
                            Sold Quantity: {qty}
                          </h4>
                        </div>
                        {product.salePrice && (
                          <p className="text-slate-500 font-semibold">
                            {product.salePrice} mmk
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
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
