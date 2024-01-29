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
import { useDispatch, useSelector } from "react-redux";
import { Icon } from "@iconify/react";
import { removeData } from "../../../redux/actions";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
} from "@nextui-org/react";

export default function SaleView() {
  const [stock, setStock] = useState([]);
  // const [totalAmount, setTotalAmount] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [totalGrossSale, setTotalGrossSale] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [totalTax, setTotalTax] = useState(0);
  const [totalGrossProfit, setTotalGrossProfit] = useState(0);
  // const [totalPerDay, setTotalPerDay] = useState([]);
  const [orderLines, setOrderLines] = useState([]);
  // const [popularProducts, setPopularProducts] = useState([]);

  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.IduniqueData);
  const dipatch = useDispatch();

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

  const todayDate = format(new Date(), "MM-dd-yyyy"); // Get today's date in the same format as orderDate

  const todaySaleLine = orderLines.filter(
    (sale) => format(new Date(sale.orderDate), "MM-dd-yyyy") === todayDate
  );

  const getTotals = async () => {
    setLoading(true);
    let resData = await getApi(
      `/orders/totals?startDate=${todayDate.toString()}`,
      token.accessToken
    );

    console.log("total res data is a", resData.data);
    if (resData.status) {
      //setTotalAmount(resData.data.sales.totalAmount);
      setTotalGrossSale(resData.data.sales.totalGrossSale);
      setTotalTax(resData.data.sales.totalTax);
      setTotalDiscount(resData.data.sales.totalDiscount);
      setTotalOrders(resData.data.sales.totalOrders);
      setTotalGrossProfit(resData.data.sales.totalGrossProfit);
      //setTotalPerDay(resData.data.sales.totalsAmountPerDay);
      setTotalItems(resData.data.sales.totalItems);
      setOrderLines(resData.data.sales.allLines);
      //setPopularProducts(resData.data.sales.topProducts);
      setLoading(false);
    } else {
      setLoading(true);
    }
  };

  useEffect(() => {
    getStockApi();
    getTotals();
  }, []);

  const currentStock = stock.filter(
    (stk) => format(new Date(stk.updatedAt), "MM-dd-yyyy") === todayDate
  );

  const orderList =
    orderLines && orderLines.length > 0
      ? Array.from(new Set(orderLines.map((line) => line.orderId?._id))).map(
          (orderId) =>
            orderLines.find((line) => line.orderId?._id === orderId)?.orderId
        )
      : [];

  function calculatetotalNetSalebyProduct() {
    const groupedNSaleByProduct = orderLines.reduce(
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

    const totalNetSalebyProduct = Object.keys(groupedNSaleByProduct).map(
      (productName) => ({
        name: productName,
        total: groupedNSaleByProduct[productName],
      })
    );

    return totalNetSalebyProduct;
  }

  function calculatetotalNetSalebyVendor() {
    const groupedNSaleByVendor = orderLines.reduce(
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

    const totalNetSalebyProduct = Object.keys(groupedNSaleByVendor).map(
      (vendorName) => ({
        name: vendorName,
        total: groupedNSaleByVendor[vendorName],
      })
    );

    return totalNetSalebyProduct;
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

    const totalNetSalebyProduct = Object.keys(groupedQtyByProduct).map(
      (productName) => ({
        name: productName,
        qty: groupedQtyByProduct[productName],
      })
    );

    return totalNetSalebyProduct;
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

    const totalNetSalebyProduct = Object.keys(groupedQtyByVendor).map(
      (vendorName) => ({
        name: vendorName,
        qty: groupedQtyByVendor[vendorName],
      })
    );

    return totalNetSalebyProduct;
  }

  const totalNetSalebyProduct = calculatetotalNetSalebyProduct();
  const totalNetSalebyVendor = calculatetotalNetSalebyVendor();
  const totalQtybyProduct = calculateTotalQtyByProduct();
  const totalQtybyVendor = calculateTotalQtyByVendor();

  const getStockQuantity = (productId) => {
    const currentStockEntry = currentStock.find(
      (stockItem) => stockItem.product._id === productId
    );
    return currentStockEntry ? currentStockEntry.onHand : 0;
  };

  return (
    <>
      <div className="px-8 w-full">
        <h1 className="text-xl font-bold text-slate-600 py-5">
          Daily Dashboard
        </h1>
        <div className="w-full flex justify-between">
          <div className="px-3 mr-1.5 w-60 h-20 flex items-center bg-white justify-evenly rounded-md shadow-md">
            <Icon
              icon="solar:money-bag-bold-duotone"
              color="#3d417a"
              className="text-3xl text-cyan-700 font-semibold"
            />
            <div className="ml-2">
              <div className="flex items-center">
                <h3 className="font-bold text-slate-600 text-md">
                  Gross Sales
                </h3>
                <Popover placement="top">
                  <Popover placement="top" offset={20} showArrow>
                    <PopoverTrigger>
                      <Icon icon="lucide:info" className="text-sm ml-0.5" />
                    </PopoverTrigger>
                    <PopoverContent className="rounded-md">
                      <div className="px-1 py-2">
                        <div className="text-tiny">
                          This is the popover content
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </Popover>
              </div>

              <h4 className="text-md font-bold text-slate-600 text-center">
                {totalGrossSale}
              </h4>
            </div>
          </div>
          <div className="px-3 mr-1.5 w-52 h-20 flex items-center bg-white justify-evenly rounded-md shadow-md">
            <Icon
              icon="mdi:ticket-percent-outline"
              color="#75273c"
              className="text-3xl text-cyan-700 font-semibold"
            />
            <div>
              <h3 className="font-bold text-slate-600 text-md">Tax Total</h3>
              <h4 className="text-md font-bold text-slate-600 text-center">
                {totalTax}
              </h4>
            </div>
          </div>
          <div className="px-3 mr-1.5 w-52 h-20 flex items-center bg-white justify-evenly rounded-md shadow-md">
            <Icon
              icon="ic:twotone-discount"
              color="#3b6664"
              className="text-2xl text-blue-700 font-semibold"
            />
            <div className="">
              <h3 className="font-bold text-slate-600 text-md">Discounts</h3>
              <h4 className="text-md font-bold text-slate-600 text-center">
                {totalDiscount}
              </h4>
            </div>
          </div>
          <div className="px-3 mr-1.5 w-56 h-20 flex items-center bg-white justify-evenly rounded-md shadow-md">
            <Icon
              icon="icons8:buy"
              className="text-3xl text-blue-700 font-semibold"
            />

            <div className="ml-1.5">
              <div className="flex items-center">
                <h3 className="font-bold text-slate-600 text-md">Net Sales</h3>
                <Popover placement="top">
                  <Popover placement="top" offset={20} showArrow>
                    <PopoverTrigger>
                      <Icon icon="lucide:info" className="text-sm ml-0.5" />
                    </PopoverTrigger>
                    <PopoverContent className="rounded-md">
                      <div className="px-1 py-2">
                        <div className="text-tiny">
                          This is the net sale content
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </Popover>
              </div>

              <h4 className="text-md font-bold text-slate-600 text-center">
                {totalGrossSale - totalDiscount}
              </h4>
            </div>
          </div>
          <div className="px-3 mr-1.5 w-60 h-20 flex items-center bg-white justify-evenly rounded-md shadow-md">
            <Icon
              icon="fluent-emoji-high-contrast:money-bag"
              color="#8a882b"
              className="text-3xl text-blue-700 font-semibold"
            />

            <div className="ml-1.5">
              <div className="flex items-center">
                <h3 className="font-bold text-slate-600 text-md">
                  Gross Profit
                </h3>
                <Popover placement="top">
                  <Popover placement="top" offset={20} showArrow>
                    <PopoverTrigger>
                      <Icon icon="lucide:info" className="text-sm ml-0.5" />
                    </PopoverTrigger>
                    <PopoverContent className="rounded-md">
                      <div className="px-1 py-2">
                        <div className="text-tiny">
                          This is theGross Profite content
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </Popover>
              </div>

              <h4 className="text-md font-bold text-slate-600 text-center">
                {totalGrossProfit}
              </h4>
            </div>
          </div>
          <div className="px-3 mr-1.5 w-52 h-20 flex items-center bg-white justify-evenly rounded-md shadow-md">
            <Icon
              icon="icons8:buy"
              className="text-3xl text-blue-700 font-semibold"
            />

            <div className="">
              <h3 className="font-bold text-slate-600 text-md">Total Orders</h3>
              <h4 className="text-md font-bold text-slate-600 text-center">
                {totalOrders}
              </h4>
            </div>
          </div>

          <div className="px-3 mr-1.5 w-52 h-20 flex items-center bg-white justify-evenly rounded-md shadow-md">
            <Icon icon="fa:users" className="text-2xl text-[#8884d8]" />
            <div>
              <h3 className="font-bold text-slate-600 text-md">Customers</h3>
              <h4 className="text-md font-bold text-slate-600 text-center">
                {
                  new Set(
                    orderList.map((line) => line.partner && line.partner._id)
                  ).size
                }
              </h4>
            </div>
          </div>

          <div className="px-3 mr-1.5 w-52 h-20 flex items-center bg-white justify-evenly rounded-md shadow-md">
            <Icon
              icon="fluent-mdl2:product-variant"
              className="text-2xl text-green-500"
            />

            <div>
              <h3 className="font-bold text-slate-600 text-md">Items Sold</h3>
              <h4 className="text-md font-bold text-slate-600 text-center">
                {totalItems}
              </h4>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <div className="w-full flex my-4">
            <div className="w-3/5 bg-white p-2 rounded-md shadow-md">
              <h3 className="text-slate-500 font-semibold text-lg mb-6">
                Net Sales by Product
              </h3>
              <ResponsiveContainer height={300} className="mx-auto">
                <BarChart
                  width={500}
                  height={300}
                  data={totalNetSalebyProduct}
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
                Net Sales by Customer
              </h3>
              <ResponsiveContainer height={300} className="mx-auto">
                <BarChart
                  width={500}
                  height={300}
                  data={totalNetSalebyVendor}
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
                Recent Sale Orders
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
                    Total (Inc. Tax)
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
                    orderList.map((sal) =>
                      sal ? (
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
                      ) : null
                    )
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
                Recent Sale Products
              </h1>
              <div className="px-2 max-h-80 overflow-y-scroll custom-scrollbar mb-6">
                {todaySaleLine.length > 0 ? (
                  todaySaleLine.slice(0, 3).map((sale) => (
                    <div
                      key={sale._id}
                      className="w-full flex justify-between mb-3 border-b-2 pb-3"
                    >
                      <div className="flex flex-col">
                        <h4 className="text-md text-slate-700 font-bold">
                          {sale.product.name}
                        </h4>
                        <h4 className="font-bold text-green-700">
                          Stock in {getStockQuantity(sale.product._id)}
                        </h4>
                      </div>
                      <p className="text-slate-500 font-semibold">
                        {sale.product.salePrice} mmk
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
      {loading && (
        <div className="w-10/12 mx-auto flex justify-center items-center">
          {loading && <Spinner size="lg" />}
        </div>
      )}
    </>
  );
}
