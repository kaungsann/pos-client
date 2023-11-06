import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { getApi, PathData } from "../../Api";
import { useSelector } from "react-redux";

export default function PartnerEdit() {
  const { id } = useParams();
  let [name, setName] = useState("");
  let [city, setCity] = useState("");
  let [contactAddress, setcontentAddress] = useState("");
  let [phone, setPhone] = useState("");
  const [isCustomer, setIsCustomer] = useState(null);
  const [isCompany, setIsCompany] = useState(null);
  const navigate = useNavigate();
  const token = useSelector((state) => state.IduniqueData);

  const getSinglePartnere = async () => {
    let resData = await getApi(`/partner/${id}`, token.accessToken);
    setName(resData.data[0].name);
    setCity(resData.data[0].city);
    setcontentAddress(resData.data[0].address);
    setPhone(resData.data[0].phone);
    setIsCustomer(resData.data[0].isCustomer);
    setIsCompany(resData.data[0].isCompany);
  };
  const editPartnerApi = async () => {
    const data = {};
    if (name) {
      data.name = name;
    }
    if (contactAddress) {
      data.address = contactAddress;
    }
    if (city) {
      data.city = city;
    }
    if (phone) {
      data.phone = phone;
    }
    if (isCustomer) {
      data.isCustomer = isCustomer;
    }
    if (isCompany) {
      data.isCompany = isCompany;
    }

    try {
      let resData = await PathData(`/partner/${id}`, data, token.accessToken);
      if (resData.status) {
        navigate("/admin/partners/all");
      } else {
        toast(resData.message);
      }
    } catch (error) {
      console.error("Error edit partner:", error);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    editPartnerApi();
  };
  useEffect(() => {
    getSinglePartnere();
  }, []);
  return (
    <>
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

      <div className="w-full mx-auto mt-4">
        <div className="w-full mx-auto flex justify-center cursor-pointer flex-col">
          <h2 className="py-1.5 text-lg font-bold mt-2 bg-blue-600 text-white pl-4">
            Edit Parnter information
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="flex mt-3">
          <div className="w-80">
            <label className="text-md font-semibold">Name*</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-md border-b-2 border-slate-400 bg-white focus:outline-none my-2"
              placeholder="Enter product name"
            />
          </div>
          <div className="w-80 mx-2">
            <label className="text-md font-semibold">Content Address*</label>
            <input
              type="text"
              value={contactAddress}
              onChange={(e) => setcontentAddress(e.target.value)}
              className="w-full px-3 py-2 rounded-md border-b-2 border-slate-400 bg-white focus:outline-none my-2"
              placeholder="Enter product description"
            />
          </div>
          <div className="w-80 mx-2">
            <label className="text-md font-semibold">City*</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2 rounded-md border-b-2 border-slate-400 bg-white focus:outline-none my-2"
              placeholder="Enter product description"
            />
          </div>
          <div className="w-80 mx-2">
            <label className="text-md font-semibold">Phone*</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 rounded-md border-b-2 border-slate-400 bg-white focus:outline-none my-2"
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
              onChange={() => setIsCompany(!isCompany)}
            />
          </div>
        </form>
      </div>
    </>
  );
}
