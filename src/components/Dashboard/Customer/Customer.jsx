import React, { useEffect, useState, useRef } from "react";
import { getApi, deleteMultiple } from "../../Api";
import { BiSolidEdit } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import DeleteAlert from "../../utils/DeleteAlert";
import FadeLoader from "react-spinners/FadeLoader";
import { useDispatch, useSelector } from "react-redux";
import { FiFilter } from "react-icons/fi";
import { MdClear } from "react-icons/md";
import { FaEye } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from "date-fns";
import { removeData } from "../../../redux/actions";

export default function PartnerAll() {
  const inputRef = useRef();

  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [showFilter, setShowFilter] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);

  const [filterAddress, setFilterAddress] = useState("");
  const [filterPhone, setFilterPhone] = useState("");
  const [filterCompay, setFilterCompany] = useState("");

  const [alert, setAlert] = useState(false);
  const [searchItems, setSearchItems] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const token = useSelector((state) => state.IduniqueData);
  const dipatch = useDispatch();

  const getPartnersApi = async () => {
    setLoading(true);
    let resData = await getApi("/partner", token.accessToken);
    const filteredPartners = resData.data.filter(
      (partner) => partner.isCustomer === true && partner.active === true
    );

    if (resData.message == "Token Expire , Please Login Again") {
      dipatch(removeData(null));
    }
    if (resData.status) {
      setLoading(false);
      setPartners(filteredPartners);
    } else {
      setLoading(true);
    }
  };

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

  const toggleFilterBox = () => {
    setShowFilter(!showFilter);
  };

  const filterCustomer = partners.filter((pt) => {
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

  const filterRemove = () => {
    // Clear filter criteria and update the state variable
    setFilterAddress("");
    setFilterCompany("");
    setFilterPhone("");
    setIsFilterActive(false);
  };

  const deleteCustomers = async () => {
    if (selectedItems.length === 0) {
      toast("No clients selected for deletion.");
      return;
    }

    const response = await deleteMultiple(
      "/partner",
      {
        partnerIds: selectedItems,
      },
      token.accessToken
    );

    if (response.status) {
      toast("Selected clients deleted successfully.");
      setSelectedItems([]);
      setSelectAll(false);
      getPartnersApi();
    } else {
      toast("Failed to clients selected partners.");
    }
  };

  useEffect(() => {
    getPartnersApi();
    if (filterAddress || filterPhone || filterCompay) {
      setIsFilterActive(true);
    } else {
      setIsFilterActive(false);
    }
  }, [filterAddress, filterPhone, filterCompay]);

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
      <div className="flex w-full">
        <div className="flex w-full justify-between items-center">
          <div className="flex md:mr-8 justify-around">
            <Link to="/admin/partners/create">
              <div className="rounded-sm transition shadow-sm flex items-center text-[#4338ca] border-[#4338ca] border-2 hover:opacity-75 text-md hover:text-white hover:bg-[#4338ca] font-bold px-6 py-2">
                Add Customer
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
      <div className="w-full">
        <div className="flex justify-between items-center">
          <h2 className="lg:text-2xl font-bold my-4">Customers</h2>
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
              <th className=" py-2 text-center">Customer</th>
              <th className=" py-2 text-center">Company</th>
              <th className=" py-2 text-center">Action</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="w-full space-y-10">
            {filterCustomer.length > 0 ? (
              filterCustomer
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
                      {partner.isCustomer ? "Yes" : "No"}
                    </td>
                    <td className="py-2 text-center">
                      {partner.isCompany ? "Yes" : "No"}
                    </td>
                    <td className="py-2 text-center lg:px-4">
                      <div className="flex justify-center">
                        <FaEye
                          onClick={() =>
                            navigate(`/admin/partners/detail/${partner.id}`)
                          }
                          className="text-2xl text-sky-600 BiSolidEdit hover:text-sky-900"
                        />
                        <BiSolidEdit
                          className="text-2xl mx-3 text-sky-600 BiSolidEdit hover:text-sky-900"
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
              <div className="w-10/12 mx-auto absolute  mt-40 flex justify-center items-center">
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
                placeholder="Search By client address"
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
              <button className="flex hover:opacity-70 px-4 py-2 justify-center items-center bg-blue-500 rounded-md text-white w-2/4">
                <FiFilter className="mx-1" />
                Filter
              </button>
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="px-4 hover:opacity-70 py-2 ml-3 bg-red-500 rounded-md text-white w-2/4"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
