import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
} from "recharts";
import { format } from "date-fns";
import FadeLoader from "react-spinners/FadeLoader";
import { getApi } from "../Api";
import { useDispatch, useSelector } from "react-redux";

export default function OverView() {
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState([]);
  const token = useSelector((state) => state.IduniqueData);
  const dipatch = useDispatch();

  const saleOrderApi = async () => {
    setLoading(true);
    const resData = await getApi("/sale", token.accessToken);
    if (resData.message == "Token Expire , Please Login Again") {
      dipatch(removeData(null));
    }
    if (resData.status) {
      setLoading(false);
      setData(resData.data);
    } else {
      setLoading(true);
    }
  };

  const getProductApi = async () => {
    setLoading(true);
    let resData = await getApi("/product", token.accessToken);
    if (resData.message == "Token Expire , Please Login Again") {
      dipatch(removeData(null));
    }
    setProduct(resData.data);
    if (resData.status) {
      setLoading(false);
      setData(resData.data);
    } else {
      setLoading(true);
    }
  };
  useEffect(() => {
    saleOrderApi();
    getProductApi();
  }, []);

  // const formattedSaleData = data.map((item) => ({
  //   ...item,
  //   created: format(new Date(item.orderDate), "yyyy-MM-dd"),
  // }));

  const today = new Date().toISOString().split("T")[0];
  const todaySaleOrders = data.filter((order) => {
    const orderDate = order.createdAt.split("T")[0];
    return orderDate === today;
  });
  // Calculate today total
  const todaySaleTotal = todaySaleOrders.reduce(
    (total, order) => total + order.total,
    0
  );

  // Calculate weekly total (similar to the calculation for todaySaleTotal and monthlyTotal)
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const weeklySaleOrders = data.filter((order) => {
    const orderDate = new Date(order.createdAt);
    return orderDate > oneWeekAgo;
  });

  const weeklyTotal = weeklySaleOrders.reduce(
    (total, order) => total + order.total,
    0
  );

  // Calculate monthly total
  const monthlyTotal = data.reduce((total, order) => total + order.total, 0);

  return (
    <>
      {data.length > 0 ? (
        <div className="flex">
          <div className="z-40 flex flex-col">
            <div className="p-4 bg-slate-50 mr-4">
              <h3 className="text-slate-500 font-semibold text-lg mb-6">
                Monthly Sale
              </h3>
              <BarChart
                width={800}
                height={400}
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="createdAt" />
                <YAxis dataKey="total" />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#8884d8" />
              </BarChart>
            </div>

            <div style={{ width: 800, height: 400 }} className="mt-8 ml-4">
              <h3 className="text-slate-500 font-semibold text-lg mb-6">
                Monthly Profit
              </h3>
              <ResponsiveContainer>
                <AreaChart
                  data={data}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="orderDate" tick={{ fill: "red" }} />
                  <YAxis dataKey="total" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#8884d8"
                    fill="#8884d8"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="w-full">
            <div className="flex w-full justify-between h-24">
              <div className="bg-[#8884d8] w-1/2 flex flex-col justify-center rounded-md">
                <h3 className="text-3xl text-white font-bold text-center">7</h3>
                <h4 className="text-center text-white text-md font-bold">
                  Out Of Stock Products
                </h4>
              </div>
              <div className="bg-[#8884d8] w-1/2 ml-4 flex flex-col justify-center rounded-md">
                <h3 className="text-3xl text-white font-bold text-center">8</h3>
                <h4 className="text-center text-white text-md font-bold">
                  No Of Customers
                </h4>
              </div>
            </div>
            <div className="bg-blue-50 py-3 rounded-md mt-3 shadow-sm">
              <h2 className="text-3xl text-green-600 font-bold text-center">
                {monthlyTotal ? monthlyTotal.toFixed(2) : "0"}
              </h2>
              <h5 className="mt-1.5 text-center text-sm font-semibold text-slate-500">
                This Month Sale
              </h5>
            </div>
            <div className="bg-blue-50 py-3 rounded-md mt-3 shadow-sm">
              <h2 className="text-3xl text-orange-500 font-bold text-center">
                {weeklyTotal ? weeklyTotal.toFixed(2) : "0"}
              </h2>
              <h5 className="mt-1.5 text-center text-sm font-semibold text-slate-500">
                This Weekend Sale
              </h5>
            </div>
            <div className="bg-blue-50 py-3 rounded-md mt-3 shadow-sm">
              <h2 className="text-3xl text-[#3b82f6] font-bold text-center">
                {todaySaleTotal.toFixed(2)}
              </h2>
              <h5 className="mt-1.5 text-center text-sm font-semibold text-slate-500">
                Today Sale
              </h5>
            </div>
            <div className="mt-20 flex flex-col justify-center ">
              <h3 className="mt-4 font-bold text-center text-xl">
                Most Of Sales Products
              </h3>

              <PieChart width={400} height={300} className="mt-20 mx-auto">
                <Pie
                  data={data}
                  dataKey="total"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                />
                <Pie
                  data={data}
                  dataKey="total"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  fill="#82ca9d"
                  label
                />
              </PieChart>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center mt-64">
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
