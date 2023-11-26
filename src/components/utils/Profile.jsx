import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getApi, FormPathApi } from "../Api";
import { useDispatch, useSelector } from "react-redux";
import { removeData } from "../../redux/actions";
import { BiSolidUser } from "react-icons/bi";
import { IoLogOutSharp } from "react-icons/io5";
import { TiBusinessCard } from "react-icons/ti";
import DeleteAlert from "./DeleteAlert";
import {
  AiTwotoneEdit,
  AiOutlineUsergroupAdd,
  AiOutlineUsergroupDelete,
} from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Register from "../Dashboard/Staff/Register";
import user from "../../assets/user.jpeg";
import BusinessRegister from "./BusinessRegister";
import EditBusinessInfo from "./EditBusinessInfo";
import Staff from "../Dashboard/Staff/Staff";
import CompanyInfo from "./CompanyInfo";
import StaffDetail from "../Dashboard/Staff/StaffDetail";

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
    setUsr(response.data);
    setName(response.data[0].username);
    setEmail(response.data[0].email);
  };

  const EditUserApi = async () => {
    const formData = new FormData();

    if (name) {
      formData.append("name", name);
    }
    if (email) {
      formData.append("email", email);
    }
    if (address) {
      formData.append("contactAddress", address);
    }
    if (phone) {
      formData.append("phone", phone);
    }
    if (city) {
      formData.append("city", city);
    }
    if (date) {
      formData.append("dateOfBirth", date);
    }
    if (gender) {
      formData.append("gender", gender);
    }
    if (file) {
      formData.append("image", file);
    }

    let resData = await FormPathApi(`/user/${id}`, formData, token);

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
            <input
              type="file"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleFileInputChange}
            />
            {
               userInfo.role && userInfo.role.name == "admin"  && 
               <AiTwotoneEdit onClick={handleFileInputClick}
               className="z-30 w-10 h-8 absolute bottom-3 right-4 text-white hover:bg-slate-400 text-lg bg-blue-500 rounded-full font-bold"
             />
            }

          </div>
          <div className="text-center">
            <h3 className="font-bold text-2xl mt-2">{usr.name}</h3>
            <h3 className="font-semibold text-lg text-slate-500">
              {usr.isAdmin ? "( Admin )" : "Guest"}
            </h3>
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

        <div className="ml-6 w-3/4">
          {activeSection === "personal" && (
            <div>
              <div className="flex justify-between w-full  text-slate-700 pb-6 border-b-2 border-b-slate-300">
                <h3 className="text-2xl font-bold">Personal Information</h3>

                {userInfo.role.name == "user" && (
                  <button
                    onClick={() => navigate("/admin/pos/all")}
                    className="font-bold rounded-sm shadow-sm flex items-cente text-blue-700 border-blue-500 border-2 hover:opacity-75 text-md hover:text-white hover:bg-blue-700 px-6 py-2"
                  >
                    Back
                  </button>
                )}
              </div>

              <div className="mt-4">
                <div className="flex ">
                  <div className="flex">
                    <label
                      for="male"
                      className="text-lg mr-3 font-semibold text-slate-600"
                    >
                      Male
                    </label>
                    <input
                      type="radio"
                      name="gender"
                      id="male"
                      value="male"
                      className="w-6 h-8"
                      checked={usr.gender === "male"}
                      disabled={usr.gender === "female"}
                    />
                  </div>
                  <div className="flex mx-6">
                    <label
                      for="female"
                      className="text-lg mr-3 font-semibold text-slate-600"
                    >
                      Female
                    </label>
                    <input
                      type="radio"
                      name="gender"
                      id="female"
                      value="female"
                      className="w-6 h-8"
                      checked={usr.gender === "female"}
                      disabled={usr.gender === "male"}
                    />
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap justify-between">
                  <div className="flex w-full justify-between">
                    <div className="w-6/12">
                      <label className="text-lg font-semibold text-slate-600">
                        Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 rounded-md border-2 bg-white focus:outline-none my-3 text-slate-500 font-semibold text-xl"
                      />
                    </div>
                    <div className="w-6/12 ml-2">
                      <label className="text-lg font-semibold text-slate-600">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2 rounded-md border-2 bg-white focus:outline-none my-3 text-slate-500 font-semibold text-xl"
                      />
                    </div>
                  </div>

                  <div className="w-full mt-6">
                    <label className="text-lg font-semibold text-slate-600">
                      Email
                    </label>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-md border-2 bg-white focus:outline-none my-3 text-slate-500 font-semibold text-xl"
                    />
                  </div>

                  <div className="flex w-full justify-between mt-6">
                    <div className="w-6/12">
                      <label className="text-lg font-semibold text-slate-600">
                        Gender
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full px-3 py-2 rounded-md border-2 bg-white focus:outline-none my-3 text-slate-500 font-semibold text-xl"
                      >
                        <option disabled value>
                          Select an option
                        </option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>

                    <div className="w-6/12 ml-2">
                      <label className="text-lg font-semibold text-slate-600">
                        Date Of Birth
                      </label>
                      <input
                        type="text"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-md border-2 bg-white focus:outline-none my-3 text-slate-500 font-semibold text-xl"
                      />
                    </div>
                  </div>

                  <div className="flex w-full justify-between mt-6">
                    <div className="w-6/12">
                      <label className="text-lg font-semibold text-slate-600">
                        City
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3 py-2 rounded-md border-2 bg-white focus:outline-none my-3 text-slate-500 font-semibold text-xl"
                      />
                    </div>
                    <div className="w-6/12 ml-2">
                      <label className="text-lg font-semibold text-slate-600">
                        Address
                      </label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-3 py-2 rounded-md border-2 bg-white focus:outline-none my-3 text-slate-500 font-semibold text-xl"
                      />
                    </div>
                  </div>
                </div>

                {userInfo.role && userInfo.role.name == "admin" && (
                  <div className="flex">
                    <button
                      onClick={() => navigate("/admin/pos/all")}
                      className="w-6/12 rounded-md mt-4 border-2 hover:bg-cyan-600 hover:text-white text-blue-500 border-blue-400  py-2 text-center font-bold"
                    >
                      Discard Change
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="w-6/12 ml-2 hover:opacity-80 rounded-md mt-4 bg-blue-600 py-2 text-center text-white font-bold"
                    >
                      Edit Save
                    </button>
                  </div>
                )}
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
