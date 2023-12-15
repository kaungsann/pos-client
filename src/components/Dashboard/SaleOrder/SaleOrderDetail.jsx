import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getApi } from "../../Api";
import { Icon } from "@iconify/react";
import { useDispatch, useSelector } from "react-redux";
import { removeData } from "../../../redux/actions";
import FadeLoader from "react-spinners/FadeLoader";
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
  const token = useSelector((state) => state.IduniqueData);
  const dipatch = useDispatch();

  const columns = [
    { key: "name", label: "Name", align: "center" },
    { key: "tax", label: "Tax", align: "center" },
    { key: "qty", label: "Stock Qty", align: "center" },
    { key: "unitPrice", label: "Unit Price", align: "center" },
    { key: "subTotal", label: "Subtotal", align: "center" },
  ];

  const getProductName = (item) => {
    const productName = item.product && item.product.name;
    return productName || "N/A";
  };

  const singleSaleOrder = async () => {
    setLoading(true);
    let resData = await getApi(`/sale/${id}`, token.accessToken);
    if (resData.message == "Token Expire , Please Login Again") {
      dipatch(removeData(null));
    }
    if (resData.status) {
      setLoading(false);
      setDetails(resData.data);
    } else {
      setLoading(true);
    }
  };

  const saleLinesApi = async () => {
    let resData = await getApi("/salelines", token.accessToken);
    if (resData.message == "Token Expire , Please Login Again") {
      dipatch(removeData(null));
    }
    if (resData.status) {
      let name = resData.data.filter(
        (pid) => pid.orderId && pid.orderId._id === id
      );
      console.log("sale lines iss single name is", name);
      setLines(name);
    }
  };
  console.log("sale lines iss single", lines);
  useEffect(() => {
    saleLinesApi();
    singleSaleOrder();
  }, []);
  console.log("detail lines iss single", detail);

  return (
    <>
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Link
            to="/admin/saleorders/all"
            className="font-bold rounded-sm shadow-sm flex items-center text-gray-700 border-gray-500 border-2 hover:opacity-75 text-sm hover:text-white hover:bg-gray-500 px-3 py-1.5"
          >
            Back
          </Link>
        </div>
      </div>
      {detail && detail.length > 0 ? (
        <div className="container my-5">
          <h2 className="lg:text-xl font-bold my-2">Order Information</h2>
          <div className="container bg-white p-5 rounded-lg max-w-6xl">
            <div className="grid grid-cols-2 max-w-3xl gap-10">
              <div className="container space-y-8 font-semibold text-sm">
                <div className="flex justify-between items-center">
                  <h4>Order Date</h4>
                  <h3 className="font-medium">
                    {detail[0].orderDate
                      ? new Date(detail[0].orderDate).toLocaleDateString()
                      : ""}
                  </h3>
                </div>
                <div className="flex justify-between items-center">
                  <h4>Customer</h4>
                  <h3 className="font-medium">
                    {detail[0].partner ? detail[0].partner.name : "none"}
                  </h3>
                </div>
                <div className="flex justify-between items-center">
                  <h4>Location</h4>
                  <h3 className="font-medium">
                    {detail[0].location && detail[0].location.name}
                  </h3>
                </div>
              </div>
              <div className="container space-y-8 font-semibold text-sm">
                <div className="flex justify-between items-center">
                  <h4>Tax Total</h4>
                  <h3 className="font-medium">{detail[0].taxTotal}</h3>
                </div>
                <div className="flex justify-between items-center">
                  <h4>Total</h4>
                  <h3 className="font-medium">
                    {detail[0].total && detail[0].total}
                  </h3>
                </div>
                <div className="flex justify-between items-center">
                  <h4>State</h4>
                  <h3 className="font-medium">{detail[0].state}</h3>
                </div>
                <div className="flex justify-between items-center">
                  <h4>Note</h4>
                  <h3 className="font-medium">{detail[0].note}</h3>
                </div>
              </div>
            </div>
            <h2 className="py-1.5 text-lg font-bold mt-4 pb-5">
              Order Products
            </h2>
            <div className="w-full mb-6 ">
              <Table
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
                    <TableRow key={item.orderId._id} className="table-row ">
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
              </Table>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center mt-40">
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
