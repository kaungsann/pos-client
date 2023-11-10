import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import { FormPostApi } from "./Api";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MoonLoader from "react-spinners/MoonLoader";
import { useSelector } from "react-redux";

export default function () {
  const [name, setname] = useState("");
  const [phone, setphone] = useState("");
  const [email, setemail] = useState("");
  const [address, setAddress] = useState("");
  const [file, setFile] = useState("");
  const [birth, setBirth] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");

  const [loading, setLoading] = useState(false);

  const [password, setpassword] = useState("");

  const token = useSelector((state) => state.IduniqueData);

  const fileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const registerUser = async (e) => {
    setLoading(true);
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", name);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("gender", gender);
    formData.append("city", city);
    formData.append("password", password);
    formData.append("birthdate", birth);
    formData.append("address", address);
    formData.append("image", file);

    let response = await FormPostApi("/user", formData, token.accessToken);

    if (response.success) {
      setname("");
      setphone("");
      setemail("");
      setAddress("");
      setFile("");
      setBirth("");
      setGender("");
      setCity("");
      setpassword("");
      setLoading(false);
      toast(response.message);
    } else {
      setLoading(false);
      toast(response.message);
    }
  };

  return (
    <div>
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
      <div className="flex min-h-full w-full flex-col">
        <div className="mb-3">
          <h2 className="text-2xl font-bold text-slate-700 pb-6 border-b-2 border-b-slate-300">
            Create Account
          </h2>
        </div>
        <form
          onSubmit={registerUser}
          className=" w-full flex flex-wrap items-center justify-between"
          action="#"
          method="POST"
        >
          <div className="w-72 my-3">
            <label
              htmlFor="name"
              className="after:content-['*'] mb-3 after:ml-0.5 after:text-red-500 block text-lg font-semibold text-slate-600"
            >
              Name
            </label>
            <div className="mt-2">
              <input
                onChange={(e) => setname(e.target.value)}
                id="name"
                name="name"
                type="text"
                required
                className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
              />
            </div>
          </div>

          <div className="w-72 my-3">
            <label
              htmlFor="email"
              className="after:content-['*'] mb-3 after:ml-0.5 after:text-red-500 block text-lg font-semibold text-slate-600"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                onChange={(e) => setemail(e.target.value)}
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                className=" px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
              />
            </div>
          </div>

          <div className="w-72 my-3">
            <label
              htmlFor="city"
              className="after:content-['*'] mb-3 after:ml-0.5 after:text-red-500 block text-lg font-semibold text-slate-600"
            >
              Contact Address
            </label>
            <div className="mt-2">
              <input
                onChange={(e) => setAddress(e.target.value)}
                id="address"
                name="address"
                type="address"
                required
                className=" px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
              />
            </div>
          </div>

          <div className="w-72 my-3">
            <label
              htmlFor="file-upload"
              className="after:content-['*'] mb-3 after:ml-0.5 after:text-red-500 block text-lg font-semibold text-slate-600"
            >
              Image Upload
            </label>
            <div className="mt-2">
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                required
                onChange={fileChange}
                className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
              />
            </div>
          </div>

          <div className="w-72 my-3">
            <label
              htmlFor="gender"
              className="after:content-['*'] mb-3 after:ml-0.5 after:text-red-500 block text-lg font-semibold text-slate-600"
            >
              Date Of Birth
            </label>
            <div className="mt-2">
              <input
                onChange={(e) => setBirth(e.target.value)}
                id="birth"
                name="birth"
                type="date"
                autocomplete="phone"
                required
                className=" px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
              />
            </div>
          </div>

          <div className="w-72 my-3">
            <label
              htmlFor="phone"
              className="after:content-['*'] mb-3 after:ml-0.5 after:text-red-500 block text-lg font-semibold text-slate-600"
            >
              Phone Number
            </label>
            <div className="mt-2">
              <input
                onChange={(e) => setphone(e.target.value)}
                id="phone"
                name="phone"
                type="phone"
                required
                className=" px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
              />
            </div>
          </div>

          <div className="w-72 my-3">
            <label
              htmlFor="gender"
              className="after:content-['*'] mb-3 after:ml-0.5 after:text-red-500 block text-lg font-semibold text-slate-600"
            >
              Gender
            </label>
            <div className="mt-2">
              <select
                onChange={(e) => setGender(e.target.value)}
                id="gender"
                required
                name="gender"
                className=" px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
              >
                <option disabled value selected>
                  Select an option
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="w-72 my-3">
            <label
              htmlFor="city"
              className="after:content-['*'] mb-3 after:ml-0.5 after:text-red-500 block text-lg font-semibold text-slate-600"
            >
              City
            </label>
            <div className="mt-2">
              <select
                id="city"
                onChange={(e) => setCity(e.target.value)}
                name="city"
                className=" px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
              >
                <option disabled value selected>
                  Select an option
                </option>
                <option value="Yagon">Yagon</option>
                <option value="Mandalay">Mandalay</option>
                <option value="PyiOoLwin">PyiOoLwin</option>
                <option value="Pago">Bago</option>
              </select>
            </div>
          </div>

          <div className="w-72 my-3">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="after:content-['*'] mb-3 after:ml-0.5 after:text-red-500 block text-lg font-semibold text-slate-600"
              >
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                onChange={(e) => setpassword(e.target.value)}
                id="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-72 my-3 mt-8 flex justify-center rounded-md bg-blue-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {loading && (
              <MoonLoader
                color={"#f0f7f6"}
                loading={loading}
                size={25}
                aria-label="Loading Spinner"
                data-testid="loader"
                className="mx-4"
              />
            )}
            Create User
          </button>
        </form>
      </div>
    </div>
  );
}
