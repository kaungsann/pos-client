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
import { useSelector } from "react-redux";

export default function PurchaseView() {
  const [purchase, setPurchase] = useState([]);
  const [product, setProduct] = useState([]);

  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.IduniqueData);

  const getPurchase = async () => {
    setLoading(true);
    let resData = await getApi("/purchase", token.accessToken);
    if (resData.success) {
      setLoading(false);
      setPurchase(resData.data);
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

  const todayDate = format(new Date(), "dd.MM.yyyy"); // Get today's date in the same format as orderDate

  const filteredPurchase = purchase.filter((pur) => {
    const formattedOrderDate = format(new Date(pur.orderDate), "dd.MM.yyyy");
    return formattedOrderDate === todayDate;
  });

  useEffect(() => {
    getProduct();
    getPurchase();
  }, []);

  const formattedSaleData = purchase.map((item) => ({
    ...item,
    created: format(new Date(item.createdAt), "yyyy-MM-dd"),
  }));

  return (
    <>
      {purchase.length > 0 ? (
        <div className="px-8 w-full">
          <div className="w-full  flex justify-between">
            <div className="p-4 w-64 bg-[#FFFFFF] rounded-md shadow-md">
              <h3 className="font-bold text-slate-600 text-md">
                Today Expense
              </h3>
              <h4 className="text-2xl font-semibold text-slate-600 my-2">
                11500 mmk
              </h4>
            </div>
            <div className="p-4 w-64 bg-white rounded-md shadow-md">
              <h3 className="font-bold text-slate-600 text-lg">
                Income Detail
              </h3>
              <h4 className="text-xl font-semibold text-slate-80 my-2">
                1150 mmk
              </h4>
            </div>
            <div className="p-4 w-64 bg-white rounded-md shadow-md">
              <h3 className="font-bold text-slate-600 text-lg">
                Task Complete
              </h3>
              <h4 className="text-xl font-semibold text-slate-800 my-2">
                25000 mmk
              </h4>
            </div>
            <div className="p-4 w-64 bg-white rounded-md shadow-md">
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
              <div className="w-3/4 bg-white p-2 rounded-md">
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
                    {filteredPurchase.length > 0 &&
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
                          <td className="lg:px-4 py-2 text-center">
                            {sal.state && sal.state}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <div className="items-center w-1/4 bg-white p-2 ml-4 rounded-md h-fix">
                <h1 className="text-slate-600 font-semibold text-lg mb-6">
                  Popular Products
                </h1>
                <div className="px-2">
                  {[product].length > 0 &&
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
