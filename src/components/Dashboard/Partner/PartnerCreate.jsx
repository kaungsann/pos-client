import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { sendJsonToApi } from "../../Api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { removeData } from "../../../redux/actions";

export default function PartnerCreate() {
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [contactAddress, setContactAddress] = useState("");
  const [isCustomer, setIsCustomer] = useState(false);
  const [isCompany, setIsCompany] = useState(false);
  const navigate = useNavigate();

  // State variables for showing red borders and error messages
  const [showNameError, setShowNameError] = useState(false);
  const [showErrorAddress, setShowErrorAddress] = useState(false);
  const [showErrorPhone, setShowErrorPhon] = useState(false);
  const [showErrorCity, setShowErrorCity] = useState(false);
  const token = useSelector((state) => state.IduniqueData);
  const dipatch = useDispatch();

  const createPartnerApi = async () => {
    if (name.trim() === "") {
      setShowNameError(true);
    } else {
      setShowNameError(false);
    }
    if (contactAddress.trim() === "") {
      setShowErrorAddress(true);
    } else {
      setShowErrorAddress(false);
    }
    if (phone.trim() === "") {
      setShowErrorPhon(true);
    } else {
      setShowErrorPhon(false);
    }
    if (city.trim() === "") {
      setShowErrorCity(true);
    } else {
      setShowErrorCity(false);
    }
    const data = {
      name: name,
      address: contactAddress,
      city: city,
      phone: phone,
      isCustomer: isCustomer,
      isCompany: isCompany,
    };
    try {
      let resData = await sendJsonToApi("/partner", data, token.accessToken);
      if (resData.message == "Token Expire , Please Login Again") {
        dipatch(removeData(null));
      }
      if (resData.status) {
        navigate("/admin/partners/all");
      } else {
        toast(resData.message);
      }
    } catch (error) {
      toast(resData.message);
      console.error("Error creating partner:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createPartnerApi();
  };
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
        <Link to="/admin/partners/all">
          <button className="rounded-sm ml-3 transition shadow-sm flex items-center text-[#4338ca] border-[#4338ca] border-2 hover:opacity-75 text-md hover:text-white hover:bg-[#4338ca] font-bold px-6 py-2">
            Discard
          </button>
        </Link>
      </div>

      <div className="mt-2">
        <div className="w-full mx-auto flex justify-center cursor-pointer flex-col">
          <h2 className="py-1.5 text-lg font-bold mt-2 bg-blue-600 text-white pl-4">
            Add New Partner
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="flex mt-4">
          <div className="w-80">
            <label
              className={`text-md font-semibold ${
                showNameError ? "text-red-600" : ""
              }`}
            >
              Name*
            </label>
            <input
              type="text"
              value={name}
              style={{ backgroundColor: "transparent" }}
              onChange={(e) => setName(e.target.value)}
              className={`w-full py-1 rounded-md border-b-2 bg-white focus:outline-none my-2 ${
                showNameError ? "border-red-600" : "border-slate-400"
              }`}
              placeholder="Enter product name"
            />
          </div>
          <div className="w-80 mx-2">
            <label
              className={`text-md font-semibold ${
                showErrorAddress ? "text-red-600" : ""
              }`}
            >
              Content Address*
            </label>
            <input
              type="text"
              value={contactAddress}
              style={{ backgroundColor: "transparent" }}
              onChange={(e) => setContactAddress(e.target.value)}
              className={`w-full py-1 rounded-md border-b-2 bg-white focus:outline-none my-2 ${
                showErrorAddress ? "border-red-600" : "border-slate-400"
              }`}
              placeholder="Enter product description"
            />
          </div>
          <div className="w-80 mx-2">
            <label
              className={`text-md font-semibold ${
                showErrorCity ? "text-red-600" : ""
              }`}
            >
              City*
            </label>
            <input
              type="text"
              value={city}
              style={{ backgroundColor: "transparent" }}
              onChange={(e) => setCity(e.target.value)}
              className={`w-full py-1 rounded-md border-b-2 bg-white focus:outline-none my-2 ${
                showErrorCity ? "border-red-600" : "border-slate-400"
              }`}
              placeholder="Enter product description"
            />
          </div>
          <div className="w-80 mx-2">
            <label
              className={`text-md font-semibold ${
                showErrorPhone ? "text-red-600" : ""
              }`}
            >
              Phone*
            </label>
            <input
              type="text"
              value={phone}
              style={{ backgroundColor: "transparent" }}
              onChange={(e) => setPhone(e.target.value)}
              className={`w-full py-1 rounded-md border-b-2 bg-white focus:outline-none my-2 ${
                showErrorPhone ? "border-red-600" : "border-slate-400"
              }`}
              placeholder="Enter product description"
            />
          </div>
          <div className="flex flex-col items-center">
            <label className="text-md font-semibold">Customer*</label>
            <input
              type="checkbox"
              id="customer"
              className="w-6 h-6 text-xl my-5"
              checked={isCustomer}
              style={{ backgroundColor: "transparent" }}
              onChange={() => setIsCustomer(!isCustomer)}
            />
          </div>
          <div className="ml-3 flex flex-col items-center">
            <label className="text-md font-semibold">Company*</label>
            <input
              type="checkbox"
              id="customer"
              className="w-6 h-6 text-xl my-5"
              checked={isCompany}
              style={{ backgroundColor: "transparent" }}
              onChange={() => setIsCompany(!isCompany)}
            />
          </div>
        </form>
      </div>
    </>
  );
}
