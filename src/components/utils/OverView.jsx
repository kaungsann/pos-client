import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { format } from "date-fns";

import FadeLoader from "react-spinners/FadeLoader";
import { getApi } from "../Api";
import { useDispatch, useSelector } from "react-redux";
import { removeData } from "../../redux/actions";

export default function OverView() {
  const [sale, setSale] = useState([]);

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
      setSale(resData.data);
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
      setSale(resData.data);
    } else {
      setLoading(true);
    }
  };
  useEffect(() => {
    saleOrderApi();
    getProductApi();
  }, []);

  const data = [
    { name: "Group A", value: 400 },
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
    { name: "Group D", value: 200 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const today = new Date().toISOString().split("T")[0];
  const todaySaleOrders = sale.filter((order) => {
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

  const weeklySaleOrders = sale.filter((order) => {
    const orderDate = new Date(order.createdAt);
    return orderDate > oneWeekAgo;
  });

  const weeklyTotal = weeklySaleOrders.reduce(
    (total, order) => total + order.total,
    0
  );

  // Calculate monthly total
  const monthlyTotal = sale.reduce((total, order) => total + order.total, 0);

  const formattedSaleData = sale.map((item) => ({
    ...item,
    created: format(
      new Date(item.orderDate ? item.orderDate : item.createdAt),
      "dd-MMM-yyyy"
    ),
  }));

  return (
    <>
      <div className="flex">
        <div className="z-40 flex flex-col">
          <div className="p-4 bg-white shadow-md mr-4">
            <h3 className="text-slate-500 font-semibold text-lg mb-6">
              Monthly Sale
            </h3>
            {/* <BarChart
              width={800}
              height={400}
              data={sale}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 60,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="createdAt"
                tickFormatter={(value) => format(new Date(value), "dd.MM.yyyy")}
                angle={-60}
                textAnchor="end"
              />
              <YAxis dataKey="total" />
              <Tooltip />

              <Bar dataKey="total" fill="#8884d8" />
            </BarChart> */}

            <LineChart
              width={800}
              height={400}
              data={formattedSaleData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="created" height={60} />
              <YAxis dataKey="total" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="#8884d8" />
            </LineChart>
          </div>

          <div className="p-4 bg-white shadow-md mr-4">
            <h3 className="text-slate-500 font-semibold text-lg mb-6">
              Monthly Sale
            </h3>
            <BarChart
              width={800}
              height={400}
              data={sale}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 60,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="createdAt"
                tickFormatter={(value) => format(new Date(value), "dd.MM.yyyy")}
                angle={-60}
                textAnchor="end"
              />
              <YAxis dataKey="total" />
              <Tooltip />

              <Bar dataKey="total" fill="#8884d8" />
            </BarChart>
          </div>
        </div>
        <div className="w-full bg-white p-4 shadow-md">
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
            <div className="flex justify-center w-2/4relative">
              <PieChart width={250} height={400}>
                <Pie
                  data={data}
                  cx={120}
                  cy={200}
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
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
