import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../Api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { removeData } from "../../../redux/actions";
import { Input } from "@nextui-org/react";
import axios from "axios";

export default function UomCatCreate() {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const token = useSelector((state) => state.IduniqueData);
  const dipatch = useDispatch();

  const createUomCategoryApi = async () => {
    try {
      const { data } = await axios.post(
        BASE_URL + "/uomCategory",
        { name },
        {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!data.status) {
        if (
          (<datalist></datalist>)?.message ==
          "Token Expire , Please Login Again"
        ) {
          dipatch(removeData(null));
        }

        toast.error(data.data.message);
      } else {
        navigate("/admin/uom-category/all");
      }
    } catch (error) {
      console.error("Error creating uom category:", error);
    }
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter a uom category name.");
      return;
    }

    createUomCategoryApi();
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
        hideProgressBar={false}
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
          <h2 className="lg:text-xl font-bold ">UOM Category </h2>
          <div className="flex gap-3 ">
            <button
              type="submit"
              className="font-bold rounded-sm shadow-sm flex items-center text-blue-700 border-blue-500 border-2 hover:opacity-75 text-sm hover:text-white hover:bg-blue-700 px-3 py-1.5"
              onClick={onSubmitHandler}
            >
              Save
            </button>
            <Link to="/admin/uom-category/all">
              <button className="rounded-sm shadow-sm flex items-center  text-red-500 border-red-500 bg-white border-2 hover:opacity-75 text-sm hover:text-white hover:bg-red-500 font-bold px-3 py-1.5">
                Discard
              </button>
            </Link>
          </div>
        </div>
        <div className="container bg-white p-5 rounded-lg max-w-6xl">
          <form
            className="flex justify-between gap-10 p-5"
            onSubmit={onSubmitHandler}
          >
            <div className="flex flex-wrap gap-8">
              <div className="w-60">
                <Input
                  type="text"
                  label="Name"
                  name="name"
                  value={name}
                  onChange={onChangeHandler}
                  placeholder="Enter uom category name..."
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
