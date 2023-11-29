import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { sendJsonToApi } from "../../Api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { removeData } from "../../../redux/actions";

export default function PartnerCreate() {
  const navigate = useNavigate();
  const token = useSelector((state) => state.IduniqueData);
  const dipatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    phone: "",
    isCustomer: false,
    isCompany: false,
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await sendJsonToApi(
        "/partner",
        formData,
        token.accessToken
      );

      setFormData({
        name: "",
        contactAddress: "",
        city: "",
        phone: "",
        isCustomer: false,
        isCompany: false,
      });

      if (response.message === "Token Expire , Please Login Again")
        dipatch(removeData(null));
      else
        response.status
          ? navigate("/admin/partners/all")
          : toast(response.message);
    } catch (error) {
      console.error("Error creating partner:", error);
    }
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
            <label className={"text-md font-semibold"}>Name*</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              style={{ backgroundColor: "transparent" }}
              onChange={handleInputChange}
              className={
                "w-full py-1 rounded-md border-b-2 bg-white focus:outline-none my-2 border-slate-400"
              }
              placeholder="Enter partner name"
            />
          </div>
          <div className="w-80 mx-2">
            <label className={"text-md font-semibold"}>Content Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              style={{ backgroundColor: "transparent" }}
              onChange={handleInputChange}
              className={
                "w-full py-1 rounded-md border-b-2 bg-white focus:outline-none my-2 border-slate-400"
              }
              placeholder="Enter product description"
            />
          </div>
          <div className="w-80 mx-2">
            <label className={"text-md font-semibold"}>City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              style={{ backgroundColor: "transparent" }}
              onChange={handleInputChange}
              className={
                "w-full py-1 rounded-md border-b-2 bg-white focus:outline-none my-2 border-slate-400"
              }
              placeholder="Enter product description"
            />
          </div>
          <div className="w-80 mx-2">
            <label className={"text-md font-semibold"}>Phone</label>
            <input
              type="number"
              name="phone"
              value={formData.phone}
              style={{ backgroundColor: "transparent" }}
              onChange={handleInputChange}
              className={
                "w-full py-1 rounded-md border-b-2 bg-white focus:outline-none my-2 border-slate-400"
              }
              placeholder="Enter product description"
            />
          </div>
          <div className="flex flex-col items-center">
            <label className="text-md font-semibold">Customer</label>
            <input
              type="checkbox"
              id="customer"
              className="w-6 h-6 text-xl my-5"
              name="isCustomer"
              checked={formData.isCustomer}
              style={{ backgroundColor: "transparent" }}
              onChange={handleCheckboxChange}
            />
          </div>
          <div className="ml-3 flex flex-col items-center">
            <label className="text-md font-semibold">Company</label>
            <input
              type="checkbox"
              id="customer"
              className="w-6 h-6 text-xl my-5"
              name="isCompany"
              checked={formData.isCompany}
              style={{ backgroundColor: "transparent" }}
              onChange={handleCheckboxChange}
            />
          </div>
        </form>
      </div>
    </>
  );
}
