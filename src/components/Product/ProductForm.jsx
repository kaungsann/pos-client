import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../Api.js";
import { useParams } from "react-router-dom";
import { RiImageAddFill } from "react-icons/ri";
import { AiOutlinePlus } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BoxImg from "../../assets/box.png";
import { removeData } from "../../redux/actions";
import { Input, Select, SelectItem } from "@nextui-org/react";
import axios from "axios";

export default function ProductForm() {
  const [categories, setCatgs] = useState([]);
  const [isSelected, setIsSelected] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const productDoc = {
    name: "",
    ref: "",
    image: null,
    salePrice: 0,
    description: "",
    purchasePrice: 0,
    barcode: "",
    category: "",
    minStockQty: 0,
    marginProfit: 0,
    expiredAt: "",
    tax: 0,
  };
  const [product, setProduct] = useState(productDoc);

  const token = useSelector((state) => state.IduniqueData);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { id } = useParams();
  const dipatch = useDispatch();

  const inputChangeHandler = (event) => {
    const { name, value } = event.target;

    let newProduct = { ...product, [name]: value };

    if (name === "purchasePrice" || name === "marginProfit") {
      newProduct = {
        ...newProduct,
        salePrice: parseFloat(newProduct.salePrice),
        purchasePrice: parseFloat(newProduct.purchasePrice),
        marginProfit: parseFloat(newProduct.marginProfit),
      };

      newProduct.salePrice = Math.ceil(
        newProduct.purchasePrice +
          newProduct.purchasePrice * (newProduct.marginProfit / 100)
      );
    }

    setProduct(newProduct);
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();
    const updateProductEdit = async () => {
      const formData = new FormData();

      for (let key in product) {
        formData.append(key, product[key]);
      }

      try {
        const { data } = await axios.patch(
          BASE_URL + `/product/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token.accessToken}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (data?.message == "Token Expire , Please Login Again") {
          dipatch(removeData(null));
        }
        if (data.status) {
          navigate("/admin/products/all");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    updateProductEdit();
  };

  const handleFileInputChange = (event) => {
    const selectedFile = event.target.files[0];

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target.result);
    };

    if (selectedFile) {
      setIsSelected(true);
      reader.readAsDataURL(selectedFile);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await axios.get(BASE_URL + `/category`, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (data?.message == "Token Expire , Please Login Again") {
        dipatch(removeData(null));
      }
      setCatgs(data.data);
    };

    const fetchProducts = async () => {
      const { data } = await axios.get(BASE_URL + `/product/${id}`, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (data?.message == "Token Expire , Please Login Again") {
        dipatch(removeData(null));
      }

      // Change product format from API response to match upload format
      const updateProduct = {
        ...productDoc,
        ...Object.fromEntries(
          Object.entries(data.data[0]).filter(([key]) =>
            Object.prototype.hasOwnProperty.call(productDoc, key)
          )
        ),
      };

      (updateProduct.category = updateProduct.category._id),
        setProduct({ ...product, ...updateProduct });
    };

    const fetchData = async () => {
      try {
        await fetchProducts();
        await fetchCategories();
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchData();
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
        style={{ width: "450px" }}
      />
      <div className="flex gap-3 my-5">
        <button
          type="submit"
          className="font-bold rounded-sm shadow-sm flex items-center text-blue-700 border-blue-500 border-2 hover:opacity-75 text-sm hover:text-white hover:bg-blue-700 px-3 py-1.5"
          onClick={onSubmitHandler}
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
        <h2 className="lg:text-xl font-bold my-2">Product Edit</h2>
        <div className="container bg-white p-5 rounded-lg max-w-6xl">
          <form className="flex justify-between gap-10 p-5">
            <div>
              <div className="relative w-36 h-36 mt-4 flex justify-center items-center p-8 bg-white border-2 rounded-md shadow-md">
                <RiImageAddFill className=" text-slate-400 text-6xl" />
                {isSelected ? (
                  <img
                    src={selectedImage}
                    className="absolute object-cover w-full h-full"
                  />
                ) : product?.image ? (
                  <img
                    src={product?.image}
                    alt={product.name}
                    className="absolute object-cover w-full h-full"
                  />
                ) : (
                  <img
                    src={BoxImg}
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
                  label="Name"
                  name="name"
                  value={product.name}
                  // color={isInvalid ? "danger" : "success"}
                  // errorMessage={isInvalid && "Please enter a valid email"}
                  onChange={(e) => inputChangeHandler(e)}
                  placeholder="Enter product name..."
                  labelPlacement="outside"
                />
              </div>
              <div className="w-60">
                <Input
                  type="text"
                  name="ref"
                  label="Product Ref"
                  value={product.ref}
                  onChange={(e) => inputChangeHandler(e)}
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
                  selectedKeys={product.category ? [product.category] : false}
                  onChange={(e) => inputChangeHandler(e)}
                  className="max-w-xs"
                >
                  {categories.map((ct) => (
                    <SelectItem key={ct.id} value={ct.id}>
                      {ct.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <div className="w-60">
                <Input
                  type="text"
                  isDisabled
                  name="barcode"
                  label="Barcode"
                  value={product.barcode}
                  placeholder="Enter barcode..."
                  labelPlacement="outside"
                />
              </div>
              <div className="w-60">
                <span className="text-sm">Expired Date</span>
                <Input
                  type="date"
                  name="expiredAt"
                  labelPlacement="outside"
                  value={
                    product.expiredAt
                      ? new Date(product.expiredAt).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) => inputChangeHandler(e)}
                />
              </div>
              <div className="w-60">
                <Input
                  type="text"
                  name="description"
                  label="Description"
                  value={product.description}
                  onChange={(e) => inputChangeHandler(e)}
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
                  value={product.tax}
                  placeholder="0.00"
                  labelPlacement="outside"
                  onChange={(e) => inputChangeHandler(e)}
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
                  value={product.minStockQty}
                  label="Min-stock Quantity"
                  placeholder="0.00"
                  labelPlacement="outside"
                  onChange={(e) => inputChangeHandler(e)}
                />
              </div>
              <div className="w-60">
                <Input
                  type="number"
                  required
                  name="purchasePrice"
                  label="Cost"
                  value={product.purchasePrice}
                  placeholder="0.00"
                  labelPlacement="outside"
                  endContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">$</span>
                    </div>
                  }
                  onChange={(e) => inputChangeHandler(e)}
                />
              </div>
              <div className="w-60">
                <Input
                  type="number"
                  name="marginProfit"
                  required
                  label="Margin Profit"
                  value={product.marginProfit}
                  placeholder="0.00"
                  labelPlacement="outside"
                  endContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">$</span>
                    </div>
                  }
                  onChange={(e) => inputChangeHandler(e)}
                />
              </div>
              <div className="w-60">
                <Input
                  type="number"
                  isDisabled
                  label="Price"
                  value={product.salePrice}
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
