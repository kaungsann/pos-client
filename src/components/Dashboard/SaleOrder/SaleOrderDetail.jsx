import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getApi } from "../../Api";

import { MdAddShoppingCart } from "react-icons/md";
import { useSelector } from "react-redux";

export default function SaleOrderDetail() {
  const { id } = useParams();
  const [detail, setDetails] = useState(null);
  const token = useSelector((state) => state.IduniqueData);

  const singleSaleOrder = async () => {
    let resData = await getApi(`/sale/${id}`, token.accessToken);
    setDetails(resData.data);
  };

  useEffect(() => {
    singleSaleOrder();
  }, []);

  return (
    <>
      {detail && detail.length > 0 ? (
        <div>
          <div className="flex items-center justify-between">
            <div className="flex justify-center">
              <MdAddShoppingCart className="text-4xl font-bold text-slate-600" />
              <h3 className="text-2xl text-slate-700 font-bold">Sale Order</h3>
            </div>
            <Link to="/admin/saleorders/all">
              <button className="hover:opacity-75 lg:px-8 md:px-4 py-2 text-white bg-blue-600 rounded-md shadow-md border-2 border-blue-600 hover:opacity-75text-white">
                Back
              </button>
            </Link>
          </div>
          <div className="w-full mx-auto flex justify-center cursor-pointer flex-col">
            <h2 className="py-1.5 text-lg font-bold mt-2 bg-blue-600 text-white pl-4">
              Customer Information
            </h2>
            <div className="flex justify-between">
              <div className="w-2/4">
                <div className="flex justify-between my-3">
                  <h4 className="font-bold text-lg text-slate-500">Date</h4>
                  <h3 className="font-bold text-lg text-slate-600 w-2/5 mr-20 pl-3 py-2 rounded-md bg-slate-100">
                    {new Date(detail[0].orderDate).toLocaleDateString()}
                  </h3>
                </div>
                <div className="flex justify-between my-3">
                  <h4 className="font-bold text-lg text-slate-500">
                    Customer Name
                  </h4>
                  <h3 className="font-bold text-lg text-blue-600 w-2/5 mr-20 pl-3 py-2 rounded-md bg-slate-100 ">
                    {detail[0].partner ? detail[0].partner.name : "none"}
                  </h3>
                </div>
                <div className="flex justify-between my-3">
                  <h4 className="font-bold text-lg text-slate-500">Location</h4>
                  <h3 className="font-bold text-lg text-slate-600 w-2/5 mr-20 pl-3 py-2 rounded-md bg-slate-100 ">
                    {detail[0].location ? detail[0].location.name : "none"}
                  </h3>
                </div>
              </div>

              <div className="w-2/4 justify-between">
                <div className="flex justify-between my-3">
                  <h4 className="font-bold text-lg text-slate-500">TaxTotal</h4>
                  <h3 className="font-bold text-lg text-slate-600 w-2/5 mr-20 pl-3 py-2 rounded-md bg-slate-100 ">
                    {detail[0].taxTotal}
                  </h3>
                </div>

                <div className="flex justify-between my-3">
                  <h4 className="font-bold text-lg text-slate-500">Total</h4>
                  <h3 className="font-bold text-lg text-slate-600 w-2/5 mr-20 pl-3 py-2 rounded-md bg-slate-100 ">
                    {detail[0].total}
                  </h3>
                </div>
                <div className="flex justify-between my-3">
                  <h4 className="font-bold text-lg text-slate-500">State</h4>
                  <h3 className="font-bold text-lg text-blue-600 w-2/5 mr-20 pl-3 py-2 rounded-md bg-slate-100 ">
                    {detail[0].state}
                  </h3>
                </div>
              </div>
            </div>
            <h2 className="py-1.5 text-lg font-bold mt-4 bg-blue-600 text-white pl-4">
              Customer Order Products
            </h2>
            <div className="w-full mb-6">
              <table className="w-full">
                <thead className="w-full">
                  <tr className="">
                    <th className="text-center">Photo</th>
                    <th className="text-center">Name</th>

                    <th className="py-2 text-center">Tax</th>
                    <th className="py-2 text-center">StockQty</th>
                    <th className="py-2 text-center">unitPrice</th>
                    <th className="py-2">subTotal</th>
                  </tr>
                </thead>
                <tbody className="w-full space-y-10">
                  {detail[0].lines && detail[0].lines.length > 0 ? (
                    detail[0].lines.map((item) => (
                      <tr
                        key={item.id}
                        className="odd:bg-white even:bg-slate-200 space-y-10  mb-8 w-full items-center cursor-pointer"
                      >
                        <td className="lg:px-4 py-2 text-center items-center">
                          {item.product && item.product.image ? (
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-10 h-10 rounded-md shadow-md mx-auto"
                            />
                          ) : (
                            <div>No Image</div>
                          )}
                        </td>
                        <td className="text-center">
                          {item.product ? item.product.name : ""}
                        </td>

                        <td className="text-center">{item.tax}</td>
                        <td className="text-center">{item.qty}</td>
                        <td className="text-center">{item.unitPrice}</td>
                        <td className="text-center">{item.subTotal}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No order lines available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        "no have sale order"
      )}
    </>
  );
}
