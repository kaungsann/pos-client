import React, { useEffect, useState, useRef } from "react";
import { getApi, deleteMultiple, FormPostApi } from "../../Api";
import { Link, useNavigate } from "react-router-dom";
import DeleteAlert from "../../utils/DeleteAlert";
import { BiSolidEdit, BiImport, BiExport } from "react-icons/bi";
import ClipLoader from "react-spinners/ClipLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { FaEye } from "react-icons/fa6";
import { removeData } from "../../../redux/actions";
import ReactPaginate from "react-paginate";
import { IoMdArrowRoundForward , IoMdArrowRoundBack} from "react-icons/io";

export default function LocationAll() {
  const inputRef = useRef();

  const itemsPerPage = 10; 
  const [currentPage, setCurrentPage] = useState(0);

  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [alert, setAlert] = useState(false);
  const [searchItems, setSearchItems] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  const [importFile, setimportFile] = useState("");

  const importRef = useRef(null);

  const token = useSelector((state) => state.IduniqueData);
  const dipatch = useDispatch();

  const navigate = useNavigate();

  const getLocationApi = async () => {
    setLoading(true);
    let resData = await getApi("/location", token.accessToken);
    if (resData.message == "Token Expire , Please Login Again") {
      dipatch(removeData(null));
    }
    if (resData.status) {
      setLoading(false);
      const filteredLocation = resData.data.filter(
        (partner) =>  partner.active === true
      );
      setLocations(filteredLocation);
    } else {
      setLoading(true);
    }
  };

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
      const downloadUrl = "https://x1czilrsii.execute-api.ap-southeast-1.amazonaws.com/location/export-excel";

      const response = await fetch(downloadUrl, requestOptions);
      console.log("res download is", response);

      if (response.ok) {
        const blob = await response.blob();
        const filename =
          response.headers.get("content-disposition") || "location-exported-data.xlsx";

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
    const sendExcelApi = await FormPostApi("/location/import-excel", formData, token.accessToken);
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
  const deleteLocations = async () => {
    if (selectedItems.length === 0) {
      toast("No locations selected for deletion.");
      return;
    }

    const response = await deleteMultiple(
      "/location",
      {
        locationIds: selectedItems,
      },
      token.accessToken
    );

    if (response.status) {
      toast("Selected locations deleted successfully.");
      setSelectedItems([]);
      setSelectAll(false);
      getLocationApi();
    } else {
      toast("Failed to locations selected locations.");
    }
  };

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;


  const pageCount = Math.ceil(locations.length / itemsPerPage);
  const currentLocations = locations.slice(startIndex, endIndex);

  useEffect(() => {
    getLocationApi();
  }, []);
  
  return (
    <div className="relative">
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
              placeholder="search location"
              onChange={(e) => setSearchItems(e.target.value.toLowerCase())}
            />
          </div>
        </div>
      </div>
      <div className="mx-auto">
        <h2 className="lg:text-2xl font-bold my-4">Locations</h2>
        {selectedItems.length > 0 && (
          <div className="flex justify-between mb-2 items-center px-2 py-2 bg-red-100">
            <h3 className="text-orange-400 font-semibold">
              {selectedItems.length} rows selected
            </h3>
            <button
              className="bg-red-500 py-2 px-4 rounded-md text-white hover:opacity-70"
              onClick={() => setAlert(true)}
            >
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
                checked={selectAll && selectedItems.length > 0}
              />
            </th>
            <th className="lg:px-4 py-2 text-center">Name</th>
            <th className="lg:px-4 py-2 text-center">Action</th>
            <th></th>
          </tr>
          {currentLocations.length > 0 ? (
            currentLocations
              .filter((item) =>
                searchItems.toLowerCase === ""
                  ? item
                  : item.name.toLowerCase().includes(searchItems)
              )
              .map((loc) => (
                <tr
                  key={loc._id}
                  onClick={() => toggleSelectItem(loc.id)}
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
                  <td className="py-3">{loc.name}</td>
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
                  </td>
                </tr>
              ))
          ) : (
            <div className="w-full mx-auto absolute mt-56 flex justify-center items-center">
              {loading && (
                <ClipLoader
                  color={"#0284c7"}
                  loading={loading}
                  size={35}
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
              setSelectedItems([]);
            }}
            onDelete={() => {
              deleteLocations();
              setAlert(false);
            }}
          />
        )}
      </div>
      <div className="fixed bottom-12 right-28 w-80 items-center">
        <ReactPaginate
          containerClassName="pagination-container flex justify-center items-center"
          pageLinkClassName="page-link text-center"
          pageClassName="page-item"
          className="flex justify-around text-center bg-slate-200 items-center"
          activeClassName="bg-blue-500 text-white text-center"
          previousClassName="text-slate-500 font-semibold hover:text-slate-700"
          nextClassName="text-slate-500 font-semibold hover:text-slate-700"
          breakLabel={<div className="break-label">...</div>} // Custom break element with margin
          onPageChange={handlePageClick}
          pageRangeDisplayed={5} // Number of pages to display in the pagination
          marginPagesDisplayed={1}
          pageCount={pageCount}
          previousLabel={
            <div className="flex items-center text-slate-700 border-2 px-2 py-1 border-b-gray-300 bg-white">
              <IoMdArrowRoundBack className="mr-2"/>
              {' '}
              Previous
            </div>
          } 
          nextLabel={
            <div className="flex items-center text-slate-700 border-2 px-2 py-1 bg-white border-b-gray-300">
              Next
              {' '}
              <IoMdArrowRoundForward className="ml-2"/>
            </div>
          }
          forcePage={currentPage}
          renderOnZeroPageCount={null}
        />
      </div>
    </div>
  );
}
