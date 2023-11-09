import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormPostApi } from "../Api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MoonLoader from "react-spinners/MoonLoader";

export default function BusinessRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [fiie, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = useSelector((state) => state.IduniqueData);
  const dipatch = useDispatch();

  const uploadImage = (e) => {
    let selectImage = e.target.files[0];
    setFile(selectImage);
  };

  const handleChange = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("companyName", name);
    formData.append("companyPhone", phone);
    formData.append("companyEmail", email);
    formData.append("image", fiie);
    formData.append("contactAddress", address);

    const response = await FormPostApi(
      "/store-info",
      formData,
      token.accessToken
    );
    if (response.message == "Token Expire , Please Login Again") {
      dipatch(removeData(null));
    }
    if (response.status) {
      setLoading(false);
      setName("");
      setPhone("");
      setAddress("");
      setEmail("");
      setFile(null);
      toast(response.message);
    } else {
      setLoading(false);
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
      <div>
        <h1 className="text-2xl font-bold text-slate-700 pb-6 border-b-2 border-b-slate-300">
          Register Your Business
        </h1>

        <div>
          <form className="mt-8" onSubmit={handleChange}>
            <div className="flex">
              <div className="w-6/12">
                <label className="after:content-['*'] mb-3 after:ml-0.5 after:text-red-500 block text-md font-medium text-slate-700">
                  Company Name
                </label>
                <input
                  type="text"
                  value={name}
                  required
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                  placeholder="Enter Your Company Name"
                  name="name"
                />
              </div>
              <div className="w-6/12 ml-4">
                <label className="after:content-['*'] mb-3 after:ml-0.5 after:text-red-500 block text-md font-medium text-slate-700">
                  Company Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                  placeholder="Enter Your Company Email"
                  name="name"
                />
              </div>
            </div>
            <div className="mt-8">
              <label className="after:content-['*'] mb-3 after:ml-0.5 after:text-red-500 block text-md font-medium text-slate-700">
                Company Logo
              </label>
              <input
                type="file"
                onChange={uploadImage}
                className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                placeholder="Enter Your Company Name"
                name="file"
              />
            </div>
            <div className="flex my-8">
              <div className="w-6/12">
                <label className="after:content-['*'] mb-3 after:ml-0.5 after:text-red-500 block text-md font-medium text-slate-700">
                  Company Phone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                  placeholder="Enter Your Company Name"
                  name="phone"
                />
              </div>
              <div className="w-6/12 ml-4">
                <label className="after:content-['*'] mb-3 after:ml-0.5 after:text-red-500 block text-md font-medium text-slate-700">
                  Company Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                  placeholder="Enter Your Company Email"
                  name="addresss"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-6/12 my-3 flex justify-center rounded-md bg-blue-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
