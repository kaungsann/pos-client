import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormPostApi, sendJsonToApi } from "../../Api";
import { useSelector } from "react-redux";
import { Input, Select, SelectItem } from "@nextui-org/react";


export default function EmployeeCreate() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [file, setFile] = useState("");
  const [birthdate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");

  const navigate = useNavigate();

  const token = useSelector((state) => state.IduniqueData);

  const handleEmployee = async () => {
    let data = {
      name,
      email,
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
    formData.append("birthdate", birthdate);
    formData.append("address", address);
    formData.append("image", file);

    let response = await sendJsonToApi("/employee", data, token.accessToken);

    if (response.status) {
      navigate("/admin/employee/all");
    } else {
      toast(response.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleEmployee();
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
      <div className="flex gap-3 my-5">
        <button
          type="submit"
          className="font-bold rounded-sm shadow-sm flex items-center text-blue-700 border-blue-500 border-2 hover:opacity-75 text-sm hover:text-white hover:bg-blue-700 px-3 py-1.5"
          onClick={handleSubmit}
        >
          Save
        </button>
        <Link to="/admin/employee/all">
          <button className="rounded-sm shadow-sm flex items-center  text-red-500 border-red-500 bg-white border-2 hover:opacity-75 text-sm hover:text-white hover:bg-red-500 font-bold px-3 py-1.5">
            Discard
          </button>
        </Link>
      </div>

      

      <div className="container mt-2">
        <h2 className="lg:text-xl font-bold my-2">Employee Create</h2>
        <div className="container bg-white p-5 rounded-lg max-w-6xl">
          <form className="flex justify-between gap-10 p-5">
            <div className="flex flex-wrap gap-8">
              <div className="w-60">
                <Input
                  type="text"
                  label="Name"
                  name="name"
                  value={name}
                  // color={isInvalid ? "danger" : "success"}
                  // errorMessage={isInvalid && "Please enter a valid email"}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter Employee name..."
                  labelPlacement="outside"
                />
              </div>
              <div className="w-60">
                <Input
                  type="text"
                  name="email"
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter reference..."
                  labelPlacement="outside"
                />
              </div>
              <div className="w-60   relative">
                <Input
                  type="text"
                  isDisabled
                  name="phone"
                  label="Phone"
                  value={phone}
                  placeholder="Enter Phone..."
                  labelPlacement="outside"
                />
              </div>
              <div className="w-60">
                <span className="text-sm">DOB</span>
                <Input
                  type="date"
                  name="date"
                  labelPlacement="outside"
                  value={birthdate}
                  onChange={(e) => setBirthDate(e.target.value)}
                />
              </div>
              <div className="w-60 my-2">
                <label className="after:content-['*'] mb-3 after:ml-0.5 after:text-red-500 block text-lg font-semibold text-slate-600">
                  Gender
                </label>
                <select
                  onChange={(e) => setGender(e.target.value)}
                  id="gender"
                  required
                  name="gender"
                  className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                  value={gender}
                >
                  <option disabled value="">
                    Select an option
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
