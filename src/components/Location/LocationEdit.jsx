import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getApi, PathData } from "../Api";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { removeData } from "../../redux/actions";
import { Input, Button, Progress } from "@nextui-org/react";

export default function LocationEdit() {
  let [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const token = useSelector((state) => state.IduniqueData);
  const navigate = useNavigate();
  const { id } = useParams();
  const dipatch = useDispatch();

  const getLocations = async () => {
    try {
      const response = await getApi(`/location/${id}`, token.accessToken);
      if (response.message == "Token Expire , Please Login Again") {
        dipatch(removeData(null));
      }
      setName(response.data[0].name);
      setShortName(response.data[0].shortName);
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  const editCategoryApi = async () => {
    setIsLoading(true);
    const data = { name, shortName };
    try {
      let resData = await PathData(`/location/${id}`, data, token.accessToken);
      if (resData.status) {
        setIsLoading(false);
        navigate("/admin/locations/all");
      } else {
        setIsLoading(false);
        toast(resData.message);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error creating location:", error);
    }
    setIsLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    editCategoryApi();
  };

  const handleDiscard = (e) => {
    e.preventDefault();
    navigate("/admin/locations/all");
  };

  useEffect(() => {
    getLocations();
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
          <h2 className="lg:text-xl font-bold">Location Edit</h2>
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
              onClick={handleSubmit}
            >
              Save
            </Button>

            <Button
              onClick={handleDiscard}
              className="rounded-sm shadow-sm flex items-center  text-red-500 border-red-500 bg-white border-2 hover:opacity-75 text-sm hover:text-white hover:bg-red-500 font-bold px-3 py-1.5"
            >
              Discard
            </Button>
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
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter product name..."
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
