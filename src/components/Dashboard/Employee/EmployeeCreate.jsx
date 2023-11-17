import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MoonLoader from "react-spinners/MoonLoader";
import { FormPostApi, sendJsonToApi } from "../../Api";
import { useSelector } from "react-redux";

export default function EmployeeCreate() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [file, setFile] = useState("");
  const [birthdate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const token = useSelector((state) => state.IduniqueData);

  const handleEmployee = async (e) => {
    e.preventDefault();

    let data = {
      name,
      email,
      password,
      phone,
      gender,
      city,
      birthdate,
      address,
    };

    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("gender", gender);
    formData.append("city", city);
    formData.append("password", password);
    formData.append("birthdate", birthdate);
    formData.append("address", address);
    formData.append("image", file);

    let response = await sendJsonToApi("/employee", data, token.accessToken);

    console.log("message is", response);

    if (response.status) {
      navigate("/admin/employee/all");
    } else {
      toast(response.message);
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
      />
      <div className="flex">
        <button
          onClick={handleEmployee}
          className="font-bold rounded-sm shadow-sm flex items-cente text-blue-700 border-blue-500 border-2 hover:opacity-75 text-md hover:text-white hover:bg-blue-700 px-6 py-2"
        >
          Save
        </button>
        <Link to="/admin/employee/all">
          <button className="rounded-sm ml-3 transition shadow-sm flex items-center text-[#4338ca] border-[#4338ca] border-2 hover:opacity-75 text-md hover:text-white hover:bg-[#4338ca] font-bold px-6 py-2">
            Discard
          </button>
        </Link>
      </div>

      <div className="w-full mx-auto flex justify-center cursor-pointer flex-col">
        <h2 className="py-1.5 text-lg font-bold mt-2 bg-blue-600 text-white pl-4">
          Add New Employee
        </h2>

        <div>
          <div>
            <form className="mt-4 flex justify-between flex-wrap">
              <div className="w-80 my-2">
                <label className="after:content-['*'] mb-3 after:ml-0.5 after:text-red-500 block text-lg font-semibold text-slate-600">
                  Name
                </label>
                <input
                  type="text"
                  required
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                  placeholder="Enter Your Company Name"
                  name="name"
                />
              </div>
              <div className="w-80 my-2">
                <label className="after:content-['*'] mb-3 after:ml-0.5 after:text-red-500 block text-lg font-semibold text-slate-600">
                  Email
                </label>
                <input
                  type="email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                  placeholder="Enter Your Company Email"
                  name="name"
                />
              </div>
              {/* <div className="w-80 my-2">
                <label className="after:content-['*'] mb-3 after:ml-0.5 after:text-red-500 block text-lg font-semibold text-slate-600">
                  Employee Image
                </label>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.value)}
                  className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                  placeholder="Enter Your Company Name"
                  name="file"
                />
              </div> */}
              <div className="w-80 my-2">
                <label className="after:content-['*'] mb-3 after:ml-0.5 after:text-red-500 block text-lg font-semibold text-slate-600">
                  Phone
                </label>
                <input
                  type="text"
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                  placeholder="Enter Your Company Email"
                  name="addresss"
                />
              </div>
              <div className="w-80 my-2">
                <label className="after:content-['*'] mb-3 after:ml-0.5 after:text-red-500 block text-lg font-semibold text-slate-600">
                  Address
                </label>
                <input
                  type="text"
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                  placeholder="Enter Your Company Name"
                  name="phone"
                />
              </div>
              <div className="w-80 my-2">
                <label className="after:content-['*'] mb-3 after:ml-0.5 after:text-red-500 block text-lg font-semibold text-slate-600">
                  Date Of Birth
                </label>
                <input
                  type="date"
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                  placeholder="Enter Your Company Email"
                  name="addresss"
                />
              </div>
              <div className="w-80 my-2">
                <label className="after:content-['*'] mb-3 after:ml-0.5 after:text-red-500 block text-lg font-semibold text-slate-600">
                  City
                </label>
                <input
                  type="text"
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                  placeholder="Enter Your Company Name"
                  name="phone"
                />
              </div>

              <div className="w-80 my-2">
                <label className="after:content-['*'] mb-3 after:ml-0.5 after:text-red-500 block text-lg font-semibold text-slate-600">
                  Gender
                </label>
                <select
                  onChange={(e) => setGender(e.target.value)}
                  id="gender"
                  required
                  name="gender"
                  className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                >
                  <option disabled value selected>
                    Select an option
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="w-80 my-2">
                <label className="after:content-['*'] mb-3 after:ml-0.5 after:text-red-500 block text-lg font-semibold text-slate-600">
                  Password
                </label>
                <input
                  type="text"
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                  placeholder="Enter Your Company Email"
                  name="addresss"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
