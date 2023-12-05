import React, { useEffect, useState, useRef } from "react";
import { getApi, deleteMultiple, FormPostApi } from "../../Api";
import { BiSolidEdit, BiImport, BiExport } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import DeleteAlert from "../../utils/DeleteAlert";
import ClipLoader from "react-spinners/ClipLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { FaEye } from "react-icons/fa6";
import { FiFilter } from "react-icons/fi";
import { MdClear } from "react-icons/md";
import { format } from "date-fns";
import { removeData } from "../../../redux/actions";
import ReactPaginate from "react-paginate";
import { IoMdArrowRoundForward , IoMdArrowRoundBack} from "react-icons/io";

export default function PartnerAll() {
  const inputRef = useRef();

  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const itemsPerPage = 10; 
  const [currentPage, setCurrentPage] = useState(0);

  const [showFilter, setShowFilter] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);

  const [filterAddress, setFilterAddress] = useState("");
  const [filterPhone, setFilterPhone] = useState("");
  const [filterCompay, setFilterCompany] = useState("");

  const [alert, setAlert] = useState(false);
  const [searchItems, setSearchItems] = useState([]);
  const [partners, setPartners] = useState([]);

  const [loading, setLoading] = useState(false);

  const [importFile, setimportFile] = useState("");

  const importRef = useRef(null);

  const navigate = useNavigate();
  const token = useSelector((state) => state.IduniqueData);
  const dipatch = useDispatch();

  const getPartnersApi = async () => {
    setLoading(true);
    let resData = await getApi("/partner", token.accessToken);
    if (resData.message == "Token Expire , Please Login Again") {
      dipatch(removeData(null));
    }
    if (resData.status) {
      setLoading(false);
      const filteredPartners = resData.data.filter(
        (partner) =>  partner.active === true
     )
      setPartners(filteredPartners);
    } else {
      toast(resData.message);
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
      const downloadUrl = "https://80a2e3emcc.execute-api.ap-southeast-1.amazonaws.com/partner/export-excel";

      const response = await fetch(downloadUrl, requestOptions);
      console.log("res download is", response);

      if (response.ok) {
        const blob = await response.blob();
        const filename =
          response.headers.get("content-disposition") || "partner-export-data.xlsx";

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
    const sendExcelApi = await FormPostApi("/partner/import-excel", formData, token.accessToken);
    setLoading(true);
    toast(sendExcelApi.message);
    if (sendExcelApi.status) {
      setLoading(false);
      getPartnersApi();
    }
  };

  const toggleFilterBox = () => {
    setShowFilter(!showFilter);
  };

  const filteredPartner = () =>  {
    const filterPartner = partners.filter((pt) => {
      //Filter by address
      if (
        filterAddress &&
        !pt.address.toLowerCase().includes(filterAddress.toLowerCase())
      ) {
        return false;
      }
      // Filter by phone
      if (filterPhone && !pt.phone.includes(filterPhone)) {
        return false;
      }
      if (
        filterCompay &&
        !pt.isComapany.toLowerCase().includes(filterCompay.toLowerCase())
      ) {
        // Filter by company name
        return false;
      }
      return true;
    });
    return filterPartner
  }

  const toggleSelectItem = (partnerID) => {
    setSelectAll(true);
    const isSelected = selectedItems.includes(partnerID);
    if (isSelected) {
      setSelectedItems(selectedItems.filter((id) => id !== partnerID));
    } else {
      setSelectedItems([...selectedItems, partnerID]);
    }
  };
  // Handle select all items
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      const allProductIds = partners.map((product) => product.id);
      setSelectedItems(allProductIds);
    }
    setSelectAll(!selectAll);
  };

  const filterRemove = () => {
    // Clear filter criteria and update the state variable
    setFilterAddress("");
    setFilterCompany("");
    setFilterPhone("");
    setIsFilterActive(false);
  };

  const deleteCustomers = async () => {
    if (selectedItems.length === 0) {
      toast("No partners selected for deletion.");
      return;
    }

    const response = await deleteMultiple(
      "/partner",
      {
        partnerIds: selectedItems,
      },
      token.accessToken
    );

      toast("Selected partners deleted successfully.");
      setSelectedItems([]);
      setSelectAll(false);
      getPartnersApi();
    
  };
  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const filteredCus = filteredPartner(); 
  const pageCount = Math.ceil(filteredCus.length / itemsPerPage);
  const currentCustomers = filteredCus.slice(startIndex, endIndex);

  useEffect(() => {
    getPartnersApi();
    if (filterAddress || filterPhone || filterCompay) {
      setIsFilterActive(true);
    } else {
      setIsFilterActive(false);
    }
  }, [filterAddress, filterPhone, filterCompay]);
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
      <div className="flex w-full">
        <div className="flex w-full justify-between items-center">
          <div className="flex md:mr-8 justify-around cursor-pointer">
            <Link to="/admin/partners/create">
              <div className="font-bold rounded-sm shadow-sm flex items-cente text-blue-700 border-blue-500 border-2 hover:opacity-75 text-md hover:text-white hover:bg-blue-700 px-6 py-2">
                Add Partners
              </div>
            </Link>
            <div
              onClick={toggleFilterBox}
              className="rounded-sm ml-3 transition shadow-sm flex items-center text-[#4338ca] border-[#4338ca] border-2 hover:opacity-75 text-md hover:text-white hover:bg-[#4338ca] font-bold px-6 py-2"
            >
              <FiFilter className="text-xl mx-2" />
              <h4>Filter</h4>
            </div>
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
              placeholder="search partner"
              onChange={(e) => setSearchItems(e.target.value.toLowerCase())}
            />
          </div>
        </div>
      </div>
      <div className="w-full">
        <div className="flex justify-between items-center">
          <h2 className="lg:text-2xl font-bold my-4">Partners</h2>
          {isFilterActive && (
            <button
              className="bg-red-500 px-4 h-8 rounded-md text-white hover:opacity-70"
              onClick={filterRemove}
            >
              Remove Filter
            </button>
          )}
        </div>
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
        <table className="w-full">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="lg:px-4 py-2 text-center">
                <input
                  type="checkbox"
                  onChange={toggleSelectAll}
                  checked={selectAll && selectedItems.length > 0}
                />
              </th>
              <th className=" py-2 text-center">Name</th>
              <th className=" py-2 text-center">Address</th>
              <th className=" py-2 text-center">City</th>
              <th className=" py-2 text-center">Phone</th>
              <th className=" py-2 text-center">Date</th>
              <th className=" py-2 text-center">Desc</th>
              <th className=" py-2 text-center">Company</th>
              <th className=" py-2 text-center">Action</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="w-full space-y-10">
            {currentCustomers.length > 0 ? (
              currentCustomers
                .filter((item) =>
                  searchItems.toLowerCase === ""
                    ? item
                    : item.name.toLowerCase().includes(searchItems)
                )
                .map((partner) => (
                  <tr
                    key={partner.id}
                    onClick={() => toggleSelectItem(partner.id)}
                    className={`${
                      selectedItems.includes(partner.id)
                        ? "bg-[#60a5fa] text-white"
                        : "odd:bg-white even:bg-slate-200"
                    }  mb-8 w-full items-center cursor-pointer hover:text-white hover:bg-[#60a5fa]`}
                  >
                    <td className="lg:px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        onChange={() => toggleSelectItem(partner.id)}
                        checked={selectedItems.includes(partner.id)}
                      />
                    </td>
                    <td className="py-2 text-center">{partner.name}</td>
                    <td className=" py-2 text-center">{partner.address}</td>
                    <td className="py-2 text-center">{partner.city}</td>
                    <td className="py-2 text-center">{partner.phone}</td>
                    <td className="py-2 text-center">
                      {format(new Date(partner.createdAt), "yyyy-MM-dd")}
                    </td>
                    <td className="py-2 text-center">
                      {partner.isCustomer ? "Customer" : "Vendor"}
                    </td>
                    <td className="py-2 text-center">
                      {partner.isCompany ? "Yes" : "No"}
                    </td>

                    <td className="py-2 text-center">
                      <div className="flex justify-center">
                        <FaEye
                          onClick={() =>
                            navigate(`/admin/partners/detail/${partner.id}`)
                          }
                          className="text-2xl text-sky-600 hover:text-sky-900"
                        />
                        <BiSolidEdit
                          className="text-2xl mx-3 text-sky-600 hover:text-sky-900"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/partners/edit/${partner.id}`);
                          }}
                        />
                      </div>
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
          </tbody>
        </table>
      </div>
      {alert && (
        <DeleteAlert
          cancel={() => {
            setAlert(false);
            setSelectedItems([]);
          }}
          onDelete={() => {
            deleteCustomers();
            setAlert(false);
          }}
        />
      )}
      {/* Filter Box */}
      {showFilter && (
        <div
          className={`w-96 filter-box bg-slate-50 h-screen  fixed  top-0  p-4 z-40 transform transition-all ease-in-out duration-700 ${
            showFilter ? "right-0" : "right-[-384px]"
          }`}
        >
          <div className="flex justify-between my-6">
            <h2 className="text-xl font-bold text-slate-700">
              Filter Customers
            </h2>
            <MdClear
              onClick={() => setShowFilter(!showFilter)}
              className="text-2xl font-semibold text-slate-600 hover:opacity-70"
            />
          </div>
          <div>
            <div className="my-3 flex flex-col">
              <label className="text-lg my-2 text-slate-600 font-semibold">
                Address
              </label>
              <input
                type="text"
                onChange={(e) => setFilterAddress(e.target.value)}
                className="w-full rounded-md py-2 px-3 border-2 border-blue-300"
                placeholder="Search By partners address"
              />
            </div>
            <div className="my-3 flex flex-col">
              <label className="text-lg my-2 text-slate-600 font-semibold">
                Phone
              </label>
              <input
                type="text"
                onChange={(e) => setFilterPhone(e.target.value)}
                className="w-full rounded-md py-2 px-3 border-2 border-blue-300"
                placeholder="Search By client address"
              />
            </div>
            <div className="my-3 flex flex-col">
              <label className="text-lg my-2 text-slate-600 font-semibold">
                Company
              </label>
              <input
                type="text"
                onChange={(e) => setFilterCompany(e.target.value)}
                className="w-full rounded-md py-2 px-3 border-2 border-blue-300"
                placeholder="Search By client address"
              />
            </div>
            <div className="flex justify-between w-full my-4">
              {/* <button className="flex hover:opacity-70 px-4 py-2 justify-center items-center bg-blue-500 rounded-md text-white w-2/4">
                <FiFilter className="mx-1" />
                Filter
              </button> */}
              <button
                onClick={() => setShowFilter(!showFilter)}
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
