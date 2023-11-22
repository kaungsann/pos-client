import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { getApi, FormPostApi } from "../../Api";
import { RiImageAddFill } from "react-icons/ri";
import { AiOutlinePlus } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { removeData } from "../../../redux/actions";

export default function ProductsCreate() {
  const [cat, setCat] = useState([]);
  const [category, setGategory] = useState("");
  const [name, setName] = useState("");
  const [ref, setRef] = useState("");
  const [expiredate, setExpiredate] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [bar, setBar] = useState(null);
  const [stockQuantity, setStockQuantity] = useState(0);
  const [file, setFile] = useState(null);
  const [avaliable, setAAvaliable] = useState(null);
  const [isManualGenerate, setIsManualGenerate] = useState(false);
  const navigate = useNavigate();

  const [purchasePrice, setPurchasePrice] = useState(0);
  const [tax, setTax] = useState(0);

  const fileInputRef = useRef(null);
  const [select, setSelect] = useState("");
  const [profit, setProfit] = useState(0);

  // State variables for showing red borders and error messages
  const [showNameError, setShowNameError] = useState(false);
  const [showRefError, setShowRefError] = useState(false);
  const [showCatError, setShowCatError] = useState(false);
  const [showDateError, setShowDateError] = useState(false);
  const [showDescriError, setShowDescriError] = useState(false);
  const [showPriceError, setShowPriceError] = useState(false);
  const [showBarCodeError, setShowBarCodeError] = useState(false);
  const [showStockQuantity, setShowStockQuantity] = useState(false);
  const [showTax, setShowTax] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [purchaseError, setPurchaseError] = useState(false);
  const [profitError, setProfitError] = useState(false);
  const token = useSelector((state) => state.IduniqueData);
  const dipatch = useDispatch();

  const createProductApi = async () => {
    if (name.trim() === "") {
      setShowNameError(true);
    } else {
      setShowNameError(false);
    }

    if (ref.trim() === "") {
      setShowRefError(true);
    } else {
      setShowRefError(false);
    }
    if (category.trim() === "") {
      setShowCatError(true);
    } else {
      setShowCatError(false);
    }
    if (expiredate.trim() === "") {
      setShowDateError(true);
    } else {
      setShowDateError(false);
    }
    if (description.trim() === "") {
      setShowDescriError(true);
    } else {
      setShowDescriError(false);
    }
    // if (price == 0) {
    //   setShowPriceError(true);
    // } else {
    //   setShowPriceError(false);
    // }
    if (bar == 0) {
      setShowBarCodeError(true);
    } else {
      setShowBarCodeError(false);
    }
    if (select === "") {
      setImageError(true);
    } else {
      setImageError(false);
    }
    if (purchasePrice === 0) {
      setPurchaseError(true);
    } else {
      setPurchaseError(false);
    }
    if (profit === 0) {
      setProfitError(true);
    } else {
      setProfitError(false);
    }
    if (stockQuantity === 0) {
      setShowStockQuantity(true);
    } else {
      setShowStockQuantity(false);
    }
    if (tax === 0) {
      setShowTax(true);
    } else {
      setShowTax(false);
    }
    if (
      name.trim() === "" ||
      ref.trim() === "" ||
      profit == 0 ||
      purchasePrice == 0
    ) {
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", select); // Append the image file
    formData.append("description", description);
    formData.append("ref", ref);
    formData.append("barcode", bar);
    formData.append("salePrice", price);
    formData.append("category", category);
    formData.append("expiredAt", expiredate);
    formData.append("marginProfit", profit);
    formData.append("purchasePrice", purchasePrice);
    formData.append("minStockQty", stockQuantity);
    formData.append("tax", tax);
    try {
      let resData = await FormPostApi("/product", formData, token.accessToken);

      if (resData.status) {
        navigate("/admin/products/all");
      } else {
        toast(resData.message);
      }
    } catch (error) {
      toast(resData.message);
      console.error("Error creating product:", error);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    createProductApi();
  };
  const getCategory = async () => {
    const resData = await getApi("/category", token.accessToken);
    if (resData.message == "Token Expire , Please Login Again") {
      dipatch(removeData(null));
    }
    setCat(resData.data);
  };
  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };
  const handleFileInputChange = (event) => {
    const selectedFile = event.target.files[0];
    setSelect(selectedFile);
    const reader = new FileReader();
    reader.onload = (e) => {
      setFile(e.target.result);
    };

    if (selectedFile) {
      reader.readAsDataURL(selectedFile);
    }
  };

  const generateRandomNumber = (digits) => {
    const min = 10 ** (digits - 1);
    const max = 10 ** digits - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

const generateBarCode = () => {
  // Check if the barcode is already set and wasn't manually generated
  if (!bar && !isManualGenerate) {
    const newBarCode = generateRandomNumber(13);
    setBar(newBarCode);
  }
};

  useEffect(() => {
    getCategory();

    const calculatedSalePrice =
      parseFloat(purchasePrice) +
      parseFloat(purchasePrice) * (parseFloat(profit) / 100);

    setPrice(calculatedSalePrice);
  }, [purchasePrice, profit]);

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
      <div className="flex">
        <button
          type="submit"
          className="font-bold rounded-sm shadow-sm flex items-cente text-blue-700 border-blue-500 border-2 hover:opacity-75 text-md hover:text-white hover:bg-blue-700 px-6 py-2"
          onClick={handleSubmit}
        >
          Save
        </button>
        <Link to="/admin/products/all">
          <button className="rounded-sm ml-3 transition shadow-sm flex items-center text-[#4338ca] border-[#4338ca] border-2 hover:opacity-75 text-md hover:text-white hover:bg-[#4338ca] font-bold px-6 py-2">
            Discard
          </button>
        </Link>
      </div>

      <div className="mt-2">
        <div className="w-full mx-auto flex justify-center cursor-pointer flex-col">
          <h2 className="py-1 text-lg font-bold mt-2 bg-blue-600 text-white pl-4">
            Add New Product
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="flex justify-between mt-4">
          <div>
            <label className="text-md font-semibold">Product Image</label>
            <div
              className={`relative w-36 h-36 mt-4 flex justify-center items-center p-8 bg-white border-2 rounded-md shadow-md ${
                imageError ? "border-red-600" : ""
              }`}
            >
              <RiImageAddFill className=" text-slate-400 text-6xl" />
              {file && (
                <img
                  src={file}
                  className="absolute object-cover w-full h-full"
                />
              )}
            </div>
            <div
              onClick={handleFileInputClick}
              className="w-36 cursor-pointer py-1 px-2 flex justify-center items-center hover:opacity-75 rounded-md shadow-md bg-blue-600 mt-3"
            >
              <AiOutlinePlus className="text-xl text-white font-bold mr-1" />
              <input
                required
                type="file"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleFileInputChange}
              />
              <span className="text-white font-semibold text-md">Upload</span>
            </div>
          </div>
          <div className="flex flex-wrap px-8">
            <div className="w-60 mb-3 mx-8">
              <label
                className={`text-md font-semibold ${
                  showNameError ? "text-red-600" : ""
                }`}
              >
                Product Name*
              </label>
              <input
                required
                type="text"
                value={name}
                style={{ backgroundColor: "transparent" }}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-3 py-1 rounded-md border-b-2 bg-white focus:outline-none my-2 ${
                  showNameError ? "border-red-600" : "border-slate-400"
                }`}
                placeholder="Enter product name"
              />
            </div>
            <div className="w-60 mb-3 mx-8">
              <label
                className={`text-md font-semibold ${
                  showRefError ? "text-red-600" : "text-slate-600"
                }`}
              >
                Ref*
              </label>
              <input
                required
                type="text"
                style={{ backgroundColor: "transparent" }}
                value={ref}
                onChange={(e) => setRef(e.target.value)}
                className={`w-full px-3 py-1 rounded-md border-b-2 bg-white focus:outline-none my-2 ${
                  showRefError ? "border-red-600" : "border-slate-600"
                }`}
                placeholder="Enter product ref"
              />
            </div>
            <div className="w-60 mb-3 mx-8">
              <label
                className={`text-md font-semibold ${
                  showCatError ? "text-red-600" : "text-slate-600"
                }`}
              >
                Category Name*
              </label>
              <select
                required
                id="catid"
                style={{ backgroundColor: "transparent" }}
                onChange={(e) => setGategory(e.target.value)}
                className={`w-full px-3 py-1 rounded-md border-b-2 bg-white focus:outline-none my-2 ${
                  showCatError ? "border-red-600" : "border-slate-600"
                }`}
              >
                <option disabled value selected>
                  Select an option
                </option>
                {cat.length > 0 &&
                  cat.map((ct) => (
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
            <div className="w-60 mb-3 mx-8">
              <label
                className={`text-md font-semibold ${
                  showDateError ? "text-red-600" : "text-slate-600"
                }`}
              >
                Expire-Date*
              </label>
              <input
                required
                style={{ backgroundColor: "transparent" }}
                type="date"
                value={expiredate}
                onChange={(e) => setExpiredate(e.target.value)}
                className={`w-full px-3 py-1 rounded-md border-b-2 bg-white focus:outline-none my-2 ${
                  showDateError ? "border-red-600" : "border-slate-600"
                }`}
                placeholder="Enter expire-date"
              />
            </div>
            <div className="w-60 mb-3 mx-8">
              <label
                className={`text-md font-semibold ${
                  showDescriError ? "text-red-600" : "text-slate-600"
                }`}
              >
                Description*
              </label>
              <input
                required
                type="text"
                style={{ backgroundColor: "transparent" }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`w-full px-3 py-1 rounded-md border-b-2 bg-white focus:outline-none my-2 ${
                  showDescriError ? "border-red-600" : "border-slate-600"
                }`}
                placeholder="Enter product description"
              />
            </div>
            <div className="w-60 mb-3 mx-8">
              <label
                className={`text-md font-semibold ${
                  showBarCodeError ? "text-red-600" : "text-slate-600"
                }`}
              >
                BarCode*
              </label>
              <div className="w-full relative">
                <input
                  required
                  value={bar}
                  autoFocus={true}
                  onChange={(e) => {
                    setBar(e.target.value);
                    setIsManualGenerate(false);
                  }}
                  style={{ backgroundColor: "transparent" }}
                  type="text"
                  className={`w-full px-3 py-1 rounded-md border-b-2 bg-white focus:outline-none my-2 ${
                    showBarCodeError ? "border-red-600" : "border-slate-600"
                  }`}
                />
                <button
                       onClick={(e) => {
                        e.preventDefault()
                        setIsManualGenerate(true);
                        generateBarCode();
                      }}
                  className="text-sm absolute right-0 bottom-4 bg-zinc-600 text-white shadow-mdtext-white hover:bg-zinc-800 p-1"
                >
                  generate
                </button>
              </div>
            </div>
            <div className="w-60 mb-3 mx-8">
              <label
                className={`text-md font-semibold ${
                  showTax ? "text-red-600" : "text-slate-600"
                }`}
              >
                Tax*
              </label>
              <input
                required
                value={tax}
                style={{ backgroundColor: "transparent" }}
                type="number"
                onChange={(e) => setTax(e.target.value)}
                className={`w-full px-3 py-1 rounded-md border-b-2 bg-white focus:outline-none my-2 ${
                  showTax ? "border-red-600" : "border-slate-600"
                }`}
                placeholder="Enter product stock quantity"
              />
            </div>

            <div className="w-60 mb-3 mx-8">
              <label
                className={`text-md font-semibold ${
                  showStockQuantity ? "text-red-600" : "text-slate-600"
                }`}
              >
              Minium  Stock Quantity*
              </label>
              <input
                required
                value={stockQuantity}
                type="number"
                style={{ backgroundColor: "transparent" }}
                onChange={(e) => setStockQuantity(e.target.value)}
                className={`w-full px-3 py-1 rounded-md border-b-2 bg-white focus:outline-none my-2 ${
                  showStockQuantity ? "border-red-600" : "border-slate-600"
                }`}
                placeholder="Enter product stock quantity"
              />
            </div>
            <div className="w-60 mb-3 mx-8 ">
              <label className="text-md font-semibold text-slate-600">
                AvaliableInPos*
              </label>
              <select
                id="payment"
                required
                style={{ backgroundColor: "transparent" }}
                className="w-full px-3 py-1 rounded-md border-b-2 border-slate-400 bg-white focus:outline-none my-2"
                value={avaliable}
                onChange={(e) => setAAvaliable(e.target.value)}
              >
                <option value="true" className="py-2">
                  true
                </option>
                <option value="false" className="py-2">
                  false
                </option>
              </select>
            </div>

            <div className="w-60 mb-3 mx-8">
              <label
                className={`text-md font-semibold ${
                  purchaseError ? "text-red-600" : "text-slate-600"
                }`}
              >
                Purchase Price*
              </label>
              <input
                required
                value={purchasePrice}
                style={{ backgroundColor: "transparent" }}
                type="number"
                onChange={(e) => setPurchasePrice(e.target.value)}
                className={`w-full px-3 py-1 rounded-md border-b-2 bg-white focus:outline-none my-2 ${
                  purchaseError ? "border-red-600" : "border-slate-600"
                }`}
                placeholder="Enter product stock quantity"
              />
            </div>
            <div className="w-60 mb-3 mx-8">
              <label
                className={`text-md font-semibold ${
                  profitError ? "text-red-600" : "text-slate-600"
                }`}
              >
                Margin Profit*
              </label>
              <input
                required
                value={profit}
                style={{ backgroundColor: "transparent" }}
                type="number"
                onChange={(e) => setProfit(e.target.value)}
                className={`w-full px-3 py-1 rounded-md border-b-2 bg-white focus:outline-none my-2 ${
                  profitError ? "border-red-600" : "border-slate-600"
                }`}
                placeholder="Enter product stock quantity"
              />
            </div>
            <div className="w-60 mb-3 mx-8">
              <label
                className={`text-md font-semibold ${
                  showPriceError ? "text-red-600" : "text-slate-600"
                }`}
              >
                Sale Price*
              </label>
              <input
                required
                value={price}
                type="number"
                style={{ backgroundColor: "transparent" }}
                className={`w-full px-3 py-1 rounded-md border-b-2 bg-white focus:outline-none my-2 ${
                  showPriceError ? "border-red-600" : "border-slate-600"
                }`}
                placeholder="Enter product stock quantity"
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
