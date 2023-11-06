import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { getApi, PathData } from "../../Api";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LocationEdit() {
  let [name, setName] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const token = useSelector((state) => state.IduniqueData);

  const getLocation = async () => {
    let resData = await getApi(`/location/${id}`, token.accessToken);
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-md border-b-2 border-slate-400 bg-white focus:outline-none my-2"
              placeholder="Enter location name"
            />
          </div>
        </form>
      </div>
    </>
  );
}
