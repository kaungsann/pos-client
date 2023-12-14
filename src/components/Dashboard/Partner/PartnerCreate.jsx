import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { sendJsonToApi } from "../../Api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { removeData } from "../../../redux/actions";
import { Input, Select, SelectItem, Checkbox } from "@nextui-org/react";


export default function PartnerCreate() {
  const navigate = useNavigate();
  const token = useSelector((state) => state.IduniqueData);
  const dipatch = useDispatch();
  const [isCustomer, setIsCustomer] = useState(null);
  const [isCompany, setIsCompany] = useState(null);

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
      <div className="flex gap-3 my-5">
        <button
          type="submit"
          className="font-bold rounded-sm shadow-sm flex items-center text-blue-700 border-blue-500 border-2 hover:opacity-75 text-sm hover:text-white hover:bg-blue-700 px-3 py-1.5"
          onClick={handleSubmit}
        >
          Save
        </button>
        <Link to="/admin/partners/all">
          <button className="rounded-sm shadow-sm flex items-center  text-red-500 border-red-500 bg-white border-2 hover:opacity-75 text-sm hover:text-white hover:bg-red-500 font-bold px-3 py-1.5">
            Discard
          </button>
        </Link>
      </div>
      <div className="container mt-2">
        <h2 className="lg:text-xl font-bold my-2">Partner Create</h2>
        <div className="container bg-white p-5 rounded-lg max-w-6xl">
          <form className="flex justify-between gap-10 p-5">
            <div className="flex flex-wrap gap-8">
              <div className="w-60">
                <Input
                  type="text"
                  label="Product Name"
                  name="name"
                  value={formData.name}
                  // color={isInvalid ? "danger" : "success"}
                  // errorMessage={isInvalid && "Please enter a valid email"}
                  onChange={handleInputChange}
                  placeholder="Enter Partner name..."
                  labelPlacement="outside"
                />
              </div>
              <div className="w-60">
                <Input
                  type="text"
                  name="address"
                  label="Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter reference..."
                  labelPlacement="outside"
                />
              </div>
              <div className="w-60">
                <Input
                  type="text"
                  name="phone"
                  label="Phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter Phone..."
                  labelPlacement="outside"
                />
              </div>
              <Checkbox defaultSelected size="lg"
                id="customer"
                onChange={handleCheckboxChange}
                
              >Customer</Checkbox>
              <Checkbox defaultSelected size="lg"
                id="company"
                onChange={handleCheckboxChange}
              >
                Company</Checkbox>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
