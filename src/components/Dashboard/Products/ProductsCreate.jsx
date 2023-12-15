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
import { Input, Select, SelectItem } from "@nextui-org/react";

export default function ProductsCreate() {
  const [cat, setCat] = useState([]);
  const [category, setGategory] = useState("");
  const [name, setName] = useState("");
  const [ref, setRef] = useState("");
  const [expiredate, setExpiredate] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(null);
  const [bar, setBar] = useState(null);
  const [stockQuantity, setStockQuantity] = useState(0);
  const [file, setFile] = useState(null);
  const [isManualGenerate, setIsManualGenerate] = useState(false);
  const navigate = useNavigate();

  const [purchasePrice, setPurchasePrice] = useState(null);
  const [tax, setTax] = useState(0);

  const fileInputRef = useRef(null);
  const [select, setSelect] = useState(null);
  const [profit, setProfit] = useState(0);

  // State variables for showing red borders and error messages
  const [showNameError, setShowNameError] = useState(false);
  const [showPriceError, setShowPriceError] = useState(false);
  const [showBarCodeError, setShowBarCodeError] = useState(false);

  const [purchaseError, setPurchaseError] = useState(false);
  const token = useSelector((state) => state.IduniqueData);
  const dipatch = useDispatch();

  const createProductApi = async () => {
    if (name.trim() === "") {
      setShowNameError(true);
    } else {
      setShowNameError(false);
    }
    if (bar == null) {
      setShowBarCodeError(true);
    } else {
      setShowBarCodeError(false);
    }
    if (purchasePrice === null) {
      setPurchaseError(true);
    } else {
      setPurchaseError(false);
    }

    const formData = new FormData();
    formData.append("name", name);

    formData.append("purchasePrice", purchasePrice);
    formData.append("salePrice", price);
    if (select) {
      formData.append("image", select); // Append the image file
    }
    if (bar) {
      formData.append("barcode", bar);
    }
    if (description) {
      formData.append("description", description);
    }
    if (ref) {
      formData.append("ref", ref);
    }
    if (category) {
      formData.append("category", category);
    }
    if (expiredate) {
      formData.append("expiredAt", expiredate);
    }
    if (profit) {
      formData.append("marginProfit", profit);
    }
    if (stockQuantity) {
      formData.append("minStockQty", stockQuantity);
    }
    if (tax) {
      formData.append("tax", tax);
    }

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
    const filteredCategory = resData.data.filter((ct) => ct.active === true);
    setCat(filteredCategory);
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
    } else {
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
      <div className="flex gap-3 my-5">
        <button
          type="submit"
          className="font-bold rounded-sm shadow-sm flex items-center text-blue-700 border-blue-500 border-2 hover:opacity-75 text-sm hover:text-white hover:bg-blue-700 px-3 py-1.5"
          onClick={handleSubmit}
        >
          Save
        </button>
        <Link to="/admin/products/all">
          <button className="rounded-sm shadow-sm flex items-center  text-red-500 border-red-500 bg-white border-2 hover:opacity-75 text-sm hover:text-white hover:bg-red-500 font-bold px-3 py-1.5">
            Discard
          </button>
        </Link>
      </div>

      <div className="container mt-2">
        <h2 className="lg:text-xl font-bold my-2">Product Create</h2>
        <div className="container bg-white p-5 rounded-lg max-w-6xl">
          <form className="flex justify-between gap-10 p-5">
            <div>
              <div className="relative w-36 h-36 mt-4 flex justify-center items-center p-8 bg-white border-2 rounded-md shadow-md">
                <RiImageAddFill className=" text-slate-400 text-6xl" />
                {file && (
                  <img
                    src={file}
                    className="absolute object-cover w-full h-full"
                  />
                )}
              </div>
              <div
                onClick={() => {
                  fileInputRef.current.click();
                }}
                className="w-36 cursor-pointer py-1.5 px-2 flex justify-center items-center hover:opacity-75 rounded-md shadow-md bg-blue-600 mt-3"
              >
                <AiOutlinePlus className="text-xl text-white font-bold mr-1" />
                <input
                  type="file"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                />
                <span className="text-white font-semibold text-md">Upload</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-8">
              <div className="w-60">
                <Input
                  type="text"
                  label="Product Name"
                  name="name"
                  value={name}
                  // color={isInvalid ? "danger" : "success"}
                  // errorMessage={isInvalid && "Please enter a valid email"}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter product name..."
                  labelPlacement="outside"
                />
              </div>
              <div className="w-60">
                <Input
                  type="text"
                  name="ref"
                  label="Product Ref"
                  value={ref}
                  onChange={(e) => setRef(e.target.value)}
                  placeholder="Enter reference..."
                  labelPlacement="outside"
                />
              </div>
              <div className="w-60">
                <Select
                  labelPlacement="outside"
                  label="Category"
                  name="category"
                  placeholder="Select an category"
                  onChange={(e) => setGategory(e.target.value)}
                  className="max-w-xs"
                >
                  {cat.map((ct) => (
                    <SelectItem key={ct.id} value={ct.id}>
                      {ct.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <div className="w-60   relative">
                <Input
                  type="text"
                  isDisabled
                  name="barcode"
                  label="Barcode"
                  value={bar}
                  placeholder="Enter barcode..."
                  labelPlacement="outside"
                />

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setIsManualGenerate(true);
                    generateBarCode();
                  }}
                  className="text-sm absolute right-4 bottom-1 bg-zinc-600 text-white shadow-mdtext-white hover:bg-zinc-800 p-1"
                >
                  generate
                </button>
              </div>
              <div className="w-60">
                <span className="text-sm">Expired Date</span>
                <Input
                  type="date"
                  name="expiredAt"
                  labelPlacement="outside"
                  value={expiredate}
                  onChange={(e) => setExpiredate(e.target.value)}
                />
              </div>
              <div className="w-60">
                <Input
                  type="text"
                  name="description"
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter description..."
                  labelPlacement="outside"
                />
              </div>
              <div className="w-60">
                <Input
                  type="number"
                  required
                  name="tax"
                  label="Tax"
                  value={tax}
                  placeholder="0.00"
                  labelPlacement="outside"
                  onChange={(e) => setTax(e.target.value)}
                  endContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">$</span>
                    </div>
                  }
                />
              </div>
              <div className="w-60">
                <Input
                  type="number"
                  required
                  name="minStockQty"
                  value={stockQuantity}
                  label="Min-stock Quantity"
                  placeholder="0.00"
                  labelPlacement="outside"
                  onChange={(e) => setStockQuantity(e.target.value)}
                />
              </div>
              <div className="w-60">
                <Input
                  type="number"
                  required
                  name="purchasePrice"
                  label="Cost"
                  value={purchasePrice}
                  placeholder="0.00"
                  labelPlacement="outside"
                  endContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">$</span>
                    </div>
                  }
                  onChange={(e) => setPurchasePrice(e.target.value)}
                />
              </div>
              <div className="w-60">
                <Input
                  type="number"
                  name="marginProfit"
                  required
                  label="Margin Profit"
                  value={profit}
                  placeholder="0.00"
                  labelPlacement="outside"
                  endContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">$</span>
                    </div>
                  }
                  onChange={(e) => setProfit(e.target.value)}
                />
              </div>
              <div className="w-60">
                <Input
                  type="number"
                  isDisabled
                  label="Sale Price"
                  value={price}
                  placeholder="0.00"
                  labelPlacement="outside"
                  endContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">$</span>
                    </div>
                  }
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
