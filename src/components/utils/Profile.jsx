import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getApi, FormPathApi } from "../Api";
import { useDispatch, useSelector } from "react-redux";
import { removeData } from "../../redux/actions";
import { BiSolidUser } from "react-icons/bi";
import { IoLogOutSharp } from "react-icons/io5";
import { TiBusinessCard } from "react-icons/ti";
import DeleteAlert from "./DeleteAlert";
import { format } from "date-fns";
import { Input, Progress, Button, Select, SelectItem } from "@nextui-org/react";

import {
  AiTwotoneEdit,
  AiOutlineUsergroupAdd,
  AiOutlineUsergroupDelete,
} from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Register from "../Staff/Register";
import user from "../../assets/user.jpeg";
import BusinessRegister from "./BusinessRegister";
import EditBusinessInfo from "./EditBusinessInfo";
import Staff from "../Staff/Staff";
import CompanyInfo from "./CompanyInfo";
import StaffDetail from "../Staff/StaffDetail";

export default function Profile() {
  const { id } = useParams();
  const fileInputRef = useRef(null);
  const [usr, setUsr] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");
  const [file, setFile] = useState(null);

  const [logout, setLogout] = useState(false);
  const dipatch = useDispatch();
  const [activeSection, setActiveSection] = useState("personal");

  const userInfo = useSelector((state) => state.loginData);

  const token = useSelector((state) => state.IduniqueData);

  const navigate = useNavigate();
  const singleUser = async () => {
    let response = await getApi(`/user/${id}`, token.accessToken);
    if (response.message == "Token Expire , Please Login Again") {
      dipatch(removeData(null));
    }
    const formattedBirthDate = response.data[0].birthdate
      ? new Date(response.data[0].birthdate).toISOString().split("T")[0]
      : "";
    setDate(formattedBirthDate);
    setUsr(response.data[0]);
    setName(response.data[0].username);
    setEmail(response.data[0].email);
    setPhone(response.data[0].phone);
    setAddress(response.data[0].address);
    setGender(response.data[0].gender);
    setCity(response.data[0].city);
  };

  console.log("single useris ", usr);

  const EditUserApi = async () => {
    const formData = new FormData();

    if (name) {
      formData.append("name", name);
    }
    if (email) {
      formData.append("email", email);
    }
    if (address) {
      formData.append("address", address);
    }
    if (phone) {
      formData.append("phone", phone);
    }
    if (city) {
      formData.append("city", city);
    }
    if (date) {
      formData.append("birthdate", date);
    }
    if (gender) {
      formData.append("gender", gender);
    }
    if (file) {
      formData.append("image", file);
    }
    console.log("formdata is", formData);

    console.log("data is formed", name, email, city, address);

    let resData = await FormPathApi(`/user/${id}`, formData, token);

    console.log("res ddata is", resData);

    if (resData.con) {
      toast(resData.message);
      singleUser();
    } else {
      toast(resData);
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleFileInputChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handlePersonalSectionClick = () => {
    setActiveSection("personal");
  };

  const handleAddUserSectionClick = () => {
    setActiveSection("addUser");
  };

  const handleCompanyRegister = () => {
    setActiveSection("company");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    EditUserApi();
  };

  useEffect(() => {
    singleUser();
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
      />
      <div
        className={`flex mb-8 cursor-pointer ${
          userInfo.role && userInfo.role.name == "user" ? "mt-20 " : ""
        }`}
      >
        <div className="w-1/4 flex flex-col justify-items-center items-center p-4 bg-white shadow-md h-screen">
          <div className="relative">
            <img
              loading="eager | lazy"
              src={file ? URL.createObjectURL(file) : user}
              alt="image"
              className="w-40 h-36 rounded-full"
            />
          </div>
          <div className="text-center">
            <h3 className="font-bold text-2xl mt-2">{usr.name}</h3>
            <h3 className="font-semibold text-lg text-slate-500">{name}</h3>
          </div>
          <div className="w-full mt-6">
            <div
              className={`flex w-full py-2 items-center justify-start rounded-2xl ${
                activeSection === "personal"
                  ? "bg-blue-100 font-bold"
                  : "text-slate-400"
              }`}
              onClick={handlePersonalSectionClick}
            >
              <BiSolidUser
                className={`text-2xl font-bold  mx-4 ${
                  activeSection === "personal"
                    ? "text-blue-500"
                    : "text-slate-500"
                }`}
              />
              <h3
                className={`text-lg ${
                  activeSection === "personal"
                    ? "text-slate-800 font-bold"
                    : "text-slate-500"
                }`}
              >
                Personal Information
              </h3>
            </div>

            {userInfo.role && userInfo.role.name == "admin" && (
              <>
                <div
                  className={`flex py-2  mt-4 w-full items-center justify-start rounded-2xl ${
                    activeSection === "company"
                      ? "bg-blue-100 font-bold"
                      : "text-slate-400"
                  }`}
                  onClick={handleCompanyRegister}
                >
                  <TiBusinessCard
                    className={`text-2xl font-bold  mx-4 ${
                      activeSection === "company"
                        ? "text-blue-500"
                        : "text-slate-500"
                    }`}
                  />
                  <h3
                    className={`text-lg ${
                      activeSection === "company"
                        ? "text-slate-800 font-bold"
                        : "text-slate-500"
                    }`}
                  >
                    Company Information
                  </h3>
                </div>
              </>
            )}

            <div
              className={`flex w-full mt-4 py-2 items-center justify-start rounded-2xl ${
                logout ? "bg-blue-100 font-bold" : "text-slate-400"
              }}`}
              onClick={() => {
                setLogout(true), setActiveSection(null);
              }}
            >
              <IoLogOutSharp
                className={`text-2xl font-bold mx-4 ${
                  logout ? "text-blue-500" : "text-slate-600"
                }`}
              />
              <h3
                className={`text-lg ${
                  logout ? "text-slate-800 font-bold" : "text-slate-500"
                }`}
              >
                Logout
              </h3>
            </div>
          </div>
        </div>
        <div className="ml-6 w-3/4 bg-white">
          {activeSection === "personal" && (
            <div>
              <div className="flex justify-between w-full p-5 text-slate-700 pb-6 border-b-2 px-4 border-b-slate-300">
                <h3 className="text-2xl font-bold">Personal Information</h3>
                <button
                  onClick={handleSubmit}
                  className="font-bold rounded-sm shadow-sm flex items-cente text-green-700 border-green-500 border-2 hover:opacity-75 text-md hover:text-white hover:bg-green-700 px-6 py-2"
                >
                  Save
                </button>
              </div>
              <div className="mt-4 p-5">
                <div className="mt-4 flex flex-wrap justify-between">
                  <div className="flex w-full justify-between">
                    <div className="w-6/12">
                      <Input
                        type="text"
                        label="Name"
                        name="name"
                        value={name}
                        // color={isInvalid ? "danger" : "success"}
                        // errorMessage={isInvalid && "Please enter a valid email"}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter  name..."
                        labelPlacement="outside"
                      />
                    </div>

                    <div className="w-6/12 ml-2">
                      <Input
                        type="text"
                        label="Email"
                        name="email"
                        value={email}
                        // color={isInvalid ? "danger" : "success"}
                        // errorMessage={isInvalid && "Please enter a valid email"}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter  Email..."
                        labelPlacement="outside"
                      />
                    </div>
                  </div>
                  <div className="flex w-full justify-between py-5">
                    <div className="flex w-full justify-between">
                      <div className="w-6/12">
                        <Input
                          type="text"
                          label="City"
                          name="city"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Enter  City..."
                          labelPlacement="outside"
                        />
                      </div>
                      <div className="w-6/12 ml-2">
                        <Input
                          type="text"
                          label="Phone"
                          name="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Enter  phone..."
                          labelPlacement="outside"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex w-full justify-between mt-6">
                    <div className="w-6/12 ">
                      <Input
                        type="text"
                        name="address"
                        label="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter address..."
                        labelPlacement="outside"
                      />
                    </div>
                    <div className="w-6/12 ml-2">
                      <Input
                        type="date"
                        name="dob"
                        label="Date of Birth"
                        value={
                          date ? new Date(date).toISOString().split("T")[0] : ""
                        }
                        onChange={(e) => setDate(e.target.value)}
                        placeholder="Enter Address..."
                        labelPlacement="outside"
                      />
                    </div>
                  </div>

                  <div className="flex w-full justify-between mt-6">
                    <div className="w-6/12">
                      <Select
                        labelPlacement="outside"
                        label="Gender"
                        name="gender"
                        value={gender}
                        placeholder="Select an gender"
                        selectedKeys={gender ? [gender] : false}
                        onChange={(e) => setGender(e.target.value)}
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
              </div>
            </div>
          )}
          {activeSection === "company" && (
            <>
              <CompanyInfo />
              {/* <BusinessRegister /> */}
            </>
          )}
          {activeSection === "EditInfo" && (
            <>
              <EditBusinessInfo />
            </>
          )}
        </div>
      </div>
      {logout && (
        <DeleteAlert
          cancel={() => {
            setActiveSection("personal");
            setLogout(false);
          }}
          text="Do you want to logout. Pls confirm it"
          onDelete={() => {
            dipatch(removeData(null));
            setAlert(false);
          }}
        />
      )}
    </>
  );
}
