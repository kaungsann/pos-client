import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FormPathApi, getApi } from "../../Api";
import { removeData } from "../../../redux/actions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChangePassword from "../../utils/ChangePassword"
import { format } from "date-fns";


export default function StaffEdit() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [birth, setBirth] = useState("");
  const [gender, setGender] = useState("");
  const [password , setPassword] = useState("")
  const [showBox , setShowBox] = useState(false)

  const token = useSelector((state) => state.IduniqueData);
  const dipatch = useDispatch();

  const navigate = useNavigate()

  const getSingleStaff = async () => {
    const response = await getApi(`/user/${id}`, token.accessToken);
    if (response.status) {
      const formattedExpireDate = response.data[0].birthdate
      ? new Date(response.data[0].birthdate).toISOString().split('T')[0]
      : '';
      setBirth(formattedExpireDate);
      setName(response.data[0].username);
      setEmail(response.data[0].email);
      setAddress(response.data[0].address ? response.data[0].address : null);
      setPhone(response.data[0].phone ? response.data[0].phone : null);
      setCity(response.data[0].city ? response.data[0].city : null);
      setGender(response.data[0].gender ? response.data[0].gender : null);
    }
  };

  const EditStaffInfoApi = async () => {
    const formData = new FormData();
    formData.append("password", password);
    if (name) {
      formData.append("username", name);
    }
    if (email) {
      formData.append("email", email);
    }
    if (phone) {
      formData.append("phone", phone);
    }
    if (address) {
      formData.append("address", address);
    }
    if (birth) {
      formData.append("birthdate", birth);
    }
    if (city) {
      formData.append("city", city);
    }
    if (gender) {
      formData.append("gender", gender);
    }

    let resData = await FormPathApi(`/user/${id}`, formData, token.accessToken);
    if (resData.message == "Token Expire , Please Login Again") {
      dipatch(removeData(null));
    }
    console.log("uer is a" , resData)
    if (resData.status) {
      navigate("/admin/user/all");
    } else {
      toast(resData.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    EditStaffInfoApi();
  };

  useEffect(() => {
    getSingleStaff();
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
        style={{ width: "450px" }}
      />
      <div className="flex min-h-full w-full flex-col">
        <div className="mb-3 pb-6 border-b-2 border-b-slate-300 flex justify-between">
          <h2 className="text-2xl font-bold text-slate-700 ">
            Edit User Information
          </h2>
          <Link to="/admin/user/all">
            <div className="font-bold rounded-sm shadow-sm flex items-cente text-blue-700 border-blue-500 border-2 hover:opacity-75 text-md hover:text-white hover:bg-blue-700 px-6 py-2">
              Back
            </div>
          </Link>
        </div>
        <form
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
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={address}
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
                value={birth}
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
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                id="gender"
                required
                name="gender"
                className=" px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
              >
                <option disabled value>
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
                value={city}
                id="city"
                onChange={(e) => setCity(e.target.value)}
                name="city"
                className=" px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
              >
                <option disabled value>
                  Select an option
                </option>
                <option value="Yagon">Yagon</option>
                <option value="Mandalay">Mandalay</option>
                <option value="PyiOoLwin">PyiOoLwin</option>
                <option value="Pago">Bago</option>
              </select>
            </div>
          </div>


        </form>
        <button
          onClick={() => setShowBox(true)}
          className="w-72 my-3 items-center flex justify-center rounded-md bg-blue-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Submit
        </button>
      </div>

       <div className="w-96 absolute top-32 left-0 right-0 z-50 mx-auto bg-white rounded-md shadow-md flex justify-center cursor-pointer">
        {showBox && (
          <div className="w-72 my-3">
            <div className="flex justify-between">
              <label
                htmlFor="phone"
                className="after:content-['*'] mb-3 after:ml-0.5 after:text-red-500 block text-lg font-semibold text-slate-600"
              >
                Password*
              </label>
               <h3 onClick={() => setShowBox(false)} className="text-slate-600 font-semibold text-xl hover:text-slate-400">X</h3>
             </div>

            <div className="mt-2">
              <input
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                name="password"
                type="password"
                required
                placeholder="Enter the admin password"
                className=" px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
              />
              <button
                onClick={handleSubmit}
                className="w-72 my-3 items-center flex justify-center rounded-md bg-blue-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
