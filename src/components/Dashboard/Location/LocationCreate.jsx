import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { sendJsonToApi } from "../../Api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { removeData } from "../../../redux/actions";

export default function LocationCreate() {
  let [name, setName] = useState("");
  const [showNameError, setShowNameError] = useState(false);
  const navigate = useNavigate();
  const token = useSelector((state) => state.IduniqueData);
  const dipatch = useDispatch();

  const createCategoryApi = async () => {
    if (name.trim() === "") {
      setShowNameError(true);
    } else {
      setShowNameError(false);
    }
    const data = {
      name: name,
    };

    try {
      let resData = await sendJsonToApi("/location", data, token.accessToken);
      if (resData.message == "Token Expire , Please Login Again") {
        dipatch(removeData(null));
      }
      if (resData.status) {
        navigate("/admin/locations/all");
      } else {
        toast(resData.message);
      }
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    createCategoryApi();
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
      <div className="flex">
        <button
          type="submit"
          className="font-bold rounded-sm shadow-sm flex items-cente text-blue-700 border-blue-500 border-2 hover:opacity-75 text-md hover:text-white hover:bg-blue-700 px-6 py-2"
          onClick={handleChange}
        >
          Save
        </button>
        <Link to="/admin/locations/all">
          <button className="rounded-sm ml-3 transition shadow-sm flex items-center text-[#4338ca] border-[#4338ca] border-2 hover:opacity-75 text-md hover:text-white hover:bg-[#4338ca] font-bold px-6 py-2">
            Discard
          </button>
        </Link>
      </div>

      <h2 className="py-1.5 text-lg font-bold mt-6 bg-blue-600 text-white pl-4">
        Location Information
      </h2>

      <div className="w-full">
        <form onSubmit={handleChange} className="mt-3">
          <div className="w-80">
            <label
              className={`text-md font-semibold ${
                showNameError ? "text-red-600" : ""
              }`}
            >
              Name*
            </label>
            <input
              type="text"
              style={{ backgroundColor: "transparent" }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full py-1 rounded-md border-b-2 bg-white focus:outline-none my-2 ${
                showNameError ? "border-red-600" : "border-slate-400"
              }`}
              placeholder="Enter Location name"
            />
          </div>
        </form>
      </div>
    </>
  );
}
