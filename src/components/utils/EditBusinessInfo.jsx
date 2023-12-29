import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormPathApi, getApi } from "../Api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MoonLoader from "react-spinners/MoonLoader";
import { RiImageAddFill } from "react-icons/ri";
import { AiOutlinePlus } from "react-icons/ai";
import { removeData } from "../../redux/actions";
import { useParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import { BASE_URL } from "../Api";
import axios from "axios";
import { Button, Input, Progress } from "@nextui-org/react";

export default function EditBusinessInfo({ reBack, companyId, getInfo }) {
  const CompanyDoc = {
    name: "",
    phone: 0,
    email: "",
    address: "",
    image: "",
  };
  const [info, setInfo] = useState(CompanyDoc);
  const [updateInfo, setUpdateInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [companyImg, setCompanyImg] = useState(null);

  const [isSelected, setIsSelected] = useState(false);
  const [selectFile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  ("info is a", info);

  const { id } = useParams();
  const fileInputRef = useRef(null);
  const token = useSelector((state) => state.IduniqueData);
  const dipatch = useDispatch();

  const inputChangeHandler = (event) => {
    const { name, value } = event.target;
    let newInfo = { [name]: value };

    setUpdateInfo({ ...updateInfo, ...newInfo });
    setInfo({ ...info, ...newInfo });
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

  const handleDiscardClick = () => {
    reBack();
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();
    setIsLoading(true);
    const updateCompanyEdit = async () => {
      const formData = new FormData();
      if (isSelected) {
        formData.append("image", selectFile);
      }

      for (let key in updateInfo) {
        formData.append(key, updateInfo[key]);
      }

      try {
        const { data } = await axios.patch(
          BASE_URL + `/company/${companyId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token.accessToken}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        ("path data is a", data);
        if (!data.status) {
          if (data?.message == "Token Expire , Please Login Again") {
            dipatch(removeData(null));
          }
          toast.warn(data.message);
        } else {
          reBack();
          getInfo();
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error(error.message);
      } finally {
        setIsSelected(false);
        setSelectedImage(null);
        setIsLoading(false);
      }
    };

    updateCompanyEdit();
  };

  useEffect(() => {
    const getCompanyInfo = async () => {
      const { data } = await axios.get(BASE_URL + `/company/${companyId}`, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (data?.message == "Token Expire , Please Login Again") {
        dipatch(removeData(null));
      }

      const companyData = data.data[0];

      const image = companyData?.image;
      if (image) setCompanyImg(image);
      setInfo({ ...info, ...companyData });
      setUpdateInfo({
        name: companyData.name,
        email: companyData.email,
      });
    };

    const fetchData = async () => {
      try {
        await getCompanyInfo();
      } catch (error) {
        console.error("Error fetching company:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <div>
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
      <div className="flex gap-3 my-6 mx-8">
        <Button
          type="submit"
          isDisabled={isLoading}
          isLoading={isLoading}
          className={`font-bold rounded-sm shadow-sm flex items-center bg-white text-blue-700 border-blue-500 border-2 ${isLoading
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
          className={`rounded-sm shadow-sm flex items-center  text-red-500 border-red-500 bg-white border-2 text-sm ${isLoading
              ? ""
              : "hover:opacity-75 hover:text-white hover:bg-red-500 font-bold"
            }`}
          onClick={handleDiscardClick}
        >
          Discard
        </Button>
      </div>

      <div className="container my-6 mx-8">
        <h2 className="text-sm font-bold text-slate-700">
          Edit Your Business Information
        </h2>
        <div className="container bg-white p-5 rounded-lg max-w-6xl">
          {isLoading && (
            <Progress size="sm" isIndeterminate aria-label="Loading..." />
          )}
          <form className="flex justify-between gap-10 p-5">
            <div>
              <div className="relative w-36 h-36 mt-4 flex justify-center items-center p-8 bg-white border-2 rounded-md shadow-md">
                {isSelected ? (
                  <img
                    src={selectedImage}
                    className="absolute object-cover w-full h-full"
                  />
                ) : companyImg ? (
                  <img
                    src={companyImg}
                    alt={info.name}
                    className="absolute object-cover w-full h-full"
                  />
                ) : (
                  <RiImageAddFill className=" text-slate-400 text-6xl" />
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
                  value={info.name}
                  onChange={(e) => inputChangeHandler(e)}
                  placeholder="Enter product name..."
                  labelPlacement="outside"
                />
              </div>
              <div className="w-60">
                <Input
                  type="text"
                  name="email"
                  label="Email"
                  value={updateInfo.email}
                  onChange={(e) => inputChangeHandler(e)}
                  placeholder="Enter email..."
                  labelPlacement="outside"
                />
              </div>

              <div className="w-60">
                <Input
                  type="number"
                  name="phone"
                  label="Phone"
                  value={info.phone}
                  onChange={(e) => inputChangeHandler(e)}
                  placeholder="Enter phone..."
                  labelPlacement="outside"
                />
              </div>

              <div className="w-60">
                <Input
                  type="text"
                  name="address"
                  label="address"
                  value={info.address}
                  onChange={(e) => inputChangeHandler(e)}
                  placeholder="Enter description..."
                  labelPlacement="outside"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
