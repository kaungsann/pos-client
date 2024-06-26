import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { getApi, PathData } from "../Api";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { removeData } from "../../redux/actions";
import { Input } from "@nextui-org/react";

export default function CategoryEdit() {
  let [name, setName] = useState("");
  const token = useSelector((state) => state.IduniqueData);
  const navigate = useNavigate();
  const { id } = useParams();
  const dipatch = useDispatch();

  const getCategory = async () => {
    try {
      const response = await getApi(`/category/${id}`, token.accessToken);
      if (response.message == "Token Expire , Please Login Again") {
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
        toast.error(resData.message);
      }
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const handleSubmit = (e) => {
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
          <h2 className="lg:text-xl font-bold ">Category edit</h2>
          <div className="flex gap-3 ">
            <button
              type="submit"
              className="font-bold rounded-sm shadow-sm flex items-center text-blue-700 border-blue-500 border-2 hover:opacity-75 text-sm hover:text-white hover:bg-blue-700 px-3 py-1.5"
              onClick={handleSubmit}
            >
              Save
            </button>
            <Link to="/admin/categorys/all">
              <button className="rounded-sm shadow-sm flex items-center  text-red-500 border-red-500 bg-white border-2 hover:opacity-75 text-sm hover:text-white hover:bg-red-500 font-bold px-3 py-1.5">
                Discard
              </button>
            </Link>
          </div>
        </div>
        <div className="container bg-white p-5 rounded-lg max-w-6xl">
          <form className="flex justify-between gap-10 p-5">
            <div className="flex flex-wrap gap-8">
              <div className="w-60">
                <Input
                  type="text"
                  label="Name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
