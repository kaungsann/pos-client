import React, { useRef, useState } from "react";

import { BiImport, BiExport } from "react-icons/bi";

export default function AjusmentView() {
  const [loading, setLoading] = useState(false);

  const [importFile, setimportFile] = useState("");

  const importRef = useRef(null);

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

  const handleFileImportClick = () => {
    importRef.current.click();
  };

  const handleFileImportChange = async (event) => {
    const selectedFile = event.target.files[0];
    setimportFile(selectedFile);
    const formData = new FormData();
    formData.append("excel", importFile);
    const sendExcelApi = await FormPostApi("/product/import-excel", formData);
    s;
    setLoading(true);
    toast(sendExcelApi.message);
    if (sendExcelApi.status) {
      setLoading(false);
      getCategorysApi();
    }
  };
  
  return (
    <>
      <div className="flex">
        <div
          onClick={receiveExcel}
          className="rounded-sm shadow-sm flex items-center  text-[#15803d] border-[#15803d] border-2 hover:opacity-75 text-md hover:text-white hover:bg-green-700 font-bold px-6 py-2"
        >
          <BiImport className="text-xl mx-2" />
          <h4> Export Excel</h4>
        </div>
        <div
          onClick={handleFileImportClick}
          className="rounded-sm mx-3 shadow-sm flex items-center  text-[#15803d] border-[#15803d] border-2 hover:opacity-75 text-md hover:text-white hover:bg-green-700 font-bold px-6 py-2"
        >
          <input
            type="file"
            style={{ display: "none" }}
            ref={importRef}
            onChange={handleFileImportChange}
          />
          <h4>Import Excel </h4>
          <BiExport className="text-xl mx-2" />
        </div>
      </div>

      <div className="mt-6 mx-auto">
        <table className="w-full text-center">
          <tr className="bg-blue-600 text-white">
            <th className="lg:px-4 py-2 text-center">No</th>
            <th className="lg:px-4 py-2 text-center">Name</th>

            <th className="lg:px-4 py-2 text-center">Date</th>
            <th></th>
          </tr>
          <div className="mt-40 flex justify-center items-center">
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
        </table>
      </div>
    </>
  );
}
