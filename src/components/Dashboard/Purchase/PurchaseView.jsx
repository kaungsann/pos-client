import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { getApi } from "../../Api";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { Icon } from "@iconify/react";

export default function PurchaseView() {
  const [totalAmount, setTotalAmount] = useState(0);
  // const [totalAmountWithTax, setTotalAmountWithTax] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [orderLines, setOrderLines] = useState([]);
  const [totalQty, setTotalQty] = useState(0);
  // const [popularProducts, setPopularProducts] = useState([]);

  const token = useSelector((state) => state.IduniqueData);

  const todayDate = format(new Date(), "MM-dd-yyyy"); // Get today's date in the same format as orderDate

  const getTotals = async () => {
    let resData = await getApi(
      `/orders/totals?startDate=${todayDate.toString()}`,
      token.accessToken
    );

    if (resData.status) {
      setTotalAmount(resData.data.purchases.totalAmount);
      setTotalOrders(resData.data.purchases.totalOrders);
      // setTotalAmountWithTax(resData.data.purchases.totalAmountWithTax);
      setTotalItems(resData.data.purchases.totalItems);
      setOrderLines(resData.data.purchases.allLines);
      setTotalQty(resData.data.purchases.totalQty);
      //setPopularProducts(resData.data.purchases.topProducts);
    }
  };

  useEffect(() => {
    getTotals();
  }, []);

  const orderList = Array.from(
    new Set(orderLines.map((line) => line.orderId._id))
  ).map(
    (orderId) => orderLines.find((line) => line.orderId._id === orderId).orderId
  );

  function calculateTotalCostByProduct() {
    const groupedCostByProduct = orderLines.reduce(
      (accumulator, currentValue) => {
        const { product, subTotal } = currentValue;
        const productName = product.name;

        if (!accumulator[productName]) {
          accumulator[productName] = 0;
        }

        accumulator[productName] += subTotal;

        return accumulator;
      },
      {}
    );

    const totalCostbyProduct = Object.keys(groupedCostByProduct).map(
      (productName) => ({
        name: productName,
        total: groupedCostByProduct[productName],
      })
    );

    return totalCostbyProduct;
  }

  function calculateTotalCostByVendor() {
    const groupedCostByVendor = orderLines.reduce(
      (accumulator, currentValue) => {
        const { orderId, subTotal } = currentValue;
        const vendorName = orderId.partner.name;

        if (!accumulator[vendorName]) {
          accumulator[vendorName] = 0;
        }

        accumulator[vendorName] += subTotal;

        return accumulator;
      },
      {}
    );

    const totalCostbyProduct = Object.keys(groupedCostByVendor).map(
      (vendorName) => ({
        name: vendorName,
        total: groupedCostByVendor[vendorName],
      })
    );

    return totalCostbyProduct;
  }

  function calculateTotalQtyByProduct() {
    const groupedQtyByProduct = orderLines.reduce(
      (accumulator, currentValue) => {
        const { product, qty } = currentValue;
        const productName = product.name;

        if (!accumulator[productName]) {
          accumulator[productName] = 0;
        }

        accumulator[productName] += qty;

        return accumulator;
      },
      {}
    );

    const totalCostbyProduct = Object.keys(groupedQtyByProduct).map(
      (productName) => ({
        name: productName,
        qty: groupedQtyByProduct[productName],
      })
    );

    return totalCostbyProduct;
  }

  function calculateTotalQtyByVendor() {
    const groupedQtyByVendor = orderLines.reduce(
      (accumulator, currentValue) => {
        const { orderId, qty } = currentValue;
        const vendorName = orderId.partner.name;

        if (!accumulator[vendorName]) {
          accumulator[vendorName] = 0;
        }

        accumulator[vendorName] += qty;

        return accumulator;
      },
      {}
    );

    const totalCostbyProduct = Object.keys(groupedQtyByVendor).map(
      (vendorName) => ({
        name: vendorName,
        qty: groupedQtyByVendor[vendorName],
      })
    );

    return totalCostbyProduct;
  }

  const totalCostbyProduct = calculateTotalCostByProduct();
  const totalCostbyVendor = calculateTotalCostByVendor();
  const totalQtybyProduct = calculateTotalQtyByProduct();
  const totalQtybyVendor = calculateTotalQtyByVendor();

  // const lineChartData = orderLines.map((line) => {
  //   return {
  //     id: line._id,
  //     orderRef: line.orderId.orderRef,
  //     productId: line.product.name,
  //     total: line.subTotal,
  //   };
  // });

  return (
    <>
      <div className="px-8 w-full">
        <h1 className="text-xl font-bold text-slate-600 py-5">
          Daily Dashboard
        </h1>
        <div className="w-full flex justify-between">
          <div className="px-2 md:py-2 mr-2 lg:py-3 xl:py-4 sm:w-52 md:w-56 lg:w-60 xl:w-64 2xl:w-w-72 flex  items-center bg-white justify-evenly rounded-md shadow-md">
            <Icon
              icon="icon-park-solid:buy"
              className="sm:text-lg md:text-2xl lg:text-3xl xl:text-4xl text-cyan-700 font-semibold"
            />

            <div>
              <h3 className="font-bold text-slate-600  md:text-sm lg:text-md xl:text-lg 2xl:text-xl">
                Total Cost
              </h3>
              <h4 className="text-lg xl:text:xl font-bold text-slate-600">
                {totalAmount}
              </h4>
            </div>
          </div>

          {/* <div className="px-2 py-4 w-64 flex items-center bg-white justify-evenly rounded-md shadow-md">
            <Icon
              icon="icon-park-solid:buy"
              className="text-4xl text-cyan-700 font-semibold"
            />
            <div>
              <h3 className="font-bold text-slate-600 text-lg">Tax Total</h3>
              <h4 className="text-lg font-bold text-slate-600">
                {totalAmountWithTax - totalAmount}
              </h4>
            </div>
          </div> */}

          <div className="px-2 md:py-2 lg:py-3 xl:py-4 sm:w-52 md:w-56 lg:w-60 xl:w-64 2xl:w-w-72 flex  items-center bg-white justify-evenly rounded-md shadow-md">
            <Icon
              icon="icons8:buy"
              className="sm:text-lg md:text-2xl lg:text-3xl xl:text-5xl text-blue-700 font-semibold"
            />

            <div className="mx-2">
              <h3 className="font-bold text-slate-600 md:text-sm lg:text-md xl:text-lg 2xl:text-xl">
                Total Orders
              </h3>
              <h4 className="text-lg xl:text:xl font-bold text-slate-600">
                {totalOrders}
              </h4>
            </div>
          </div>

          <div className="px-2 mx-2 md:py-2 lg:py-3 xl:py-4 sm:w-52 md:w-56 lg:w-60 xl:w-64 2xl:w-w-72 flex  items-center bg-white justify-evenly rounded-md shadow-md">
            <Icon
              icon="fa:users"
              className="sm:text-lg md:text-2xl lg:text-3xl xl:text-4xl text-[#8884d8]"
            />
            <div>
              <h3 className="font-bold text-slate-600 md:text-sm lg:text-md xl:text-lg 2xl:text-xl">
                Total Vendors
              </h3>
              <h4 className="text-lg xl:text:xl font-bold text-slate-600">
                {
                  new Set(
                    orderList.map((line) => line.partner && line.partner._id)
                  ).size
                }
              </h4>
            </div>
          </div>

          <div className="px-2 md:py-2 lg:py-3 xl:py-4 sm:w-52 md:w-56 lg:w-60 xl:w-64 2xl:w-w-72 flex items-center bg-white justify-evenly rounded-md shadow-md">
            <Icon
              icon="fluent-mdl2:product-variant"
              className="sm:text-lg md:text-2xl lg:text-3xl xl:text-4xl text-green-500"
            />
            <div>
              <h3 className="font-bold text-slate-600 md:text-sm lg:text-md xl:text-lg 2xl:text-xl">
                Total Products
              </h3>
              <h4 className="text-lg xl:text:xl font-bold text-slate-600">
                {totalItems}
              </h4>
            </div>
          </div>

          <div className="px-2 ml-2 md:py-2 lg:py-3 xl:py-4 sm:w-52 md:w-56 lg:w-60 xl:w-64 2xl:w-w-72 flex items-center bg-white justify-evenly rounded-md shadow-md">
            <Icon
              icon="fluent-mdl2:product-variant"
              className="sm:text-lg md:text-2xl lg:text-3xl xl:text-4xl text-green-500"
            />
            <div>
              <h3 className="font-bold text-slate-600 text-lg">
                Total Quantity
              </h3>
              <h4 className="text-lg xl:text:xl font-bold text-slate-600">
                {totalQty}
              </h4>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <div className="w-full flex my-4">
            <div className="w-3/5 bg-white p-2 rounded-md shadow-md">
              <h3 className="text-slate-500 font-semibold text-lg mb-6">
                Total Cost by Product
              </h3>
              <ResponsiveContainer height={300} className="mx-auto">
                <BarChart
                  width={500}
                  height={300}
                  data={totalCostbyProduct}
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

                  <Bar dataKey="total" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="w-2/5 ml-4 bg-white p-2 rounded-md shadow-md">
              <h3 className="text-slate-500 font-semibold text-lg mb-6">
                Total Cost by Vendor
              </h3>
              <ResponsiveContainer height={300} className="mx-auto">
                <BarChart
                  width={500}
                  height={300}
                  data={totalCostbyVendor}
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

                  <Bar dataKey="total" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* <div className="items-center w-2/5 ml-4 bg-white p-2 rounded-md shadow-md">
              <h1 className="text-slate-500 font-semibold text-lg mb-6">
                All Time Purchased Product
              </h1>
              <ResponsiveContainer height={300} className="mx-auto">
                <PieChart width={400} height={400}>
                  <Pie
                    data={popularProducts}
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
                          {popularProducts[index].product}
                        </text>
                      );
                    }}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {popularProducts.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div> */}
          </div>
          <div className="w-full flex my-4">
            <div className="w-3/5 bg-white p-2 rounded-md shadow-md">
              <h3 className="text-slate-500 font-semibold text-lg mb-6">
                Total Qty by Product
              </h3>
              <ResponsiveContainer height={200} className="mx-auto">
                <BarChart
                  width={500}
                  height={200}
                  data={totalQtybyProduct}
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
                  <Bar dataKey="qty" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="w-2/5 ml-4 bg-white p-2 rounded-md shadow-md">
              <h3 className="text-slate-500 font-semibold text-lg mb-6">
                Total Qty by Vendor
              </h3>
              <ResponsiveContainer height={200} className="mx-auto">
                <BarChart
                  width={500}
                  height={200}
                  data={totalQtybyVendor}
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
                  <Bar dataKey="qty" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="w-full flex">
            <div className="w-3/4 bg-white p-2 rounded-md shadow-md">
              <h2 className="text-slate-600 font-semibold text-lg mb-3">
                Recent Purchased Orders
              </h2>
              <table className="w-full mb-6">
                <tr className="bg-[#e2e8f0]">
                  <th className="lg:px-4 py-2 text-center text-slate-500">
                    Customer Name
                  </th>
                  <th className="lg:px-4 py-2 text-center text-slate-500">
                    Order Date
                  </th>
                  <th className="lg:px-4 py-2 text-center text-slate-500">
                    Total Cost
                  </th>
                  <th className="lg:px-4 py-2 text-center text-slate-500">
                    Address
                  </th>
                  <th className="lg:px-4 py-2 text-center text-slate-500">
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
                        <td className="lg:px-4 py-2 text-center ">
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
                      No Currently Purchase
                    </h2>
                  )}
                </tbody>
              </table>
            </div>
            <div className="items-center w-1/4 bg-white p-2 ml-4 rounded-md h-fix shadow-md">
              <h1 className="text-slate-600 font-semibold text-lg mb-6">
                Recent Purchased Products
              </h1>
              <div className="px-2 max-h-80 overflow-y-scroll custom-scrollbar mb-6">
                {orderLines.length > 0 ? (
                  orderLines.slice(0, 5).map((line) => (
                    <div
                      key={line._id}
                      className="w-full flex justify-between mb-3 border-b-2 pb-2"
                    >
                      <div className="flex flex-col">
                        <h4 className="text-md text-slate-700">
                          {line.product.name}
                        </h4>
                      </div>
                      <p className="text-slate-500">
                        <span className="text-red-800">{line.qty} </span>x{" "}
                        {line.unitPrice}
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
    </>
  );
}
