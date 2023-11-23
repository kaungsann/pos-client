import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Bar
} from "recharts";
import { format } from "date-fns";

import FadeLoader from "react-spinners/FadeLoader";
import { getApi } from "../Api";
import { useDispatch, useSelector } from "react-redux";
import { removeData } from "../../redux/actions";
import { Icon } from '@iconify/react';


export default function OverView() {
  const [sale, setSale] = useState([]);
  const [purchase, setPurchase] = useState([]);

  const [loading, setLoading] = useState(false);

  const token = useSelector((state) => state.IduniqueData);
  const dipatch = useDispatch();

  const saleOrderApi = async () => {
    setLoading(true);
    const resData = await getApi("/purchase", token.accessToken);
    if (resData.message == "Token Expire , Please Login Again") {
      dipatch(removeData(null));
    }

    if (resData.success) {
      setLoading(false);
      setSale(resData.data);
    } else {
      setLoading(true);
    }
  };

  const purchaseOrderApi = async () => {
    setLoading(true);
    const resData = await getApi("/purchase", token.accessToken);
    if (resData.message == "Token Expire , Please Login Again") {
      dipatch(removeData(null));
    }
    if (resData.status) {
      setLoading(false);
      setPurchase(resData.data);
    } else {
      setLoading(true);
    }
  };

  const formattedSaleData = sale.map((item) => ({
    ...item,
    created: format(
      new Date(item.orderDate ? item.orderDate : item.createdAt),
      "dd-MMM-yyyy"
    ),
  }));

  const formattedPurchaseData = purchase.map((item) => ({
    ...item,
    created: format(
      new Date(item.orderDate ? item.orderDate : item.createdAt),
      "dd-MMM-yyyy"
    ),
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const today = new Date().toISOString().split("T")[0];

  const todaySaleOrders = sale.filter((order) => {
    const orderDate = order.createdAt.split("T")[0];
    return orderDate === today;
  });

  const data = [
    { name: "A", value: 80, color: "#ff0000" },
    { name: "B", value: 45, color: "#00ff00" },
    { name: "C", value: 25, color: "#0000ff" },
  ];
  const cx = 150;
  const cy = 200;
  const iR = 50;
  const oR = 100;
  const value = 50;

  const needle = (value, data, cx, cy, iR, oR, color) => {
    let total = 0;
    data.forEach((v) => {
      total += v.value;
    });
  };

  // Calculate today total

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

  const purchaseMonthlyTotal = purchase.reduce(
    (total, order) => total + order.total,
    0
  );

  const weeklyPurchaseOrders = purchase.filter((order) => {
    const orderDate = new Date(order.createdAt);
    return orderDate > oneWeekAgo;
  });

  const weeklyPurchaseTotal = weeklyPurchaseOrders.reduce(
    (total, order) => total + order.total,
    0
  );
  const data1 = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  useEffect(() => {
    saleOrderApi();
    purchaseOrderApi();
  }, []);

  return (
    <>
      <div>
        <div className="flex">

          {/* Sale Order  */}
          <div className="w-2/5	bg-white p-4 border-2 rounded-lg shadow-md">
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold text-slate-700">
                Sales Overview
              </h3>
              <div>
                 <Icon icon="icon-park-outline:filter" className="text-[#8b5cf6] font-extrabold text-xl"/>
              </div>
            </div>
            {/* Annula Sales */}
            <div className=" my-3 px-4 flex">
              <div className="flex items-center w-2/4	">
                <div className="p-4 bg-blue-200 rounded-md">
                   <Icon icon="solar:cart-4-outline" className="text-4xl text-cyan-600 font-extrabold"/>
                </div>
                <div className="mx-3 w-2/4">
                  <h2 className="text-slate-400 text-md font-semibold">
                    Annual Sales
                  </h2>
                  <h2 className="text-slate-800 text-xl font-extrabold">
                    $ 124,56
                  </h2>
                </div>
              </div>
              <div className="flex items-center w-2/4	">
                 <div className="p-4 bg-yellow-100 rounded-md">
                   <Icon icon="uil:file-graph" className="text-4xl text-yellow-600 font-extrabold"/>
                 </div>
                <div className="px-3">
                  <h2 className="text-slate-400 text-md font-semibold">
                    Annual Profits
                  </h2>
                  <h2 className="text-slate-800 text-xl font-extrabold">
                    $ 124,56
                  </h2>
                </div>
              </div>
            </div>
            {/* Monthly Sales */}
            <div className=" my-3 px-4 flex">
              <div className="flex items-center w-2/4	">
                <div className="p-4 bg-orange-200 rounded-md">
                   <Icon icon="solar:cart-4-outline" className="text-4xl text-orange-600 font-extrabold"/>
                </div>
                <div className="mx-3 w-2/4">
                  <h2 className="text-slate-400 text-md font-semibold">
                  Monthly Sales
                  </h2>
                  <h2 className="text-slate-800 text-xl font-extrabold">
                    $ 124,56
                  </h2>
                </div>
              </div>
              <div className="flex items-center w-2/4	">
                 <div className="p-4 bg-green-100 rounded-md">
                   <Icon icon="uil:file-graph" className="text-4xl text-green-600 font-extrabold"/>
                 </div>
                <div className="px-3">
                  <h2 className="text-slate-400 text-md font-semibold">
                  Monthly Profits
                  </h2>
                  <h2 className="text-slate-800 text-xl font-extrabold">
                    $ 124,56
                  </h2>
                </div>
              </div>
            </div>
          </div>

          {/* Purchase Order */}
          <div className="w-2/5	bg-white p-4 border-2 rounded-lg mx-3 shadow-md">
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold text-slate-700">
                Purchases Overview
              </h3>
              <div>
                 <Icon icon="icon-park-outline:filter" className="text-[#8b5cf6] font-extrabold text-xl"/>
              </div>
            </div>
            {/* Annula Purchase */}
            <div className=" my-3 px-4 flex">
              <div className="flex items-center w-2/4">
                <div className="p-4 bg-violet-300 rounded-md">
                <Icon icon="la:cart-plus"  className="text-4xl text-violet-600 font-extrabold"/>
                </div>
                <div className="mx-3">
                  <h2 className="text-slate-400 text-md font-semibold">
                   No Of Purchase
                  </h2>
                  <h2 className="text-slate-800 text-xl font-extrabold">
                    $ 124,56
                  </h2>
                </div>
              </div>
              <div className="flex items-center w-2/4">
                 <div className="p-4 bg-pink-100 rounded-md">
                 <Icon icon="pepicons-pencil:cart-off" className="text-4xl text-pink-600 font-extrabold" />
                 </div>
                <div className="px-3">
                  <h2 className="text-slate-400 text-md font-semibold">
                    Cancle Order
                  </h2>
                  <h2 className="text-slate-800 text-xl font-extrabold">
                    $ 124,56
                  </h2>
                </div>
              </div>
            </div>
            {/* Monthly Sales */}
            <div className=" my-3 px-4 flex">
              <div className="flex items-center w-2/4	">
                <div className="p-4 bg-orange-200 rounded-md">
                   <Icon icon="carbon:purchase" className="text-4xl text-orange-600 font-extrabold" />

                </div>
                <div className="mx-3">
                  <h2 className="text-slate-400 text-md font-semibold">
                    Purchase Amount
                  </h2>
                  <h2 className="text-slate-800 text-xl font-extrabold">
                    $ 124,56
                  </h2>
                </div>
              </div>
              <div className="flex items-center w-2/4	">
                 <div className="p-4 bg-rose-100 rounded-md">
                    <Icon icon="la:cart-arrow-down" className="text-4xl text-rose-600 font-extrabold"/>
                 </div>
                <div className="px-3">
                  <h2 className="text-slate-400 text-md font-semibold">
                    Returns
                  </h2>
                  <h2 className="text-slate-800 text-xl font-extrabold">
                    $ 124,56
                  </h2>
                </div>
              </div>
            </div>
          </div>


          <div className="w-1/5 bg-white rounded-lg mx-auto shadow-md p-4 relative">
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold text-slate-700">
                Stock
              </h3>
              <div>
                <span>X</span>
                <span>X</span>
              </div>
            </div>
            <div>
              <div className="w-4/5 flex justify-center">
                <PieChart  width={260} height={200}>
                  <Pie
                    dataKey="value"
                    startAngle={180}
                    endAngle={0}
                    data={data}
                    cx={cx}
                    cy={cy}
                    innerRadius={iR}
                    outerRadius={oR}
                    fill="#8884d8"
                    stroke="none"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  {needle(value, data, cx, cy, iR, oR, "#d0d000")}
                  <Bar dataKey="name" fill="#8884d8" />
                  <Bar dataKey="value" fill="#82ca9d" />
                </PieChart>
              </div>
            </div>
          </div>
        </div>
        <div className="flex my-4">
          <div className="w-3/5 bg-white rounded-lg shadow-md p-4">
            <h2 className="text-slate-600 text-lg font-semibold my-3">
              Sales Statistics
            </h2>
            <ResponsiveContainer height={450} width="100%">
              <LineChart data={data1} margin={{ right: 25, top: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Line
                  type="monotone"
                  dataKey="pv"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="w-2/5 bg-white rounded-lg shadow-md p-4 mx-3">
            <h2 className="text-slate-600 text-lg font-semibold my-3">
              Top Selling Items
            </h2>
            <ResponsiveContainer height={400}>
              <PieChart>
                <Pie dataKey="value" data={data} fill="#8884d8" label />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}
