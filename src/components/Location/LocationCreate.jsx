import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { BASE_URL } from "../Api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { removeData } from "../../redux/actions";
import { Input } from "@nextui-org/react";
import axios from "axios";

export default function LocationCreate() {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const token = useSelector((state) => state.IduniqueData);
  const dipatch = useDispatch();

  const createLocationApi = async () => {
    try {
      const { data } = await axios.post(
        BASE_URL + "/location",
        { name },
        {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!data.status) {
        if (data?.message == "Token Expire , Please Login Again") {
          dipatch(removeData(null));
        }
        toast(data.message);
      } else {
        navigate("/admin/locations/all");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      toast(error.response.data.message);
    }
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast("Please enter a location name.");
      return;
    }

    createLocationApi();
  };

  const onChangeHandler = (e) => {
    const value = e.target.value;
    setName(value);
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
      <div className="flex gap-3 my-5">
        <button
          type="submit"
          className="font-bold rounded-sm shadow-sm flex items-center text-blue-700 border-blue-500 border-2 hover:opacity-75 text-sm hover:text-white hover:bg-blue-700 px-3 py-1.5"
          onClick={onSubmitHandler}
        >
          Save
        </button>
        <Link to="/admin/locations/all">
          <button className="rounded-sm shadow-sm flex items-center  text-red-500 border-red-500 bg-white border-2 hover:opacity-75 text-sm hover:text-white hover:bg-red-500 font-bold px-3 py-1.5">
            Discard
          </button>
        </Link>
      </div>
      <div className="container mt-2">
        <h2 className="lg:text-xl font-bold my-2">Add Location </h2>
        <div className="container bg-white p-5 rounded-lg max-w-6xl">
          <form className="flex justify-between gap-10 p-5">
            <div className="flex flex-wrap gap-8">
              <div className="w-60">
                <Input
                  type="text"
                  label="Name"
                  name="name"
                  value={name}
                  onChange={onChangeHandler}
                  placeholder="Enter location name..."
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
