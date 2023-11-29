import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getApi, FormPathApi } from "../../Api";
import { useParams } from "react-router-dom";
import { RiImageAddFill } from "react-icons/ri";
import { AiOutlinePlus } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { removeData } from "../../../redux/actions";

export default function ProductsEdit() {
  const [cat, setCat] = useState([]);
  const [category, setGategory] = useState("");
  const [name, setName] = useState("");
  const [ref, setRef] = useState("");
  const [expiredate, setExpiredate] = useState("");
  const [description, setDescription] = useState("");
  const [bar, setBar] = useState(0);
  const [price, setPrice] = useState(null);
  const [tax, setTax] = useState(null);
  const [stockQuantity, setStockQuantity] = useState(null);
  const [catName, setCatName] = useState("");
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [updatePrice, setUpdatePrice] = useState(null);
  const token = useSelector((state) => state.IduniqueData);

  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const [profit, setProfit] = useState(null);
  const [purchasePrice, setPurchasePrice] = useState(null);

  const { id } = useParams();
  const dipatch = useDispatch();

  const SingleProductApi = async () => {
    let resData = await getApi(`/product/${id}`, token.accessToken);
    setRef(resData.data[0].ref);
    setName(resData.data[0].name);
    setDescription(resData.data[0].description);
    if (resData.data[0].expiredAt) {
      setExpiredate(resData.data[0].expiredAt);
    }
    setPurchasePrice(resData.data[0].purchasePrice);
    setProfit(resData.data[0].marginProfit);
    setPrice(resData.data[0].salePrice);
    setRef(resData.data[0].ref);
    setBar(resData.data[0].barcode);
    setCatName(resData.data[0].category?.name);
    setImage(resData.data[0]?.image);
    setTax(resData.data[0]?.tax);
    setStockQuantity(resData.data[0].minStockQty);
  };

  console.log("ur chase rice is of", purchasePrice);

  const createProductApi = async () => {
    const formData = new FormData();
    
    if (name) {
      formData.append("name", name);
    }
    if (ref) {
      formData.append("ref", ref);
    }
    if (expiredate) {
      formData.append("expiredAt", expiredate);
    }
    if (file) {
      formData.append("image", file);
    }
    if (description) {
      formData.append("description", description);
    }
    if (bar) {
      formData.append("barcode", bar);
    }
    if (category) {
      formData.append("category", category);
    }
    if (updatePrice) {
      formData.append("salePrice", updatePrice);
    }
    if (purchasePrice) {
      formData.append("purchasePrice", purchasePrice);
    }
    if (profit) {
      formData.append("marginProfit", profit);
    }
    if (tax) {
      formData.append("tax", tax);
    }
    if (stockQuantity) {
      formData.append("minStockQty", stockQuantity);
    }

    let resData = await FormPathApi(
      `/product/${id}`,
      formData,
      token.accessToken
    );
  
    if (resData.message === "Token Expire , Please Login Again") {
      dipatch(removeData(null));
    }
    console.log(" data is res roduct", resData);
    if (resData.status) {
      console.log("edit res data is" , resData)
      navigate("/admin/products/all");
    } else {
      toast(resData.message);
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
    if (resData.status) {
      setCat(resData.data);
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleFileInputChange = (event) => {
    console.log("File input changed");
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target.result);
    };

    if (selectedFile) {
      reader.readAsDataURL(selectedFile);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getCategory();
      await SingleProductApi();
    };

    fetchData();
  }, []);

  useEffect(() => {
    const calculatedSalePrice =
      parseFloat(purchasePrice) +
      parseFloat(purchasePrice) * (parseFloat(profit) / 100);
    setUpdatePrice(calculatedSalePrice);
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
            Edit Product
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="flex justify-between mt-4 ">
          <div>
            <label className="text-md font-semibold">Product Image</label>
            <div className="relative w-36 h-36 mt-4 flex justify-center items-center p-8 bg-white border-2 rounded-md shadow-md">
              <RiImageAddFill className=" text-slate-400 text-6xl" />
              {file ? (
                <img src={selectedImage} className="absolute object-cover w-full h-full" />
              ) : (
                <img
                  src={image}
                  className="absolute object-cover w-full h-full"
                />
              )}
            </div>
            <div
              onClick={handleFileInputClick}
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
          <div className="flex flex-wrap px-8">
            <div className="w-60 mx-8 mb-3">
              <label className="text-md font-semibold">Product Name*</label>
              <input
                type="text"
                value={name}
                style={{ backgroundColor: "transparent" }}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-1 rounded-md border-b-2 border-slate-400 bg-white focus:outline-none my-2"
                placeholder="Enter product name"
              />
            </div>
            <div className="w-60 mx-8 mb-3">
              <label className="text-md font-semibold">Ref*</label>
              <input
                type="text"
                value={ref}
                style={{ backgroundColor: "transparent" }}
                onChange={(e) => setRef(e.target.value)}
                className="w-full px-3 py-1 rounded-md border-b-2 border-slate-400 bg-white focus:outline-none my-2"
                placeholder="Enter product Ref"
              />
            </div>
            <div className="w-60 mx-8 mb-3">
              <label className="text-md font-semibold">Category Name*</label>
              <select
                id="catid"
                value={category ? category : catName}
                onChange={(e) => setGategory(e.target.value)}
                style={{ backgroundColor: "transparent" }}
                className="w-full px-3 py-1 rounded-md border-b-2 border-slate-400 bg-white focus:outline-none my-2"
              >
                <option selected disabled className="invisible">
                  {catName}
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
            <div className="w-60 mx-8 mb-3">
              <label className="text-md font-semibold">Barcode*</label>
              <input
                type="text"
                value={bar}
                style={{ backgroundColor: "transparent" }}
                onChange={(e) => setBar(e.target.value)}
                className="w-full px-3 py-1 rounded-md border-b-2 border-slate-400 bg-white focus:outline-none my-2"
                placeholder="Enter product Ref"
              />
            </div>
            <div className="w-60 mb-3 mx-8">
              <label className="text-md font-semibold">Expire-Date</label>
              <input
                style={{ backgroundColor: "transparent" }}
                type="date"
                value={expiredate}
                onChange={(e) => setExpiredate(e.target.value)}
                className="w-full px-3 py-1 rounded-md border-b-2 bg-white focus:outline-none my-2 border-slate-600"
                placeholder="Enter expire-date"
              />
            </div>
            <div className="w-60 mx-8 mb-3">
              <label className="text-md font-semibold">Description*</label>
              <input
                type="text"
                value={description}
                style={{ backgroundColor: "transparent" }}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-1 rounded-md border-b-2 border-slate-400 bg-white focus:outline-none my-2"
                placeholder="Enter product description"
              />
            </div>

            <div className="w-60 mb-3 mx-8">
              <label className="text-md font-semibold">Tax*</label>
              <input
                required
                value={tax}
                style={{ backgroundColor: "transparent" }}
                type="number"
                onChange={(e) => setTax(e.target.value)}
                className="w-full px-3 py-1 rounded-md border-b-2 border-slate-400 bg-white focus:outline-none my-2"
                placeholder="Enter product stock quantity"
              />
            </div>

            <div className="w-60 mb-3 mx-8">
              <label className="text-md font-semibold">
                Minium Stock Quantity*
              </label>
              <input
                required
                value={stockQuantity}
                type="number"
                style={{ backgroundColor: "transparent" }}
                onChange={(e) => setStockQuantity(e.target.value)}
                className="w-full px-3 py-1 rounded-md border-b-2 border-slate-400 bg-white focus:outline-none my-2"
                placeholder="Enter product stock quantity"
              />
            </div>

            {/* <div className="w-60 mx-8 mb-3">
              <label className="text-md font-semibold">AvaliableInPos*</label>

              <select
                id="payment"
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
            </div> */}
            <div className="w-60 mb-3 mx-8">
              <label className="text-md font-semibold">PurchasePrice*</label>
              <input
                required
                value={purchasePrice}
                type="number"
                style={{ backgroundColor: "transparent" }}
                onChange={(e) => setPurchasePrice(e.target.value)}
                className="w-full px-3 py-1 rounded-md border-b-2 border-slate-400 bg-white focus:outline-none my-2"
                placeholder="Enter product stock quantity"
              />
            </div>
            <div className="w-60 mb-3 mx-8">
              <label className="text-md font-semibold">Margin Profit*</label>
              <input
                required
                value={profit}
                style={{ backgroundColor: "transparent" }}
                type="number"
                onChange={(e) => setProfit(e.target.value)}
                className="w-full px-3 py-1 rounded-md border-b-2 border-slate-400 bg-white focus:outline-none my-2"
                placeholder="Enter product stock quantity"
              />
            </div>
            <div className="w-60 mb-3 mx-8">
              <label className="text-md font-semibold">Sale Price*</label>
              <input
                required
                value={updatePrice ? updatePrice : price}
                type="number"
                style={{ backgroundColor: "transparent" }}
                className="w-full px-3 py-1 rounded-md border-b-2 border-slate-400 bg-white focus:outline-none my-2"
                placeholder="Enter product stock quantity"
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
