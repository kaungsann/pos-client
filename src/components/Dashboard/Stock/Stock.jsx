import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApi } from "../../Api";
import FadeLoader from "react-spinners/FadeLoader";
import { BiImport } from "react-icons/bi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

export default function Stock() {
  let count = 0;
  const inputRef = useRef();
  const [searchItems, setSearchItems] = useState([]);
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.IduniqueData);

  const [importFile, setimportFile] = useState("");
  const importRef = useRef(null);

  const navigate = useNavigate();
  const stockApi = async () => {
    setLoading(true);
    let resData = await getApi("/stock", token.accessToken);
    if (resData.status) {
      setLoading(false);
      setStock(resData.data);
    } else {
      toast(resData.data);
      setLoading(true);
    }
  };

  const receiveExcel = async () => {
    try {
      const response = await fetch("http://3.0.102.114/stock/export-excel");

      if (response.ok) {
        const blob = await response.blob();
        const filename =
          response.headers.get("content-disposition") || "exported-data.xlsx";

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = filename;

        a.click();

        // Clean up
        window.URL.revokeObjectURL(url);
      } else {
        console.error("Failed to download the file. Server returned an error.");
      }
    } catch (error) {
      console.error("An error occurred while downloading the file:", error);
    }
  };

  useEffect(() => {
    stockApi();
  }, []);
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ width: "450px" }}
      />
      <div className="flex cursor-pointer">
        <div className="flex w-full justify-between items-center">
          <div
            onClick={receiveExcel}
            className="rounded-sm shadow-sm flex items-center  text-[#15803d] border-[#15803d] border-2 hover:opacity-75 text-md hover:text-white hover:bg-green-700 font-bold px-6 py-2"
          >
            <BiImport className="text-xl mx-2" />
            <h4>Export Excel</h4>
          </div>

          <div className="w-96 md:w-72 relative">
            <input
              ref={inputRef}
              type="text"
              className="px-3 py-2 w-full rounded-md border-2 border-blue-500 shadow-md bg-white focus:outline-none"
              id="products"
              placeholder="search products"
              onChange={(e) => setSearchItems(e.target.value.toLowerCase())}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto">
        <h2 className="lg:text-2xl font-bold my-4">Stocks</h2>
        <table className="w-full text-center">
          <tr className="bg-blue-600 text-white">
            <th className="lg:px-4 py-2 text-center">No</th>
            <th className="lg:px-4 py-2 text-center">Name</th>
            <th className="lg:px-4 py-2 text-center">Quantity</th>
            <th className="lg:px-4 py-2 text-center">Date</th>
            <th></th>
          </tr>
          {stock.length > 0 ? (
            stock
              .filter((item) =>
                searchItems.toLowerCase === ""
                  ? item
                  : item.product &&
                    item.product.name.toLowerCase().includes(searchItems)
              )
              .map((stk) => (
                <tr
                  key={stk.id}
                  className="odd:bg-white even:bg-slate-200 mt-3"
                >
                  <td className="py-3">{(count += 1)}</td>
                  <td className="py-3">
                    {stk.product && stk.product.name
                      ? stk.product.name
                      : "none"}
                  </td>
                  <td className="py-3">{stk.onHand}</td>
                  <td className="py-3">{stk.createdAt}</td>
                </tr>
              ))
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
        </table>
      </div>
    </>
  );
}
