import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { Button, Input, Progress, Select, SelectItem } from "@nextui-org/react";
import { FormPostApi } from "../Api";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MoonLoader from "react-spinners/MoonLoader";
import { useSelector } from "react-redux";

export default function Register() {
  const [name, setname] = useState("");
  const [phone, setphone] = useState("");
  const [email, setemail] = useState("");
  const [address, setAddress] = useState("");
  const [file, setFile] = useState("");
  const [birth, setBirth] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [loading, setLoading] = useState(false);

  const [password, setpassword] = useState("");

  const token = useSelector((state) => state.IduniqueData);

  const navigate = useNavigate();

  const fileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const registerUser = async (e) => {
    setLoading(true);
    e.preventDefault();
    const formData = new FormData();

    if (phone) {
      formData.append("phone", phone);
    }
    if (gender) {
      formData.append("gender", gender);
    }
    if (city) {
      formData.append("city", city);
    }
    if (birth) {
      formData.append("birthdate", birth);
    }
    if (address) {
      formData.append("address", address);
    }
    if (file) {
      formData.append("image", file);
    }
    formData.append("username", name);
    formData.append("email", email);
    formData.append("password", password);

    let response = await FormPostApi("/user", formData, token.accessToken);

    if (response.status) {
      setLoading(false);
      navigate("/admin/user/all");
    } else {
      setLoading(false);
      toast.error(response.message);
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

      <div className="container mt-2">
        <div className="flex flex-row justify-between my-4 max-w-6xl">
          <h2 className="lg:text-xl font-bold ">Staff Edit</h2>
          <div className="flex gap-3 ">
            <button
              type="submit"
              className="font-bold rounded-sm shadow-sm flex items-center text-blue-700 border-blue-500 border-2 hover:opacity-75 text-sm hover:text-white hover:bg-blue-700 px-3 py-1.5"
              onClick={registerUser}
            >
              Save
            </button>
            <Link to="/admin/user/all">
              <button className="rounded-sm shadow-sm flex items-center  text-red-500 border-red-500 bg-white border-2 hover:opacity-75 text-sm hover:text-white hover:bg-red-500 font-bold px-3 py-1.5">
                Discard
              </button>
            </Link>
          </div>
        </div>
        <div className="container bg-white p-5 rounded-lg max-w-6xl">
          {isLoading && (
            <Progress size="sm" isIndeterminate aria-label="Loading..." />
          )}
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
                  onChange={(e) => setname(e.target.value)}
                  placeholder="Enter Staff name..."
                  labelPlacement="outside"
                />
              </div>
              <div className="w-60">
                <Input
                  type="email"
                  required
                  name="email"
                  label="Email"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                  placeholder="Enter Email..."
                  labelPlacement="outside"
                />
              </div>
              <div className="w-60">
                <Input
                  type="text"
                  name="address"
                  label="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter Address..."
                  labelPlacement="outside"
                />
              </div>
              <div className="w-60">
                <span className="text-sm">Date of Birth</span>
                <Input
                  type="date"
                  name="dob"
                  labelPlacement="outside"
                  onChange={(e) => setBirth(e.target.value)}
                  value={
                    birth ? new Date(birth).toISOString().split("T")[0] : ""
                  }
                />
              </div>
              <div className="w-60">
                <Input
                  type="number"
                  name="phone"
                  label="Phone"
                  value={phone}
                  onChange={(e) => setphone(e.target.value)}
                  placeholder="Enter Phone..."
                  labelPlacement="outside"
                />
              </div>
              <div className="w-60">
                <Input
                  type="text"
                  name="city"
                  label="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter City..."
                  labelPlacement="outside"
                />
              </div>
              <div className="mt-1">
                <div className="w-60">
                  <Select
                    labelPlacement="outside"
                    label="Gender"
                    name="gender"
                    placeholder="Select Gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="max-w-xs"
                  >
                    {/* Replace dynamic data with fixed options */}
                    <SelectItem value="male" key="male">
                      Male
                    </SelectItem>
                    <SelectItem value="female" key="female">
                      Female
                    </SelectItem>
                    <SelectItem value="other" key="other"></SelectItem>
                  </Select>
                </div>
              </div>
              <div className="w-60">
                <Input
                  type="text"
                  name="password"
                  label="Password"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                  placeholder="Enter Password..."
                  labelPlacement="outside"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
