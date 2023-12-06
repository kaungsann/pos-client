import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { sendJsonToApi } from "../../Api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { removeData } from "../../../redux/actions";

export default function CategoryCreate() {
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
      let resData = await sendJsonToApi("/category", data, token.accessToken);
      if (resData.message == "Token Expire , Please Login Again") {
        dipatch(removeData(null));
      }
      if (resData.status) {
        navigate("/admin/categorys/all");
      } else {
        toast(resData.message);
      }
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };
  const handleChange = (e) => {
    e.preventDefault();
    createCategoryApi();
  };
  console.log("name is", name);
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
          className="font-bold rounded-sm shadow-sm flex items-center text-blue-700 border-blue-500 border-2 hover:opacity-75 text-md hover:text-white hover:bg-blue-700 px-3 py-1.5 text-sm"
          onClick={handleChange}
        >
          Save
        </button>
        <Link to="/admin/categorys/all">
          <button className="rounded-sm ml-3 transition shadow-sm flex items-center text-[#4338ca] border-[#4338ca] border-2 hover:opacity-75 text-md hover:text-white hover:bg-[#4338ca] font-bold px-3 py-1.5">
            Discard
          </button>
        </Link>
      </div>

      <div className="mt-2">
        <div className="w-full mx-auto flex justify-center cursor-pointer flex-col">
          <h2 className="py-1.5 text-md font-bold mt-2 bg-blue-600 text-white pl-4">
            Add New Category
          </h2>
        </div>
        <form onSubmit={handleChange} className="mt-3 flex flex-col">
          <div className="w-60">
            <label
              className={`text-md font-semibold ${
                showNameError ? "text-red-600" : ""
              }`}
            >
              Name*
            </label>
            <input
              type="text"
              value={name}
              style={{ backgroundColor: "transparent" }}
              onChange={(e) => setName(e.target.value.toLocaleLowerCase())}
              className={`w-full py-1 rounded-md border-b-2 bg-white focus:outline-none my-2 ${
                showNameError ? "border-red-600" : "border-slate-400"
              }`}
              placeholder="Enter category name"
            />
          </div>
        </form>
      </div>
    </>
  );
}
