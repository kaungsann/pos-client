import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FormPathApi, getApi } from "../Api";
import { removeData } from "../../redux/actions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChangePassword from "../utils/ChangePassword";
import { format } from "date-fns";
import { Button, Input, Progress, Select, SelectItem } from "@nextui-org/react";

export default function StaffEdit() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [birth, setBirth] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [showBox, setShowBox] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const token = useSelector((state) => state.IduniqueData);
  const dipatch = useDispatch();

  const navigate = useNavigate();

  const getSingleStaff = async () => {
    const response = await getApi(`/user/${id}`, token.accessToken);
    if (response.status) {
      const formattedExpireDate = response.data[0].birthdate
        ? new Date(response.data[0].birthdate).toISOString().split("T")[0]
        : "";
      setBirth(formattedExpireDate);
      setName(response.data[0].username);
      setEmail(response.data[0].email);
      setAddress(response.data[0].address ? response.data[0].address : null);
      setPhone(response.data[0].phone ? response.data[0].phone : null);
      setCity(response.data[0].city ? response.data[0].city : null);
      setGender(response.data[0].gender ? response.data[0].gender : null);
    }
  };

  const EditStaffInfoApi = async () => {
    const formData = new FormData();
    formData.append("password", password);
    if (name) {
      formData.append("username", name);
    }
    if (email) {
      formData.append("email", email);
    }
    if (phone) {
      formData.append("phone", phone);
    }
    if (address) {
      formData.append("address", address);
    }
    if (birth) {
      formData.append("birthdate", birth);
    }
    if (city) {
      formData.append("city", city);
    }
    if (gender) {
      formData.append("gender", gender);
    }

    let resData = await FormPathApi(`/user/${id}`, formData, token.accessToken);
    if (resData.message == "Token Expire , Please Login Again") {
      dipatch(removeData(null));
    }
    console.log("uer is a", resData);
    if (resData.status) {
      navigate("/admin/user/all");
    } else {
      toast.error(resData.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    EditStaffInfoApi();
  };

  useEffect(() => {
    getSingleStaff();
  }, []);

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={4000}
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

      <div className="container mt-2">
        <div className="flex flex-row justify-between my-4 max-w-6xl">
          <h2 className="lg:text-xl font-bold ">Staff Edit</h2>
          <div className="flex gap-3">
            <Button
              type="submit"
              isDisabled={isLoading}
              isLoading={isLoading}
              className={`font-bold rounded-sm shadow-sm flex items-center bg-white text-blue-700 border-blue-500 border-2 ${
                isLoading
                  ? ""
                  : "hover:opacity-75 text-sm hover:text-white hover:bg-blue-700"
              }`}
              onClick={() => setShowBox(true)}
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
              onClick={() => navigate("/admin/user/all")}
            >
              Discard
            </Button>
            <div className="w-96 absolute top-32 left-0 right-0 z-50 mx-auto bg-white rounded-md shadow-md flex justify-center cursor-pointer">
              {showBox && (
                <div className="w-72 my-3">
                  <div className="flex justify-between">
                    <label
                      htmlFor="phone"
                      className="after:content-['*'] mb-3 after:ml-0.5 after:text-red-500 block text-lg font-semibold text-slate-600"
                    >
                      Password*
                    </label>
                    <h3
                      onClick={() => setShowBox(false)}
                      className="text-slate-600 font-semibold text-xl hover:text-slate-400"
                    >
                      X
                    </h3>
                  </div>

                  <div className="mt-2">
                    <input
                      onChange={(e) => setPassword(e.target.value)}
                      id="password"
                      name="password"
                      type="password"
                      required
                      placeholder="Enter the admin password"
                      className=" px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                    />
                    <button
                      onClick={handleSubmit}
                      className="w-72 my-3 items-center flex justify-center rounded-md bg-blue-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="container bg-white p-5 rounded-lg max-w-6xl">
          {isLoading && (
            <Progress size="sm" isIndeterminate aria-label="Loading..." />
          )}
          <form className="flex justify-between gap-10 p-5">
            <div className="flex flex-wrap gap-8">
              {/* <div>
                <div className="relative w-36 h-36 mt-4 flex justify-center items-center p-8 bg-white border-2 rounded-md shadow-md">
                  <RiImageAddFill className=" text-slate-400 text-6xl" />
                  {isSelected ? (
                    <img
                      src={selectedImage}
                      className="absolute object-cover w-full h-full"
                    />
                  ) : image ? (
                    <img
                      src={productImg}
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
              </div> */}
              <div className="w-60">
                <Input
                  type="text"
                  label="Name"
                  name="name"
                  value={name}
                  // color={isInvalid ? "danger" : "success"}
                  // errorMessage={isInvalid && "Please enter a valid email"}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter Staff name..."
                  labelPlacement="outside"
                />
              </div>
              <div className="w-60">
                <Input
                  type="email"
                  name="email"
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter reference..."
                  labelPlacement="outside"
                />
              </div>
              <div className="w-60">
                <Input
                  type="text"
                  name="address"
                  label="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter Address..."
                  labelPlacement="outside"
                />
              </div>
              <div className="w-60">
                <span className="text-sm">Date of Birth</span>
                <Input
                  type="date"
                  name="dob"
                  labelPlacement="outside"
                  onChange={(e) => setBirth(e.target.value)}
                  value={
                    birth ? new Date(birth).toISOString().split("T")[0] : ""
                  }
                />
              </div>
              <div className="w-60">
                <Input
                  type="number"
                  name="phone"
                  label="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter Phone..."
                  labelPlacement="outside"
                />
              </div>
              <div className="w-60">
                <Input
                  type="text"
                  name="city"
                  label="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter City..."
                  labelPlacement="outside"
                />
              </div>
              <div className="mt-1">
                <div className="w-60">
                  <Select
                    labelPlacement="outside"
                    label="Gender"
                    name="gender"
                    value={gender}
                    placeholder="Select an gender"
                    selectedKeys={gender ? [gender] : false}
                    onChange={(e) => setGender(e.target.value)}
                    className="max-w-xs"
                  >
                    <SelectItem value="male" key="male">
                      male
                    </SelectItem>
                    <SelectItem value="female" key="female">
                      female
                    </SelectItem>
                  </Select>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
