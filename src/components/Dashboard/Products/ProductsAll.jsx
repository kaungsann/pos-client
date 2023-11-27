import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getApi, FormPostApi, deleteMultiple } from "../../Api";
import { BiSolidEdit, BiImport, BiExport } from "react-icons/bi";
import { FiFilter } from "react-icons/fi";
import { MdClear } from "react-icons/md";
import { FaEye } from "react-icons/fa6";
import { format } from "date-fns";
import DeleteAlert from "../../utils/DeleteAlert";
import FadeLoader from "react-spinners/FadeLoader";
import img from "../../../assets/product.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { removeData } from "../../../redux/actions";
import ReactPaginate from "react-paginate";
import { IoMdArrowRoundForward, IoMdArrowRoundBack } from "react-icons/io";

export default function ProductsAll() {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5; // Choose the number of items per page
  const navigate = useNavigate();

  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [filterBarcode, setFilterBarcode] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterPrice, setFilterPrice] = useState("");
  const [filterName, setFilterName] = useState("");

  const [showFilter, setShowFilter] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false); // Track if any filter is active

  const [products, setProducts] = useState([]);
  const [alert, setAlert] = useState(false);

  const [loading, setLoading] = useState(false);
  const [categorys, setCategorys] = useState([]);

  const [importFile, setimportFile] = useState(null);

  const importRef = useRef(null);

  const userData = useSelector((state) => state.loginData);
  const token = useSelector((state) => state.IduniqueData);
  const dipatch = useDispatch();

  const productApi = async () => {
    setLoading(true);
    let resData = await getApi("/product", token.accessToken);
    if (resData.message == "Token Expire , Please Login Again") {
      dipatch(removeData(null));
    }
    const filteredProduct = resData.data.filter((pd) => pd.active === true);
    console.log("data is a", resData);
    if (resData.status) {
      setLoading(false);
      setProducts(filteredProduct);
    } else {
      setLoading(true);
    }
  };

  const categoryApi = async () => {
    let resData = await getApi("/category", token.accessToken);
    if (resData.message == "Token Expire , Please Login Again") {
      dipatch(removeData(null));
    }
    setCategorys(resData.data);
  };

  const editRoute = (id) => {
    navigate(`/admin/products/edit/${id}`);
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
      const downloadUrl = "http://3.0.102.114/product/export-excel";

      const response = await fetch(downloadUrl, requestOptions);

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
    formData.append("excel", selectedFile);
    const sendExcelApi = await FormPostApi(
      "/product/import-excel",
      formData,
      token.accessToken
    );
    setLoading(true);
    toast(sendExcelApi.message);
    if (sendExcelApi.status) {
      setLoading(false);
      productApi();
    }
  };

  // Handle individual item selection
  const toggleSelectItem = (productId) => {
    setSelectAll(true);
    const isSelected = selectedItems.includes(productId);
    if (isSelected) {
      setSelectedItems(selectedItems.filter((id) => id !== productId));
    } else {
      setSelectedItems([...selectedItems, productId]);
    }
  };

  // Handle select all items
  const toggleSelectAll = () => {
    if (selectedItems.length == 0) {
      setSelectAll(false);
    }
    if (selectAll) {
      // If Select All is checked, uncheck all items in the filtered tbody
      setSelectedItems([]);
    } else {
      const allProductIds = filteredProducts.map((product) => product.id);
      setSelectedItems(allProductIds);
    }
    setSelectAll(!selectAll);
  };

  // Toggle filter box visibility
  const toggleFilterBox = () => {
    setShowFilter(!showFilter);
  };

  // ...

  const filterProducts = () => {
    const filteredProducts = products.filter((product) => {
      // Filter by name
      if (
        filterName &&
        !product.name.toLowerCase().includes(filterName.toLowerCase())
      ) {
        return false;
      }

      // Filter by barcode
      if (filterBarcode && !product.barcode.includes(filterBarcode)) {
        return false;
      }

      // Filter by category
      if (filterCategory) {
        if (product.category) {
          if (product.category._id !== filterCategory) {
            return false;
          }
        } else {
          return false;
        }
      }

      // Filter by price
      if (
        filterPrice &&
        parseFloat(product?.salePrice) !== parseFloat(filterPrice)
      ) {
        return false;
      }

      return true;
    });

    return filteredProducts;
  };

  const filterRemove = () => {
    // Clear filter criteria and update the state variable
    setFilterBarcode("");
    setFilterCategory("");
    setFilterPrice("");
    setIsFilterActive(false);
  };

  const deleteProducts = async () => {
    if (selectedItems.length === 0) {
      toast("No products selected for deletion.");
      return;
    }

    const response = await deleteMultiple(
      "/product",
      {
        productIds: selectedItems,
      },
      token.accessToken
    );
    console.log("response data delete  is ", response);

    if (response.status) {
      toast("Selected products deleted successfully.");
      setSelectedItems([]);
      setSelectAll(false);
      productApi();
    } else {
      toast("Failed to delete selected products.");
    }
  };

  const handleFilterButtonClick = () => {
    const filteredProducts = filterProducts();
    setProducts(filteredProducts);
    // Update other state variables as needed
    setIsFilterActive(true);
    setCurrentPage(0); // Reset the current page to 0 after filtering
  };

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const filteredProducts = filterProducts(); // Add this line to get the filtered products
  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  useEffect(() => {
    productApi();
    categoryApi();

    if (filterBarcode || filterCategory || filterPrice) {
      setIsFilterActive(true);
    } else {
      setIsFilterActive(false);
    }
  }, [filterBarcode, filterCategory, filterPrice]);

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

      <div className="flex cursor-pointer">
        <div className="flex w-full justify-between items-center">
          <div className="flex md:mr-8 justify-around">
            <Link to="/admin/products/create">
              <div className="font-bold rounded-sm shadow-sm flex items-cente text-blue-700 border-blue-500 border-2 hover:opacity-75 text-md hover:text-white hover:bg-blue-700 px-6 py-2">
                Add
              </div>
            </Link>
            <div
              onClick={toggleFilterBox}
              className="rounded-sm ml-3 transition-transform transform shadow-sm flex items-center text-[#4338ca] border-[#4338ca] border-2 hover:opacity-75 text-md hover:text-white hover:bg-[#4338ca] font-bold px-6 py-2"
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
            <div className="rounded-sm shadow-sm flex items-center text-[#15803d] border-[#15803d] border-2 hover:opacity-75 text-md hover:text-white hover:bg-green-700 font-bold px-6 py-2">
              <input
                type="file"
                ref={importRef}
                style={{ display: "none" }}
                onChange={handleFileImportChange}
              />
              <button onClick={handleFileImportClick}>
                Import Excel
              </button>
              <BiExport className="text-xl mx-2" />
            </div>
          </div>
          <div className=" relative flex">
            <input
              type="text"
              className="px-3 py-2 w-96 md:w-72 rounded-md border-2 border-blue-500 shadow-md bg-white focus:outline-none"
              id="products"
              placeholder="search products"
              onChange={(e) => setFilterName(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <h2 className="lg:text-2xl font-bold my-4">Products</h2>
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
        <div className="flex justify-between mb-2 items-center px-2 py-2 bg-red-100 hover:opacity-70">
          <h3 className="text-orange-400 font-semibold">
            {selectedItems.length} rows selected
          </h3>
          <button
            className="bg-red-500 py-2 px-4 rounded-md hover:opacity-70 text-white"
            onClick={() => setAlert(true)}
          >
            Delete
          </button>
        </div>
      )}

      <div className="w-full">
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
              <th className="lg:px-4 py-2 text-center">Photo</th>
              <th className="lg:px-4 py-2 text-center">Name</th>
              <th className="lg:px-4 py-2 text-center">Ref</th>
              <th className="lg:px-4 py-2 text-center">Expiredate</th>
              <th className="lg:px-4 py-2 text-center">Description</th>
              <th className="lg:px-4 py-2 text-center">Barcode</th>
              <th className="lg:px-4 py-2 text-center">Price</th>
              <th className="lg:px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody className="w-full space-y-10">
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <tr
                  key={product.id}
                  onClick={() => toggleSelectItem(product.id)}
                  className={`${
                    selectedItems.includes(product.id)
                      ? "bg-[#60a5fa] text-white"
                      : "odd:bg-white even:bg-slate-200"
                  } space-y-10 mb-8 w-full items-center cursor-pointer hover:text-white hover:bg-[#60a5fa]`}
                >
                  <td className="lg:px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      onChange={() => toggleSelectItem(product.id)}
                      checked={selectedItems.includes(product.id)}
                    />
                  </td>
                  <td className="lg:px-4 py-2 text-center">
                    <img
                      src={product.image ? product.image : img}
                      className="w-10 h-10 rounded-md shadow-md mx-auto text-center"
                    />
                  </td>
                  <td className="lg:px-4 py-2 text-center">{product.name}</td>
                  <td className="lg:px-4 py-2 text-center">
                    {product.ref ? product.ref : "none"}
                  </td>
                  <td className="lg:px-4 py-2 text-center">
                    {product.expiredAt ? format(new Date(product.expiredAt), "yyyy-MM-dd") : "none"}
                  </td>
                  <td className="lg:px-4 py-2 text-center overflow-hidden whitespace-nowrap">
                    {product.description
                      ? product.description.substring(0, 30)
                      : "none"}
                  </td>
                  <td className="lg:px-4 py-2 text-center ">
                    {product.barcode ? product.barcode : "none"}
                  </td>
                  <td className="lg:px-4 py-2 text-center">
                    {product.salePrice ? product.salePrice : "none"}
                  </td>

                  <td className="py-2 lg:px-4 mx-auto">
                    <div className="flex justify-center">
                      <FaEye
                        onClick={() =>
                          navigate(`/admin/products/detail/${product.id}`)
                        }
                        className="text-2xl text-sky-600 BiSolidEdit hover:text-sky-900"
                      />
                      <BiSolidEdit
                        className="text-2xl mx-2 text-[#5e54cd] BiSolidEdit hover:text-[#2c285f]"
                        onClick={(e) => {
                          e.stopPropagation();
                          editRoute(product.id);
                        }}
                      />
                    </div>
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
        </table>
        {alert && (
          <DeleteAlert
            cancel={() => {
              setAlert(false);
              setSelectedItems([]);
            }}
            onDelete={() => {
              deleteProducts();
              setAlert(false);
            }}
          />
        )}
      </div>

      {/* Filter Box */}
      {showFilter ? (
        <div
          className={`w-96 bg-slate-50 h-screen fixed top-0 right-0 p-4 z-50 transition-transform transform ${
            showFilter ? "translate-x-0" : "-translate-x-full"
          }ease-in-out duration-700`}
        >
          <div className="flex justify-between my-6">
            <h2 className="text-xl font-bold text-slate-700">
              Filter Products
            </h2>
            <MdClear
              onClick={() => setShowFilter(!showFilter)}
              className="text-2xl font-semibold text-slate-600 hover:opacity-70"
            />
          </div>
          <div>
            <div className="my-3 flex flex-col">
              <label className="text-lg my-2 text-slate-600 font-semibold">
                BarCode
              </label>
              <input
                type="text"
                onChange={(e) => setFilterBarcode(e.target.value)}
                className="w-full rounded-md py-2 px-3 border-2 border-blue-300"
                placeholder="Search By barcode"
              />
            </div>
            <div className="my-3 flex flex-col">
              <label className="text-lg my-2 text-slate-600 font-semibold">
                Category Name
              </label>

              <select
                required
                id="catid"
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full rounded-md py-2 px-3 border-2 border-blue-300"
              >
                <option disabled value selected>
                  Select an option
                </option>
                {categorys.length > 0 &&
                  categorys.map((ct) => (
                    <option
                      key={ct.id}
                      value={ct.id}
                      className="hover:bg-cyan-300 hover:font-bold"
                    >
                      {ct.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="my-3 flex flex-col">
              <label className="text-lg my-2 text-slate-600 font-semibold">
                Price
              </label>
              <input
                type="text"
                onChange={(e) => setFilterPrice(e.target.value)}
                className="w-full rounded-md py-2 px-3 border-2 border-blue-300"
                placeholder="Search By Price"
              />
            </div>
            <div className="flex justify-between w-full my-4">
              {/* <button  onClick={handleFilterButtonClick} className="flex hover:opacity-70 px-4 py-2 justify-center items-center bg-blue-500 rounded-md text-white w-2/4">
                <FiFilter className="mx-1" />
                Filter
              </button> */}
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="w-full hover:opacity-70 py-2 bg-red-500 rounded-md text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      <div className="fixed bottom-20 right-3 w-96 items-center">
        <ReactPaginate
          containerClassName="pagination-container flex justify-center items-center"
          pageLinkClassName="page-link text-center"
          pageClassName="page-item"
          className="flex justify-around text-center items-center"
          activeClassName="bg-blue-500 text-white text-center"
          previousClassName="text-slate-500 font-semibold hover:text-slate-700"
          nextClassName="text-slate-500 font-semibold hover:text-slate-700"
          breakLabel={<div className="break-label">...</div>} // Custom break element with margin
          onPageChange={handlePageClick}
          pageRangeDisplayed={1}
          pageCount={pageCount}
          previousLabel={
            <div className="flex items-center text-slate-700 border-2 px-2 py-1 border-b-gray-300 bg-white">
              <IoMdArrowRoundBack className="" />
            </div>
          }
          nextLabel={
            <div className="flex items-center text-slate-700 border-2 px-2 py-1 bg-white border-b-gray-300">
              <IoMdArrowRoundForward className="" />
            </div>
          }
          forcePage={currentPage}
          renderOnZeroPageCount={null}
        />
      </div>
    </div>
  );
}
