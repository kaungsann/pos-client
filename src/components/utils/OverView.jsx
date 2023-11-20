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
  ResponsiveContainer,
  Legend,
  Rectangle,

} from "recharts";
import { format } from "date-fns";

import FadeLoader from "react-spinners/FadeLoader";
import { getApi } from "../Api";
import { useDispatch, useSelector } from "react-redux";
import { removeData } from "../../redux/actions";

export default function OverView() {
  const [sale, setSale] = useState([]);
  const [purchase , setPurchase] = useState([])

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
    }  else {
      setLoading(true);
    }
  };

  const purchaseOrderApi = async() => {
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
  }

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

  const datas = [
    {
      name: 'Page A',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

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


 const purchaseMonthlyTotal = purchase.reduce((total, order) => total + order.total, 0);

 const weeklyPurchaseOrders = purchase.filter((order) => {
  const orderDate = new Date(order.createdAt);
  return orderDate > oneWeekAgo;
});

const weeklyPurchaseTotal = weeklyPurchaseOrders.reduce(
  (total, order) => total + order.total,
  0
);


 useEffect(() => {
  saleOrderApi();
  purchaseOrderApi()
}, []);

  

  return (
    <>
      <div className="flex">
        <div className="z-40 w-3/5 flex flex-col">
          <div className="p-4 bg-white shadow-md mr-4 mb-5">
            <h3 className="text-slate-500 font-semibold text-lg mb-6">
              Monthly Sale and Purchase
            </h3>


             <ResponsiveContainer height={400}>
               <BarChart

          height={300}
          data={datas}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="pv" fill="#8884d8" />
          <Bar yAxisId="right" dataKey="uv" fill="#0496C7" />
                </BarChart>
            </ResponsiveContainer>


          </div>

          <div className="p-4 bg-white shadow-md mr-4">
            <h3 className="text-slate-500 font-semibold text-lg mb-6">
              Monthly Sale
            </h3>
            <ResponsiveContainer height={400}>
            <BarChart
 
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
            </ResponsiveContainer>
          </div>
        </div>
        <div className="w-2/5 bg-white p-4 shadow-md">
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
            <h5 className="mt-1.5 text-center text-sm font-semibold text-slate-500">
              This Month Sale
            </h5>
            <h2 className="text-3xl text-green-600 font-bold text-center">
              {monthlyTotal ? monthlyTotal.toFixed(2) : "0"}
            </h2>

          </div>
          <div className="bg-blue-50 py-3 rounded-md mt-3 shadow-sm">
            <h5 className="mt-1.5 text-center text-sm font-semibold text-slate-500">
              This Weekend Sale
            </h5>
            <h2 className="text-3xl text-orange-500 font-bold text-center">
              {weeklyTotal ? weeklyTotal.toFixed(2) : "0"}
            </h2>
     
          </div>


          <div className="border-b-slate-300 border-b-2 my-8"></div>

            <div className="bg-blue-50 py-3 rounded-md mt-3 shadow-sm">
          <h5 className="mt-1.5 text-center text-sm font-semibold text-slate-500">
              This Month Purchase
            </h5>
            <h2 className="text-3xl text-green-600 font-bold text-center">
              {purchaseMonthlyTotal ? purchaseMonthlyTotal.toFixed(2) : "0"}
            </h2>
   
             </div>
            <div className="bg-blue-50 py-3 rounded-md mt-3 shadow-sm">
            <h5 className="mt-1.5 text-center text-sm font-semibold text-slate-500">
              This Weekend Purchase
            </h5>
            <h2 className="text-3xl text-orange-500 font-bold text-center">
              {weeklyPurchaseTotal ? weeklyPurchaseTotal.toFixed(2) : "0"}
            </h2>
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
