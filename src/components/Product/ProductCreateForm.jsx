import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../Api.js";
import { RiImageAddFill } from "react-icons/ri";
import { AiOutlinePlus } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BoxImg from "../../assets/box.png";
import { removeData } from "../../redux/actions";
import { Button, Input, Progress, Select, SelectItem } from "@nextui-org/react";
import axios from "axios";

export default function ProductCreateForm() {
  const [categories, setCatgs] = useState([]);
  const [isSelected, setIsSelected] = useState(false);
  const [selectFile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const productDoc = {
    name: "",
    ref: "",
    salePrice: 0,
    description: "",
    purchasePrice: 0,
    barcode: "",
    category: { name: "" },
    minStockQty: 0,
    marginProfit: 0,
    expiredAt: "",
    tax: 0,
  };
  const [product, setProduct] = useState(productDoc);
  const [updateProduct, setUpdateProduct] = useState({});

  const token = useSelector((state) => state.IduniqueData);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const dipatch = useDispatch();

  const generateBarCode = () => {
    const generateRandomNumber = (digits) => {
      const min = 10 ** (digits - 1);
      const max = 10 ** digits - 1;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const newBarCode = generateRandomNumber(13);
    setProduct({ ...product, barcode: newBarCode });
    setUpdateProduct({ ...updateProduct, barcode: newBarCode });
  };

  const inputChangeHandler = (event) => {
    const { name, value } = event.target;
    let newProduct = { [name]: value };

    if (name === "purchasePrice" || name === "marginProfit") {
      const { purchasePrice, marginProfit } = product;

      newProduct = {
        ...newProduct,
        salePrice:
          name === "purchasePrice"
            ? Math.ceil(
                parseFloat(value) + parseFloat(value) * (marginProfit / 100)
              )
            : Math.ceil(
                purchasePrice + purchasePrice * (parseFloat(value) / 100)
              ),
        purchasePrice:
          name === "marginProfit" ? purchasePrice : parseFloat(value),
        marginProfit:
          name === "purchasePrice" ? marginProfit : parseFloat(value),
      };
    }

    setUpdateProduct({ ...updateProduct, ...newProduct });
    setProduct({ ...product, ...newProduct });
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();
    setIsLoading(true);
    const updateProductEdit = async () => {
      const formData = new FormData();
      if (isSelected) {
        formData.append("image", selectFile);
      }

      for (let key in updateProduct) {
        formData.append(key, updateProduct[key]);
      }

      try {
        const { data } = await axios.post(BASE_URL + `/product`, formData, {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        });

        if (!data.status) {
          if (data?.message == "Token Expire , Please Login Again") {
            dipatch(removeData(null));
          }

          toast.error(message);
        } else {
          navigate("/admin/products/all");
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsSelected(false);
        setSelectedImage(null);
        setIsLoading(false);
      }
    };

    updateProductEdit();
  };

  const handleFileInputChange = (event) => {
    const selectedFile = event.target.files[0];
    setSelectedFile(selectedFile);

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
      const filteredCategory = data.data.filter((ct) => ct.active === true);

      setCatgs(filteredCategory);
    };

    const fetchData = async () => {
      try {
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
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="container mt-2">
        <div className="flex flex-row justify-between my-4 max-w-6xl">
          <h2 className="lg:text-xl font-bold ">Product Create</h2>
          <div className="flex gap-3 ">
            <Button
              type="submit"
              isDisabled={isLoading}
              isLoading={isLoading}
              className={`font-bold rounded-sm shadow-sm flex items-center bg-white text-blue-700 border-blue-500 border-2 ${
                isLoading
                  ? ""
                  : "hover:opacity-75 text-sm hover:text-white hover:bg-blue-700"
              }`}
              onClick={onSubmitHandler}
            >
              Save
            </Button>
            <Button
              isDisabled={isLoading}
              isLoading={isLoading}
              className={`rounded-sm shadow-sm flex items-center  text-red-500 border-red-500 bg-white border-2 text-sm ${
                isLoading
                  ? ""
                  : "hover:opacity-75 hover:text-white hover:bg-red-500 font-bold"
              }`}
              onClick={() => navigate("/admin/products/all")}
            >
              Discard
            </Button>
          </div>
        </div>
        <div className="container bg-white p-5 rounded-lg max-w-6xl">
          {isLoading && (
            <Progress size="sm" isIndeterminate aria-label="Loading..." />
          )}
          <form className="flex justify-between gap-10 p-5">
            <div>
              <div className="relative w-36 h-36 mt-4 flex justify-center items-center p-8 bg-white border-2 rounded-md shadow-md">
                <RiImageAddFill className=" text-slate-400 text-6xl" />
                {isSelected ? (
                  <img
                    src={selectedImage}
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
                  placeholder="Select category"
                  selectedKeys={
                    product.category
                      ? [product.category._id || product.category]
                      : false
                  }
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
                  name="barcode"
                  label="Barcode"
                  value={product.barcode}
                  placeholder="Enter barcode..."
                  labelPlacement="outside"
                  endContent={
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        generateBarCode();
                      }}
                      className="text-xs bg-blue-700 text-white hover:bg-blue-900 p-1 rounded-md"
                    >
                      Generate
                    </button>
                  }
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
