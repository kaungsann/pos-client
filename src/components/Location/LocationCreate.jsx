import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { BASE_URL } from "../Api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { removeData } from "../../redux/actions";
import { Input, Button, Progress } from "@nextui-org/react";
import axios from "axios";

export default function LocationCreate() {
  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const token = useSelector((state) => state.IduniqueData);
  const dipatch = useDispatch();

  const createLocationApi = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        BASE_URL + "/location",
        { name, shortName },
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
        setIsLoading(false);
        toast.error(data.message);
      } else {
        navigate("/admin/locations/all");
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error creating category:", error);
      toast.warn(error.response.data.message);
    }
    setIsLoading(false);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!name.trim()) {
      toast.error("Please enter a location name.");
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      return;
    }

    if (!shortName.trim()) {
      toast.error("Please enter a short name.");
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      return;
    }

    createLocationApi();
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
          <h2 className="lg:text-xl font-bold ">Add Location </h2>
          <div className="flex gap-3 ">
            <Button
              type="submit"
              isDisabled={isLoading}
              isLoading={isLoading}
              size="md"
              className={`font-bold rounded-sm shadow-sm flex items-center bg-white text-blue-700 border-blue-500 border-2 ${
                isLoading
                  ? ""
                  : "hover:opacity-75 text-sm hover:text-white hover:bg-blue-700"
              }`}
              onClick={onSubmitHandler}
            >
              Save
            </Button>

            <Link to="/admin/locations/all">
              <Button className="rounded-sm shadow-sm flex items-center  text-red-500 border-red-500 bg-white border-2 hover:opacity-75 text-sm hover:text-white hover:bg-red-500 font-bold px-3 py-1.5">
                Discard
              </Button>
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
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter location name..."
                  labelPlacement="outside"
                />
              </div>
              <div className="w-60">
                <Input
                  type="text"
                  label="Short Name"
                  name="shortName"
                  value={shortName}
                  onChange={(e) => setShortName(e.target.value)}
                  placeholder="Enter short name..."
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
