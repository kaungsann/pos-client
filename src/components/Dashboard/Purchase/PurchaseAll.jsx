import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PathData, getApi, orderConfirmApi } from "../../Api";
import { BiExport } from "react-icons/bi";
import { MdClear } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FadeLoader from "react-spinners/FadeLoader";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { FiFilter } from "react-icons/fi";
import { FaEye } from "react-icons/fa6";
import { removeData } from "../../../redux/actions";
import ConfrimBox from "../../utils/ConfrimBox";
import ReactPaginate from "react-paginate";
import { IoMdArrowRoundForward , IoMdArrowRoundBack} from "react-icons/io"

export default function PurchaseAll() {
  const [saleorders, setSaleOrders] = useState([]);
  const [searchItems, setSearchItems] = useState("");
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 10; 
  const [currentPage, setCurrentPage] = useState(0);

  const [showFilter, setShowFilter] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false); // Track if any filter is active
  const [confrimShowBox, setconfrimShowBox] = useState(false);
  const [ConfirmOrderId, setConfirmOrderId] = useState(null);

  const [filterDate, setFilterDate] = useState("");
  const [filterStaff, setFilterStaff] = useState("");
  const [filterLocation, setFilterLocation] = useState("");

  const navigate = useNavigate();
  const inputRef = useRef();
  const token = useSelector((state) => state.IduniqueData);

  const [importFile, setimportFile] = useState("");
  const importRef = useRef(null);
  const dipatch = useDispatch();

  const PurchaseOrderApi = async () => {
    setLoading(true);
    const resData = await getApi("/purchase", token.accessToken);
    if (resData.message == "Token Expire , Please Login Again") {
      dipatch(removeData(null));
    }
    if (resData.success) {
      setLoading(false);
      setSaleOrders(resData.data);
    } else {
      setLoading(true);
      toast(resData.message);
    }
  };

  // const handleFileImportClick = () => {
  //   importRef.current.click();
  // };
  // const handleFileImportChange = async (event) => {
  //   const selectedFile = event.target.files[0];
  //   setimportFile(selectedFile);
  //   const formData = new FormData();
  //   formData.append("excel", importFile);
  //   const sendExcelApi = await FormPostApi("/purcahse/import-excel", formData);
  //   setLoading(true);
  //   toast(sendExcelApi.message);
  //   if (sendExcelApi.status) {
  //     setLoading(false);
  //     PurchaseOrderApi();
  //   }
  // };

  const toggleFilterBox = () => {
    setShowFilter(!showFilter);
  };

  const filteredPurchase = () => {
    const filterPurchase = saleorders.filter((sale) => {
      //Filter by date
      if (filterDate && !sale.orderDate.includes(filterDate)) {
        return false;
      }
      // Filter by staff
      if (
        filterStaff &&
        !sale.user.username.toLowerCase().includes(filterStaff.toLowerCase())
      ) {
        return false;
      }
  
      // Filter by location
      if (
        filterLocation &&
        !sale.location.name.toLowerCase().includes(filterLocation.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
    return filterPurchase
  }

  const handleConfirm = (id) => {
    setconfrimShowBox(true);
    setConfirmOrderId(id);
  };

  const changeConfirmOrder = async () => {
    const response = await orderConfirmApi(
      `/purchase/${ConfirmOrderId}?state=confirmed`,
      token.accessToken
    );
    console.log(response);
    toast(response.message);
    PurchaseOrderApi();
    closeBox();
  };

  const closeBox = () => {
    setconfrimShowBox(false);
  };

  const filterRemove = () => {
    // Clear filter criteria and update the state variable
    setFilterDate("");
    setFilterStaff("");
    setFilterLocation("");
    setIsFilterActive(false);
  };

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const filteredPurchased = filteredPurchase();

  const pageCount = Math.ceil(filteredPurchased.length / itemsPerPage);
  const currentPurchase = filteredPurchased.slice(startIndex, endIndex);

  useEffect(() => {
    PurchaseOrderApi();
    if (filterDate || filterStaff || filterLocation) {
      setIsFilterActive(true);
    } else {
      setIsFilterActive(false);
    }
  }, [filterDate, filterStaff, filterLocation]);

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
        style={{ width: "450px" }}
      />
      <div className="flex cursor-pointer relative">
        <div className="flex w-full justify-between items-center">
          <div className="flex md:mr-8 justify-around0">
            <Link to="/admin/purchase/create">
              <div className="font-bold rounded-sm shadow-sm flex items-cente text-blue-700 border-blue-500 border-2 hover:opacity-75 text-md hover:text-white hover:bg-blue-700 px-6 py-2">
                Add Purchase
              </div>
            </Link>
            <div
              onClick={toggleFilterBox}
              className="rounded-sm ml-3 transition shadow-sm flex items-center text-[#4338ca] border-[#4338ca] border-2 hover:opacity-75 text-md hover:text-white hover:bg-[#4338ca] font-bold px-6 py-2"
            >
              <FiFilter className="text-xl mx-2" />
              <h4>Filter</h4>
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
        <div className="flex justify-between items-center">
          <h2 className="lg:text-2xl font-bold my-4">Purchase</h2>
          {isFilterActive && (
            <button
              className="bg-red-500 px-4 h-8 rounded-md text-white hover:opacity-70"
              onClick={filterRemove}
            >
              Remove Filter
            </button>
          )}
        </div>
        <table className="w-full text-center relative  mb-20">
          <tr className="bg-blue-600 text-white">
            <th className="text-center">Order Date</th>
            <th className="lg:px-4 py-2 text-center">User</th>
            <th className="lg:px-4 py-2 text-center">Partner</th>
            <th className="lg:px-4 py-2 text-center">Location</th>
            <th className="lg:px-4 py-2 text-center">Note</th>
            <th className="lg:px-4 py-2 text-center">Total Items</th>
            <th className="lg:px-4 py-2 text-center">Status</th>
            <th className="lg:px-4 py-2 text-center">Tax Total</th>
            <th className="lg:px-4 py-2 text-center">Total</th>
            <th className="lg:px-4 py-2 text-center">Action</th>
            <th className="lg:px-4 py-2 text-center"></th>
          </tr>

          <tbody className="w-full space-y-10 bg-slate-300">
            {currentPurchase.length > 0 ? (
              currentPurchase
                .filter(
                  (item) =>
                    searchItems.toLowerCase() === "" ||
                    (item.partner &&
                      item.partner.name &&
                      item.partner.name.toLowerCase().includes(searchItems))
                )
                .map((sale) => (
                  <tr
                    key={sale.id}
                    className="hover:bg-blue-100 odd:bg-white even:bg-slate-200 mt-3 w-full"
                  >
                    <td className="lg:px-4 py-2 text-center">
                      {format(new Date(sale.orderDate), "yyyy-MM-dd")}
                    </td>

                    <td className="lg:px-4 py-2 text-center">
                      {sale.user && sale.user.username
                        ? sale.user.username
                        : "no have"}
                    </td>
                    <td className="lg:px-4 py-2 text-center">
                      {sale.partner && sale.partner.name
                        ? sale.partner.name
                        : "nohave"}
                    </td>
                    <td className="lg:px-4 py-2 text-center">
                      {sale.location && sale.location.name
                        ? sale.location.name
                        : "no have"}
                    </td>
                    <td className="lg:px-4 py-2 text-center">{sale.note}</td>
                    <td className="lg:px-4 py-2 text-center overflow-hidden whitespace-nowrap">
                      {sale.lines.length}
                    </td>
                    <td className="lg:px-4 py-2 text-center">
                      <span
                        className={`rounded-xl py-2 text-sm ${
                          sale.state == "pending"
                          ? " bg-orange-50 text-orange-700 px-6"
                          : sale.state == "deliver"
                          ? "bg-cyan-50 text-cyan-600 px-6"
                          : sale.state == "arrived"
                          ? "bg-blue-50 text-blue-600 px-6"
                          : sale.state == "confirmed"
                          ? "bg-green-50 text-green-700 px-4"
                          : ""
                        }`}
                      >
                        {sale.state}
                      </span>
                    </td>
                    <td className="lg:px-4 py-2 text-center ">
                      {sale.taxTotal}
                    </td>
                    <td className="lg:px-4 py-2 text-center">{sale.total}</td>
                    <td className="py-3 flex ml-3 lg:px-4 justify-center items-center">
                      <FaEye
                        onClick={() =>
                          navigate(`/admin/purchase/detail/${sale.id}`)
                        }
                        className="text-2xl text-sky-600 BiSolidEdit hover:text-sky-900"
                      />
                    </td>
                    <td
                      className="lg:px-4 py-2 text-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConfirm(sale.id);
                      }}
                    >
                      {sale.state === "pending" && (
                        <button className="px-4 py-2 ml-2 text-white text-sm text-bold bg-blue-700  rounded-md hover:opacity-75">
                          confirm
                        </button>
                      )}
                    </td>
                  </tr>
                ))
            ) : (
              <div className="w-full mx-auto absolute mt-40 flex justify-center items-center">
                {loading && (
                  <FadeLoader
                    color={"#0284c7"}
                    loading={loading}
                    size={10}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                )}
              </div>
            )}
          </tbody>
          <div className=" w-96 z-50 fixed top-40 bottom-0 left-0 right-0 mx-auto">
            {confrimShowBox && (
              <ConfrimBox close={closeBox} comfirmHandle={changeConfirmOrder} />
            )}
          </div>
        </table>
      </div>
      {/* Filter Box */}
      {showFilter && (
        <div
          className={`w-96 filter-box bg-slate-50 h-screen  fixed  top-0  p-4 z-50 transform transition-all ease-in-out duration-700 ${
            showFilter ? "right-0" : "right-[-384px]"
          }`}
        >
          <div className="flex justify-between my-6 items-center">
            <h2 className="text-xl font-bold text-slate-700">
              Filter Sale Order
            </h2>
            <MdClear
              onClick={() => setShowFilter(!showFilter)}
              className="text-2xl font-semibold text-slate-600 hover:opacity-70"
            />
          </div>
          <div>
            <div className="my-3 flex flex-col">
              <label className="text-lg my-2 text-slate-600 font-semibold">
                OrderDate
              </label>
              <input
                type="text"
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full rounded-md py-2 px-3 border-2 border-blue-300"
                placeholder="Search By order-date"
              />
            </div>
            <div className="my-3 flex flex-col">
              <label className="text-lg my-2 text-slate-600 font-semibold">
                User
              </label>
              <input
                type="text"
                onChange={(e) => setFilterStaff(e.target.value)}
                className="w-full rounded-md py-2 px-3 border-2 border-blue-300"
                placeholder="Search By staff name"
              />
            </div>
            <div className="my-3 flex flex-col">
              <label className="text-lg my-2 text-slate-600 font-semibold">
                Location
              </label>
              <input
                type="text"
                onChange={(e) => setFilterLocation(e.target.value)}
                className="w-full rounded-md py-2 px-3 border-2 border-blue-300"
                placeholder="Search By staff name"
              />
            </div>
            <div className="flex justify-end w-full my-4">
              {/* <button className="flex hover:opacity-70 px-4 py-2 justify-center items-center bg-blue-500 rounded-md text-white w-2/4">
                <FiFilter className="mx-1" />
                Filter
              </button> */}
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="px-4 hover:opacity-70 py-2  bg-red-500 rounded-md text-white w-full"
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
    </div>
  );
}
