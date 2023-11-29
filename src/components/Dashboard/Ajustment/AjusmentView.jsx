import React, { useEffect, useRef, useState } from "react";
import { FormPathApi, FormPostApi, getApi } from "../../Api";
import { BiImport, BiExport } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import FadeLoader from "react-spinners/FadeLoader";
import "react-toastify/dist/ReactToastify.css";
import { format } from "date-fns";
import { removeData } from "../../../redux/actions";

export default function AjusmentView() {
  const [loading, setLoading] = useState(false);
  const [adjustment, setAdjustment] = useState([]);
  const [importFile, setimportFile] = useState("");

  const importRef = useRef(null);
  const token = useSelector((state) => state.IduniqueData);
  const dispatch = useDispatch();

  const receiveExcel = async () => {
    try {
      // Define the request headers with the accessToken
      const headers = new Headers();
      headers.append("Authorization", token.accessToken);

      // Create the request options
      const requestOptions = {
        method: "GET",
        headers,
        mode: "cors",
        cache: "no-cache",
      };

      // Define the URL for downloading the file
      const downloadUrl =
        "http://3.0.102.114/inventory-adjustment/export-excel";

      const response = await fetch(downloadUrl, requestOptions);

      if (response.ok) {
        const blob = await response.blob();
        const filename =
          response.headers.get("content-disposition") || "adjustement-exported-data.xlsx";

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

  const handleFileImportClick = () => {
    importRef.current.click();
  };

  const handleFileImportChange = async (event) => {
    const selectedFile = event.target.files[0];
    setimportFile(selectedFile);
    const formData = new FormData();
    formData.append("excel", selectedFile);
    const sendExcelApi = await FormPostApi(
      "/inventory-adjustment/import-excel",
      formData,
      token.accessToken
    );
    setLoading(true);
    toast(sendExcelApi.message);
    if (sendExcelApi.status) {
      setLoading(false);
      getInventoryAdjustmentApi();
    }
  };

  const getInventoryAdjustmentApi = async () => {
    let resData;
    try {
      resData = await getApi("/inventory-adjustment", token.accessToken);

      setLoading(!resData.status);
      setAdjustment(resData.data);
    } catch (error) {
      setLoading(true);
      if (resData?.message === "Token Expire , Please Login Again") {
        dispatch(removeData(null));
        return;
      }
    }
  };

  useEffect(() => {
    getInventoryAdjustmentApi();
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
      />
      <div className="flex">
        <div
          onClick={receiveExcel}
          className="rounded-sm shadow-sm flex items-center cursor-pointer text-[#15803d] border-[#15803d] border-2 hover:opacity-75 text-md hover:text-white hover:bg-green-700 font-bold px-6 py-2"
        >
          <BiImport className="text-xl mx-2" />
          <h4> Export Excel</h4>
        </div>
        <div onClick={handleFileImportClick} className="rounded-sm mx-3 shadow-sm flex items-center  text-[#15803d] border-[#15803d] border-2 hover:opacity-75 text-md hover:text-white hover:bg-green-700 font-bold px-6 py-2">
          <input
            type="file"
            ref={importRef}
            style={{ display: "none" }}
            onChange={handleFileImportChange}
          />
          <button>Import Excel</button>
          <BiExport className="text-xl mx-2" />
        </div>
      </div>

      <div className="mt-3 mx-auto">
        <table className="w-full text-center">
          <tr className="bg-blue-600 text-white">
            <th className="lg:px-4 py-2 text-center">ID</th>
            <th className="lg:px-4 py-2 text-center">Date</th>
            <th className="lg:px-4 py-2 text-center">Product</th>
            <th className="lg:px-4 py-2 text-center">Barcode</th>
            <th className="lg:px-4 py-2 text-center">Location</th>
            <th className="lg:px-4 py-2 text-center">Quantity</th>
          </tr>
          {adjustment.length > 0 ? (
            adjustment.map((pd) => (
              <tr
                key={pd.id}
                className={
                  "bg-[#60a5fa] text-white odd:bg-white even:bg-slate-200 mb-8 w-full items-center cursor-pointer hover:text-white hover:bg-[#60a5fa]"
                }
              >
                <td className="py-3 lg:px-4 text-black">{pd.id}</td>
                <td className="py-3 lg:px-4 text-black">
                  {format(new Date(pd.createdAt), "yyyy-MM-dd")}
                </td>
                <td className="py-3 lg:px-4 text-black">{pd.productName}</td>
                <td className="py-3 lg:px-4 text-black">{pd.productBarcode}</td>
                <td className="py-3 lg:px-4 text-black">{pd.locationName}</td>
                <td className="py-3 lg:px-4 text-black">{pd.quantity}</td>
              </tr>
            ))
          ) : (
            <div className="w-10/12 mx-auto absolute  mt-40 flex justify-center items-center">
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
