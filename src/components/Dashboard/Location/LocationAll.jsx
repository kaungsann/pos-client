import React, { useEffect, useState, useRef } from "react";
import { getApi, deleteApi } from "../../Api";
import { BsFillTrashFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import DeleteAlert from "../../utils/DeleteAlert";
import { BiSolidEdit, BiImport, BiExport } from "react-icons/bi";
import FadeLoader from "react-spinners/FadeLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { FaEye } from "react-icons/fa6";

export default function LocationAll() {
  let count = 0;
  const inputRef = useRef();

  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [alert, setAlert] = useState(false);
  const [searchItems, setSearchItems] = useState([]);
  const [locations, setLocations] = useState([]);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [importFile, setimportFile] = useState("");

  const importRef = useRef(null);

  const token = useSelector((state) => state.IduniqueData);

  const navigate = useNavigate();

  const getLocationApi = async () => {
    setLoading(true);
    let resData = await getApi("/location", token.accessToken);
    if (resData.status) {
      setLoading(false);
      setLocations(resData.data);
    } else {
      setLoading(true);
    }
  };
  const deleteLocationApi = async (id) => {
    const response = await deleteApi(`/location/${id}`, token);
    getLocationApi();
  };
  const deleteLocationID = (id) => {
    setAlert(true);
    setDeleteCategoryId(id);
  };

  const receiveExcel = async () => {
    try {
      const response = await fetch("http://3.0.102.114/location/export-excel");

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
      getLocationApi();
    }
  };

  const toggleSelectItem = (locationID) => {
    setSelectAll(true);
    const isSelected = selectedItems.includes(locationID);
    if (isSelected) {
      setSelectedItems(selectedItems.filter((id) => id !== locationID));
    } else {
      setSelectedItems([...selectedItems, locationID]);
    }
  };

  // Handle select all items
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      const allProductIds = locations.map((product) => product.id);
      setSelectedItems(allProductIds);
    }
    setSelectAll(!selectAll);
  };
  useEffect(() => {
    getLocationApi();
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
        <div className="flex w-full justify-between items-center">
          <div className="flex md:mr-8 justify-around cursor-pointer">
            <Link to="/admin/locations/create">
              <div className="font-bold rounded-sm shadow-sm flex items-cente text-blue-700 border-blue-500 border-2 hover:opacity-75 text-md hover:text-white hover:bg-blue-700 px-6 py-2">
                Add Location
              </div>
            </Link>
            <div
              onClick={receiveExcel}
              className="rounded-sm mx-3 shadow-sm flex items-center  text-[#15803d] border-[#15803d] border-2 hover:opacity-75 text-md hover:text-white hover:bg-green-700 font-bold px-6 py-2"
            >
              <BiImport className="text-xl mx-2" />
              <h4> Export Excel</h4>
            </div>
            <div
              onClick={handleFileImportClick}
              className="rounded-sm shadow-sm flex items-center  text-[#15803d] border-[#15803d] border-2 hover:opacity-75 text-md hover:text-white hover:bg-green-700 font-bold px-6 py-2"
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
        <h2 className="lg:text-2xl font-bold my-4">Locations</h2>

        {selectAll && (
          <div className="flex justify-between mb-2 items-center px-2 py-2 bg-red-100">
            <h3 className="text-orange-400 font-semibold">
              {selectedItems.length} rows selected
            </h3>
            <button className="bg-red-500 py-2 px-4 rounded-md text-white">
              Delete
            </button>
          </div>
        )}

        <table className="w-full text-center">
          <tr className="bg-blue-600 text-white">
            <th className="lg:px-4 py-2 text-center">
              <input
                type="checkbox"
                onChange={toggleSelectAll}
                checked={selectAll}
              />
            </th>
            <th className="lg:px-4 py-2 text-center">No</th>
            <th className="lg:px-4 py-2 text-center">Name</th>
            <th className="lg:px-4 py-2 text-center">Create Date</th>
            <th className="lg:px-4 py-2 text-center">Update Date</th>
            <th className="lg:px-4 py-2 text-center">Action</th>
            <th></th>
          </tr>
          {locations.length > 0 ? (
            locations
              .filter((item) =>
                searchItems.toLowerCase === ""
                  ? item
                  : item.name.toLowerCase().includes(searchItems)
              )
              .map((loc) => (
                <tr
                  key={loc._id}
                  className={`${
                    selectedItems.includes(loc.id)
                      ? "bg-[#60a5fa] text-white"
                      : "odd:bg-white even:bg-slate-200"
                  }  mb-8 w-full items-center cursor-pointer hover:text-white hover:bg-[#60a5fa]`}
                >
                  <td className="lg:px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      onChange={() => toggleSelectItem(loc.id)}
                      checked={selectedItems.includes(loc.id)}
                    />
                  </td>
                  <td className="py-3">{(count += 1)}</td>
                  <td className="py-3">{loc.name}</td>
                  <td className="py-3">
                    {new Date(loc.createdAt).toLocaleDateString("en-US")}
                  </td>
                  <td className="py-3">
                    {new Date(loc.updatedAt).toLocaleDateString("en-US")}
                  </td>
                  <td className="py-3 flex justify-center">
                    <FaEye
                      onClick={() =>
                        navigate(`/admin/locations/detail/${loc.id}`)
                      }
                      className="text-2xl text-sky-600 BiSolidEdit hover:text-sky-900"
                    />
                    <BiSolidEdit
                      className="lg:text-2xl mx-3 text-blue-500 hover:text-blue-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/locations/edit/${loc.id}`);
                      }}
                    />

                    <BsFillTrashFill
                      className="lg:text-2xl text-red-500  hover:text-red-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteLocationID(loc.id);
                      }}
                    />
                  </td>
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
        {alert && (
          <DeleteAlert
            cancel={() => {
              setAlert(false);
              setDeleteCategoryId(null);
            }}
            onDelete={() => {
              deleteLocationApi(deleteCategoryId);
              setAlert(false);
            }}
          />
        )}
      </div>
    </>
  );
}
