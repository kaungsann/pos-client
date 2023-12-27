import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getApi, FormPathApi } from "../Api";
import { useDispatch, useSelector } from "react-redux";
import { removeData } from "../../redux/actions";
import { RiImageAddFill } from "react-icons/ri";
import { AiOutlinePlus } from "react-icons/ai";
import axios from "axios";
import { BASE_URL } from "../Api";

import { format } from "date-fns";
import { Input, Progress, Button, Select, SelectItem } from "@nextui-org/react";

import {
  AiTwotoneEdit,
  AiOutlineUsergroupAdd,
  AiOutlineUsergroupDelete,
} from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function PersonalEdit() {
  const AdminDoc = {
    name: "",
    phone: "",
    email: "",
    address: "",
    image: "",
    city: "",
    birthdate: "",
    gender: "",
  };

  const [info, setInfo] = useState(AdminDoc);
  const [updateInfo, setUpdateInfo] = useState({});
  const [adminImg, setAdminImg] = useState(null);

  const [isSelected, setIsSelected] = useState(false);
  const [selectFile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef(null);
  const { id } = useParams();
  const token = useSelector((state) => state.IduniqueData);
  const dipatch = useDispatch();

  const inputChangeHandler = (event) => {
    const { name, value } = event.target;
    let newAdminInfo = { [name]: value };

    setUpdateInfo({ ...updateInfo, ...newAdminInfo });
    setInfo({ ...info, ...newAdminInfo });
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();
    setIsLoading(true);
    const updateAdminInfoEdit = async () => {
      const formData = new FormData();
      if (isSelected) {
        formData.append("image", selectFile);
      }

      for (let key in updateInfo) {
        formData.append(key, updateInfo[key]);
      }

      try {
        const { data } = await axios.patch(BASE_URL + `/user/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        });

        if (!data.status) {
          if (data?.message == "Token Expire , Please Login Again") {
            dipatch(removeData(null));
          }
          toast.warn(data.message);
        } else {
          navigate("/admin/products/all");
        }
      } catch (error) {
        console.error("Error fetching admin info:", error);
        toast.error(error.message);
      } finally {
        setIsSelected(false);
        setSelectedImage(null);
        setIsLoading(false);
      }
    };

    updateAdminInfoEdit();
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
    const fetchAdminInfo = async () => {
      const { data } = await axios.get(BASE_URL + `/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (data?.message == "Token Expire , Please Login Again") {
        dipatch(removeData(null));
      }

      const adminData = data.data[0];

      console.log("admin data is a", adminData);
      const image = adminData?.image;
      if (image) setAdminImg(image);
      setInfo({ ...info, ...adminData });
      setUpdateInfo({
        name: adminData.name,
        email: adminData.email,
      });
    };

    const fetchData = async () => {
      try {
        await fetchAdminInfo();
      } catch (error) {
        console.error("Error fetching admin info:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div className="flex justify-between w-full mt-4 text-slate-700 pb-3 px-4">
        <h3 className="text-2xl font-bold">Personal Information</h3>

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
      </div>
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
            ) : adminImg ? (
              <img
                src={adminImg}
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
              label="UserName"
              name="name"
              value={info.username}
              onChange={(e) => inputChangeHandler(e)}
              placeholder="Enter product name..."
              labelPlacement="outside"
            />
          </div>
          <div className="w-60">
            <Input
              type="email"
              name="ref"
              label="Email"
              value={info.email}
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
              selectedKeys={info.gender ? [info.gender || "male"] : false}
              onChange={(e) => inputChangeHandler(e)}
              className="max-w-xs"
            >
              <SelectItem key="male" value="male">
                Male
              </SelectItem>
              <SelectItem key="female" value="female">
                Female
              </SelectItem>
            </Select>
          </div>
          <div className="w-60">
            <Input
              type="number"
              name="phone"
              label="Phone"
              value={info.phone}
              placeholder="Enter phone number..."
              labelPlacement="outside"
            />
          </div>
          <div className="w-60">
            <span className="text-sm">BOD</span>
            <Input
              type="date"
              name="birthdate"
              labelPlacement="outside"
              value={
                info.birthdate
                  ? new Date(info.birthdate).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) => inputChangeHandler(e)}
            />
          </div>
          <div className="w-60">
            <Input
              type="text"
              name="city"
              label="City"
              value={info.city}
              onChange={(e) => inputChangeHandler(e)}
              placeholder="Enter description..."
              labelPlacement="outside"
            />
          </div>
          <div className="w-60">
            <Input
              type="text"
              required
              name="address"
              label="address"
              value={info.address}
              placeholder="address ..."
              labelPlacement="outside"
              onChange={(e) => inputChangeHandler(e)}
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default PersonalEdit;
