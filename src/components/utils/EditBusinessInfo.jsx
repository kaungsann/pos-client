import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormPathApi, getApi } from "../Api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MoonLoader from "react-spinners/MoonLoader";

export default function EditBusinessInfo({ reBack, updateInfo }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [id, setId] = useState("");
  const [fiie, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = useSelector((state) => state.IduniqueData);
  const dipatch = useDispatch();

  const uploadImage = (e) => {
    let selectImage = e.target.files[0];
    setFile(selectImage);
  };

  const getCompanyInfo = async () => {
    const resData = await getApi("/company", token.accessToken);
    if (resData.status) {
      setName(resData.data[0].name);
      setEmail(resData.data[0].email);
      setPhone(resData.data[0].phone);
      setAddress(resData.data[0].address);
      setId(resData.data[0].id);
    }
  };

  const handleDiscardClick = () => {
    reBack();
  };

  const handleChange = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    if (name) {
      formData.append("name", name);
    }
    if (phone) {
      formData.append("phone", phone);
    }
    if (email) {
      formData.append("email", email);
    }
    if (address) {
      formData.append("address", address);
    }
    if (fiie) {
      formData.append("image", fiie);
    }

    const response = await FormPathApi(
      `/company/${id}`,
      formData,
      token.accessToken
    );
    if (response.message == "Token Expire , Please Login Again") {
      dipatch(removeData(null));
    }
    if (response.status) {
      handleDiscardClick();
      setLoading(false);

      toast(response.message);

      updateInfo(response.data[0]);
    } else {
      setLoading(false);

      toast.error(response.message);
    }
  };

  useEffect(() => {
    getCompanyInfo();
  }, [id]);
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
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
          Edit Your Business Information
        </h1>

        <div>
          <form className="mt-8" onSubmit={handleChange}>
            <div className="flex">
              <div className="w-6/12">
                <label className="after:content-['*'] mb-3 after:ml-0.5 after:text-red-500 block text-lg font-semibold text-slate-600">
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
                <label className="after:content-['*'] mb-3 after:ml-0.5 after:text-red-500 block text-lg font-semibold text-slate-600">
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
              <label className="after:content-['*'] mb-3 after:ml-0.5 after:text-red-500 block text-lg font-semibold text-slate-600">
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
                <label className="after:content-['*'] mb-3 after:ml-0.5 after:text-red-500 block text-lg font-semibold text-slate-600">
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
                <label className="after:content-['*'] mb-3 after:ml-0.5 after:text-red-500 block text-lg font-semibold text-slate-600">
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
            <div className="flex">
              <button
                type="submit"
                className="w-6/12 mt-8 my-3 flex justify-center rounded-md bg-blue-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
                Edit Info
              </button>
              <div
                onClick={handleDiscardClick}
                className="w-6/12 mt-8 ml-2 my-3 flex justify-center rounded-md focus:outline-none hover:text-white hover:bg-[#4338ca] px-3 py-1.5 text-sm font-semibold leading-6 border-2 border-[#4338ca] text-[#4338ca] shadow-sm"
              >
                Discard
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
