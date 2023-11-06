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
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  useEffect(() => {
    getSaleOrder();
  }, []);
  const formattedSaleData = sale.map((item) => ({
    ...item,
    created: format(new Date(item.createdAt), "yyyy-MM-dd"),
  }));

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
              <div className="w-3/5 bg-white p-2 rounded-md">
                <h3 className="text-slate-500 font-semibold text-lg mb-6">
                  Sale Order Dashboard
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
              <div className="items-center w-2/5 ml-4 bg-white p-2 rounded-md">
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
