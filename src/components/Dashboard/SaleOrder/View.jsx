import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
  Pie,
  PieChart,
} from "recharts";
import { getApi } from "../../Api";
import { format } from "date-fns";
import FadeLoader from "react-spinners/FadeLoader";
import { useSelector } from "react-redux";

export default function View() {
  const [sale, setSale] = useState([]);
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.IduniqueData);

  const getSaleOrder = async () => {
    setLoading(true);
    let resData = await getApi("/sale", token.accessToken);
    if (resData.status) {
      setLoading(false);
      setSale(resData.data);
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

  return (
    <>
      {sale.length > 0 ? (
        <div className="px-8 w-full">
          <div className="w-full  flex justify-between">
            <div className="p-4 w-64 bg-[#FFFFFF] rounded-md shadow-sm">
              <h3 className="font-bold text-slate-600 text-md">
                Today Expense
              </h3>
              <h4 className="text-2xl font-semibold text-slate-600 my-2">
                11500 mmk
              </h4>
            </div>
            <div className="p-4 w-64 bg-white rounded-md">
              <h3 className="font-bold text-slate-600 text-lg">
                Income Detail
              </h3>
              <h4 className="text-xl font-semibold text-slate-80 my-2">
                1150 mmk
              </h4>
            </div>
            <div className="p-4 w-64 bg-white rounded-md">
              <h3 className="font-bold text-slate-600 text-lg">
                Task Complete
              </h3>
              <h4 className="text-xl font-semibold text-slate-800 my-2">
                25000 mmk
              </h4>
            </div>
            <div className="p-4 w-64 bg-white rounded-md">
              <h3 className="font-bold text-slate-600 text-lg">
                Number of Sales
              </h3>
              <h4 className="text-xl font-semibold text-slate-800 my-2">
                10000 mmk
              </h4>
            </div>
          </div>

          <div className="mt-6">
            <div className="w-full flex my-4">
              <div className="w-3/4 bg-white p-2 rounded-md">
                <h3 className="text-slate-500 font-semibold text-lg mb-6">
                  Sale Order Dashboard
                </h3>
                <BarChart
                  width={900}
                  height={400}
                  data={formattedSaleData}
                  margin={{
                    top: 5,
                    right: 20,
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
              <div className="items-center w-1/4 ml-4 bg-white p-2 rounded-md">
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
                {/* <div className="flex justify-center bg-cyan-600 ml-8">
                  <PieChart width={300} height={500}>
                    <Pie
                      data={data}
                      cx={120}
                      cy={200}
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      className="mx-auto"
                    >
                      {data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </div> */}
              </div>
            </div>
            <div className="w-full flex">
              <div className="w-3/4 bg-white p-2 rounded-md shadow-md h-auto">
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
                            {sal.location && sal.location.name}
                          </td>
                          <td className="lg:px-4 py-2 text-center">
                            {sal.state && sal.state}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <div className="items-center w-1/4 bg-white p-2 ml-4 rounded-md h-auto shadow-md">
                <h1 className="text-slate-600 font-semibold text-lg mb-6">
                  Popular Products
                </h1>
                <div className="px-2">
                  {product.length > 0 &&
                    product.slice(0, 3).map((item) => (
                      <div
                        key={item._id}
                        className="w-full flex justify-between mb-3 border-b-2 pb-3"
                      >
                        <div className="flex flex-col">
                          <h4 className="text-md text-slate-700 font-bold">
                            {item.name}
                          </h4>
                          <h4 className="font-bold text-green-700">
                            Stock in 30
                          </h4>
                        </div>

                        {item.listPrice && (
                          <p className="text-slate-500 font-semibold">
                            {item.listPrice} mmk
                          </p>
                        )}
                      </div>
                    ))}
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
