import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getApi } from "../../Api";
import { useDispatch, useSelector } from "react-redux";
import { removeData } from "../../../redux/actions";
import { Spinner } from "@nextui-org/react";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@nextui-org/react";

export default function SaleOrderDetail() {
  const { id } = useParams();
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detail, setDetails] = useState(null);
  const [error, setError] = useState(null);

  const token = useSelector((state) => state.IduniqueData);
  const dispatch = useDispatch();

  const columns = [
    { key: "name", label: "Name", align: "center" },
    { key: "tax", label: "Tax", align: "center" },
    { key: "qty", label: "Stock Qty", align: "center" },
    { key: "unitPrice", label: "Unit Price", align: "center" },
    { key: "subTotal", label: "Subtotal", align: "center" },
    { key: "discount", label: "Discount", align: "center" },
  ];

  const getProductName = (item) => {
    const productName = item.product && item.product.name;
    return productName || "N/A";
  };

  const singleSaleOrder = async () => {
    setLoading(true);

    try {
      let resData = await getApi(`/sale/${id}`, token.accessToken);

      if (resData.message === "Token Expire , Please Login Again") {
        dispatch(removeData(null));
      }

      if (resData.status) {
        setLoading(false);
        setDetails(resData.data);
      } else {
        throw new Error("Data not found");
      }
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const saleLinesApi = async () => {
    try {
      let resData = await getApi("/salelines", token.accessToken);

      if (resData.message === "Token Expire , Please Login Again") {
        dispatch(removeData(null));
      }

      if (resData.status) {
        let name = resData.data.filter(
          (pid) => pid.orderId && pid.orderId._id === id
        );
        setLines(name);
      } else {
        throw new Error("Data not found");
      }
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  console.log("detail is a", lines);

  useEffect(() => {
    saleLinesApi();
    singleSaleOrder();
  }, []);

  return (
    <>
      {error ? (
        <div className="flex items-center justify-center mt-40 pb-10">
          <p className="text-red-500 text-xl px-4 py-2 ">Failed To Load Data</p>
        </div>
      ) : detail && detail.length > 0 ? (
        <div className="container cursor-pointer">
          <div className="container bg-white p-5 rounded-md max-w-6xl">
            <div className="flex gap-2 pb-4">
              <Link
                to="/admin/saleorders/all"
                className="font-bold rounded-sm shadow-sm flex items-center text-gray-700 border-gray-500 border-2 hover:opacity-75 text-sm hover:text-white hover:bg-gray-500 px-3 py-1.5"
              >
                Back
              </Link>
            </div>
            <div>
              <div className="flex">
                <h1 className="text-2xl font-bold text-slate-600">
                  Sale Information
                </h1>
              </div>

              <div className="my-4 flex p-4 items-center w-4/5 border-b-2">
                <div className="flex justify-between w-full">
                  <div>
                    <div>
                      <h4 className="text-md text-slate-500">Order-Date</h4>
                      <h2 className="text-md text-slate-600 mt-1 font-semibold">
                        {detail[0].orderDate
                          ? new Date(detail[0].orderDate).toLocaleDateString()
                          : ""}
                      </h2>
                    </div>
                    <div className="my-6">
                      <h4 className="text-md text-slate-500">Updated-On</h4>
                      <h2 className="text-md text-slate-600 mt-1 font-semibold">
                        {new Date(detail[0].updatedAt).toLocaleDateString()}
                      </h2>
                    </div>
                  </div>
                  <div>
                    <div>
                      <h4 className="text-md text-slate-500">Customer</h4>
                      <h2 className="text-md text-slate-600 mt-1 font-semibold">
                        {detail[0].partner ? detail[0].partner.name : "none"}
                      </h2>
                    </div>
                    <div className="my-6">
                      <h4 className="text-md text-slate-500">Location</h4>
                      <h2 className="text-md text-slate-600 mt-1 font-semibold">
                        {detail[0].location && detail[0].location.name}
                      </h2>
                    </div>
                  </div>
                  <div>
                    <div>
                      <h4 className="text-md text-slate-500">Tax-Total</h4>
                      <h2 className="text-md text-slate-600 mt-1 font-semibold">
                        {detail[0].subTaxTotal ? detail[0].subTaxTotal : "0"}
                      </h2>
                    </div>
                    <div className="my-6">
                      <h4 className="text-md text-slate-500">Total</h4>
                      <h2 className="text-md text-slate-600 mt-1 font-semibold">
                        {detail[0].total && detail[0].total}
                      </h2>
                    </div>
                  </div>

                  <div>
                    <div>
                      <h4 className="text-md text-slate-500">State</h4>
                      <h2
                        className={`font-semibold text-md mt-1 ${
                          detail[0].state === "pending" && "text-red-500 "
                        } ${
                          detail[0].state === "confirmed" && "text-green-500"
                        }`}
                      >
                        {detail[0].state}
                      </h2>
                    </div>
                    {/* <div className="my-6">
                      <h4 className="text-md text-slate-500">Discount</h4>
                      <div className="flex">
                        <h2 className="text-md text-slate-600 mt-1 font-semibold">
                          {detail[0].discount ? detail[0].discount.amount : "0"}
                          %
                        </h2>
                        <h2 className="text-md ml-4 text-slate-600 mt-1 font-semibold">
                          {detail[0].discount.name
                            ? "(" + detail[0].discount.name + ")"
                            : ""}
                        </h2>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
              <h2 className="text-xl font-bold text-slate-600 mb-6">
                Order Products
              </h2>
              {/* <Table
                isStriped
                aria-label="Order Lines Table"
                className="my-custom-table "
              >
                <TableHeader columns={columns}>
                  {(column) => (
                    <TableColumn
                      key={column.key}
                      align={column.align}
                      className="header-cell bg-blue-500 text-white"
                    >
                      {column.label}
                    </TableColumn>
                  )}
                </TableHeader>
                <TableBody items={lines || []}>
                  {(item) => (
                    <TableRow key={item.orderId._id} className="table-row">
                      {(columnKey) => (
                        <TableCell
                          key={columnKey}
                          align={
                            columns.find((col) => col.key === columnKey)?.align
                          }
                          className="table-cell"
                        >
                          {columnKey === "name"
                            ? getProductName(item)
                            : getKeyValue(item, columnKey)}
                        </TableCell>
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </Table> */}
              <table className="w-full">
                <thead className="w-full">
                  <tr className="bg-blue-600 text-white">
                    <th className="lg:px-4 py-2 text-center">Name</th>
                    <th className="lg:px-4 py-2 text-center">Tax</th>
                    <th className="lg:px-4 py-2 text-center">Qty</th>
                    <th className="lg:px-4 py-2 text-center">unitPrice</th>
                    <th className="lg:px-4 py-2 text-center">SubTotal</th>
                    <th className="lg:px-4 py-2 text-center">Discount</th>
                  </tr>
                </thead>
                <tbody className="mt-4">
                  {lines.map((line, index) => (
                    <tr key={index}>
                      <td className="py-2 text-center text-slate-600 font-semibold">
                        {line.product.name}
                      </td>
                      <td className="py-2 text-center text-slate-600 font-semibold">
                        {line.tax}
                      </td>
                      <td className="py-2 text-center text-slate-600 font-semibold">
                        {line.qty}
                      </td>
                      <td className="py-2 text-center text-slate-600 font-semibold">
                        {line.unitPrice}
                      </td>
                      <td className="py-2 text-center text-slate-600 font-semibold">
                        {line.subTotal}
                      </td>
                      <td className="py-2 text-center text-slate-600 font-semibold">
                        {line.discount &&
                          line.discount.name +
                            " " +
                            " ( " +
                            line.discount.amount +
                            "%" +
                            " ) "}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-screen items-center justify-center">
          {loading && <Spinner size="lg" />}
        </div>
      )}
    </>
  );
}
