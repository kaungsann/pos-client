import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { getApi, PathData } from "../../Api";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { removeData } from "../../../redux/actions";

export default function CategoryEdit() {
  let [name, setName] = useState("");
  const token = useSelector((state) => state.IduniqueData);
  const navigate = useNavigate();
  const { id } = useParams();
  const dipatch = useDispatch();

  const getCategory = async () => {
    try {
      const response = await getApi(`/category/${id}`, token.accessToken);
      if (response.success && response.success == false) {
        dipatch(removeData(null));
      }
      setName(response.data[0].name);
    } catch (error) {
      console.error("Error fetching category:", error);
    }
  };

  const editCategoryApi = async () => {
    const data = {};
    if (name) {
      data.name = name;
    }
    try {
      let resData = await PathData(`/category/${id}`, data, token.accessToken);
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
    editCategoryApi();
  };

  useEffect(() => {
    getCategory();
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
      <div className="flex">
        <button
          type="submit"
          className="font-bold rounded-sm shadow-sm flex items-cente text-blue-700 border-blue-500 border-2 hover:opacity-75 text-md hover:text-white hover:bg-blue-700 px-6 py-2"
          onClick={handleChange}
        >
          Save
        </button>
        <Link to="/admin/categorys/all">
          <button className="rounded-sm ml-3 transition shadow-sm flex items-center text-[#4338ca] border-[#4338ca] border-2 hover:opacity-75 text-md hover:text-white hover:bg-[#4338ca] font-bold px-6 py-2">
            Discard
          </button>
        </Link>
      </div>
      <div className=" mt-2">
        <div className="w-full mx-auto flex justify-center cursor-pointer flex-col">
          <h2 className="py-1.5 text-lg font-bold mt-2 bg-blue-600 text-white pl-4">
            Add New Category
          </h2>
        </div>
        <form onSubmit={handleChange} className="mt-3 flex flex-col">
          <div className="w-60">
            <label className="text-md font-semibold">Name*</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-md border-b-2 border-slate-400 bg-white focus:outline-none my-2"
              placeholder="Enter category name"
            />
          </div>
        </form>
      </div>
    </>
  );
}
