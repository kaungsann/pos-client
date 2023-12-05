import React, { useEffect, useState } from "react";
import { FiFilter } from "react-icons/fi";
import { Link } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { MdClear } from "react-icons/md";
import { getApi } from "../../Api";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from "date-fns";
import { Icon } from "@iconify/react";
import ReactPaginate from "react-paginate";
import { IoMdArrowRoundForward, IoMdArrowRoundBack } from "react-icons/io";
import ConfrimBox from "../../utils/ConfrimBox";

export default function Warehouse() {
  const [showFilter, setShowFilter] = useState(false);
  const [warehouse, setWarehouse] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(false);

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(0);

  const [payment, setpayment] = useState("");
  const [location, setlocation] = useState("");
  const [isFilterActive, setIsFilterActive] = useState(false);

  const [confrimShowBox, setconfrimShowBox] = useState(false);
  const [ConfirmOrderId, setConfirmOrderId] = useState(null);

  const token = useSelector((state) => state.IduniqueData);

  const getWareHouuseApi = async () => {
    setLoading(true);
    const resData = await getApi("/orders", token.accessToken);
    console.log("warehosue is", resData);
    if (resData.status) {
      setLoading(false);
      const filteredPending = resData.data.filter(
        (ct) => ct.state === "pending"
      );
      setWarehouse(filteredPending);
    } else {
      setLoading(false);
      toast(resData.message);
    }
  };

  const filteredWarehouse = () => {
    const filterWarehouse = warehouse.filter((ware) => {
      //Filter by location
      if (
        location &&
        !ware.location.name.toLowerCase().includes(location.toLowerCase())
      ) {
        return false;
      }
      // Filter by payment
      if (payment && !ware.paymentStatus.includes(payment)) {
        return false;
      }
      return true;
    });
    return filterWarehouse;
  };

  const filterRemove = () => {
    setlocation("");
    setpayment("");
    setIsFilterActive(false);
  };

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const handleConfirm = (id) => {
    setconfrimShowBox(true);
    setConfirmOrderId(id);
  };

  const changeConfirmOrder = async () => {
    const response = await fetch(
      `https://80a2e3emcc.execute-api.ap-southeast-1.amazonaws.com/orders/${ConfirmOrderId}?state=confirmed`,
      {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${token.accessToken}`,
        },
      }
    );
    let resData = await response.json();
    console.log("res data confirm is", response);
    toast(resData.message);
    getWareHouuseApi();
    setconfrimShowBox(false);
  };

  const closeBox = () => {
    setconfrimShowBox(false);
  };

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const filterWare = filteredWarehouse();

  const pageCount = Math.ceil(filterWare.length / itemsPerPage);
  const currentWarehouse = filterWare.slice(startIndex, endIndex);

  useEffect(() => {
    getWareHouuseApi();
    if (location || payment) {
      setIsFilterActive(true);
    } else {
      setIsFilterActive(false);
    }
  }, [location, payment]);

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
      <div className="relative">
        <div className=" pb-6 border-b-2 border-b-slate-300 flex justify-between">
          <h1 className="text-2xl text-slate-700 font-bold">
            WareHouse Information
          </h1>
          {/* <div
            onClick={() => setShowFilter(!showFilter)}
            className="font-bold rounded-sm shadow-sm flex items-center text-blue-700 border-blue-500 border-2 hover:opacity-75 text-md hover:text-white hover:bg-blue-700 px-6 py-2"
          >
            <FiFilter className="text-xl mx-2" />
            <h4>Filter</h4>
          </div> */}
        </div>

        {isFilterActive && (
          <div className="w-full py-3 flex justify-end">
            <button
              className="bg-red-500 px-4 h-9 py-1.5 rounded-md text-white hover:opacity-70"
              onClick={filterRemove}
            >
              Remove Filter
            </button>
          </div>
        )}
        <table className="w-full text-center">
          <tr className="bg-blue-600 text-white">
            <th className="text-center">schedule Date</th>
            <th className="lg:px-4 py-2 text-center">User</th>
            <th className="lg:px-4 py-2 text-center">Partner</th>
            <th className="lg:px-4 py-2 text-center">Location</th>
            <th className="lg:px-4 py-2 text-center">State</th>
            <th className="lg:px-4 py-2 text-center">Total Product</th>
            <th className="lg:px-4 py-2 text-center">Payment</th>
            <th className="lg:px-4 py-2 text-center">TaxTotal</th>
            <th className="lg:px-4 py-2 text-center">Total</th>
            <th className="lg:px-4 py-2 text-center"></th>
          </tr>
          <tbody className="w-full space-y-10 bg-slate-300">
            {currentWarehouse.length > 0 ? (
              currentWarehouse.map((wh) => (
                <tr
                  key={wh.id}
                  className="hover:bg-blue-100 odd:bg-white even:bg-slate-200 mt-3 w-full"
                >
                  <td className="lg:px-4 py-2 text-center">
                    {wh.scheduledDate
                      ? format(new Date(wh.scheduledDate), "yyyy-MM-dd")
                      : "no date"}
                  </td>

                  <td className="lg:px-4 py-2 text-center">
                    {wh.user && wh.user._id ? wh.user.username : "no have"}
                  </td>
                  <td className="lg:px-4 py-2 text-center">
                    {wh.partner && wh.partner.name ? wh.partner.name : "nohave"}
                  </td>
                  <td className="lg:px-4 py-2 text-center">
                    {wh.location && wh.location.name
                      ? wh.location.name
                      : "no have"}
                  </td>
                  <td className="lg:px-4 py-2 text-center">
                    <span
                      className={`rounded-xl py-2 text-sm ${
                        wh.state == "pending"
                          ? " bg-orange-50 text-orange-700 px-6"
                          : wh.state == "deliver"
                          ? "bg-cyan-50 text-cyan-600 px-6"
                          : wh.state == "arrived"
                          ? "bg-green-50 text-green-700 px-4"
                          : ""
                      }`}
                    >
                      {wh.state ? wh.state : "no state"}
                    </span>
                  </td>
                  <td className="lg:px-4 py-2 text-center overflow-hidden whitespace-nowrap">
                    {wh.lines.length}
                  </td>
                  <td className="lg:px-4 py-2 text-center">
                    <span
                      className={`rounded-xl py-2 text-sm ${
                        wh.paymentStatus == "pending"
                          ? "text-orange-700 px-6"
                          : wh.paymentStatus == "comfirm"
                          ? " text-green-700 px-4"
                          : ""
                      }`}
                    >
                      {wh.paymentStatus}
                    </span>
                  </td>

                  <td className="lg:px-4 py-2 text-center">
                    {wh.taxTotal.toFixed(2)}
                  </td>
                  <td className="lg:px-4 py-2 text-center">{wh.total}</td>
                  {/* <td
                    className="lg:px-4 py-2 text-center"
                    onClick={() => {
                      handleConfirm(wh.id);
                    }}
                  >
                    {wh.state === "pending" && (
                      <button className="px-4 py-2 ml-2 text-white text-sm text-bold bg-blue-700 rounded-md hover:opacity-75">
                        confirm
                      </button>
                    )}
                  </td> */}
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
          </tbody>
        </table>
        {status && (
          <div className="w-96 absolute top-3 left-0 right-0 z-50 mx-auto bg-white rounded-md shadow-md cursor-pointer">
            <div className="p-4 my-2 flex flex-col">
              <div className="flex justify-between">
                <label className="mb-3 after:ml-0.5 block text-lg font-semibold text-slate-600">
                  Status Change
                </label>
                <h3
                  onClick={() => setStatus(false)}
                  className="text-2xl text-slate-600 font-semibold hover:text-slate-800"
                >
                  X
                </h3>
              </div>
              <select
                onChange={(e) => setStatus(e.target.value)}
                id="status"
                name="status"
                className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
              >
                <option disabled value selected>
                  Select an option
                </option>
                <option value="comfirm">Comfirm</option>
              </select>
              <button className="my-3 items-center flex justify-center rounded-md bg-blue-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
      {showFilter && (
        <div
          className={`w-96 bg-slate-50 h-screen fixed top-0 right-0 p-4 z-50 transition-transform transform ${
            showFilter ? "translate-x-0" : "-translate-x-full"
          }ease-in-out duration-700`}
        >
          <div className="flex justify-between my-6">
            <h2 className="text-xl font-bold text-slate-700">
              Filter warehouse
            </h2>
            <MdClear
              onClick={() => setShowFilter(!showFilter)}
              className="text-2xl font-semibold text-slate-600 hover:opacity-70"
            />
          </div>
          <div>
            <div className="my-3 flex flex-col">
              <label className="text-lg my-2 text-slate-600 font-semibold">
                Payment
              </label>
              <input
                type="text"
                onChange={(e) => setpayment(e.target.value)}
                className="w-full rounded-md py-2 px-3 border-2 border-blue-300"
                placeholder="Search By barcode"
              />
            </div>
            <div className="my-3 flex flex-col">
              <label className="text-lg my-2 text-slate-600 font-semibold">
                Location
              </label>
              <input
                type="text"
                onChange={(e) => setlocation(e.target.value)}
                className="w-full rounded-md py-2 px-3 border-2 border-blue-300"
                placeholder="Search By Price"
              />
            </div>
            <div className="flex justify-between w-full my-4">
              {/* <button className="flex hover:opacity-70 px-4 py-2 justify-center items-center bg-blue-500 rounded-md text-white w-2/4">
                        <FiFilter className="mx-1" />
                        Filter
                        </button> */}
              <button
                onClick={() => {
                  setShowFilter(!showFilter);
                  filterRemove();
                }}
                className="px-4 hover:opacity-70 py-2 bg-red-500 rounded-md text-white w-full"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
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
              <IoMdArrowRoundBack className="mr-2" /> Previous
            </div>
          }
          nextLabel={
            <div className="flex items-center text-slate-700 border-2 px-2 py-1 bg-white border-b-gray-300">
              Next <IoMdArrowRoundForward className="ml-2" />
            </div>
          }
          forcePage={currentPage}
          renderOnZeroPageCount={null}
        />
      </div>
      <div className=" w-96 z-50 fixed top-40 bottom-0 left-0 right-0  mx-auto">
        {confrimShowBox && (
          <ConfrimBox close={closeBox} comfirmHandle={changeConfirmOrder} />
        )}
      </div>
    </div>
  );
}
