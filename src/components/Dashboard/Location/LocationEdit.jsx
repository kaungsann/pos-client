import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { getApi, PathData } from "../../Api";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { removeData } from "../../../redux/actions";
import { Input, Select, SelectItem } from "@nextui-org/react";

export default function LocationEdit() {
  let [name, setName] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const token = useSelector((state) => state.IduniqueData);
  const dipatch = useDispatch();

  const getLocation = async () => {
    let resData = await getApi(`/location/${id}`, token.accessToken);
    if (resData.message == "Token Expire , Please Login Again") {
      dipatch(removeData(null));
    }
    setName(resData.data[0].name);
  };

  const editCategoryApi = async () => {
    const data = {};
    if (name) {
      data.name = name;
    }

    try {
      let resData = await PathData(`/location/${id}`, data, token.accessToken);
      if (resData.status) {
        navigate("/admin/locations/all");
      } else {
        toast(resData.message);
      }
    } catch (error) {
      console.error("Error creating location:", error);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    editCategoryApi();
  };

  useEffect(() => {
    getLocation();
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
      <div className="flex gap-3 my-5">
        <button
          type="submit"
          className="font-bold rounded-sm shadow-sm flex items-center text-blue-700 border-blue-500 border-2 hover:opacity-75 text-sm hover:text-white hover:bg-blue-700 px-3 py-1.5"
          onClick={handleChange}
        >
          Save
        </button>
        <Link to="/admin/locations/all">
          <button className="rounded-sm shadow-sm flex items-center  text-red-500 border-red-500 bg-white border-2 hover:opacity-75 text-sm hover:text-white hover:bg-red-500 font-bold px-3 py-1.5">
            Discard
          </button>
        </Link>
      </div>
      <div className=" mx-auto mt-4">
        <div className="w-full mx-auto flex justify-center cursor-pointer flex-col">
          <h2 className="py-1.5 text-lg font-bold mt-2 bg-blue-600 text-white pl-4">
            Edit Location information
          </h2>
        </div>
        <form onSubmit={handleChange} className="mt-4 flex">
          <div className="w-80">
            <label className="text-md font-semibold">Name*</label>
            <input
              type="text"
              style={{ backgroundColor: "transparent" }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-md border-b-2 border-slate-400 bg-white focus:outline-none my-2"
              placeholder="Enter location name"
            />
          </div>
        </form>
      </div>
      <div className="container mt-2">
        <h2 className="lg:text-xl font-bold my-2">Product Edit</h2>
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
                  onChange={(e) => handleChange(e)}
                  placeholder="Enter product name..."
                  labelPlacement="outside"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
