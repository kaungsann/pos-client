import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendJsonToApi } from "../../Api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { removeData } from "../../../redux/actions";
import { Input, Progress, Button, Checkbox } from "@nextui-org/react";

export default function OpexCreateForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const token = useSelector((state) => state.IduniqueData);
  const dipatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    remark: "",
    ref: "",
    date: "",
    amount: null,
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await sendJsonToApi(
        "/opex",
        formData,
        token.accessToken
      );

      if (response.message === "Token Expire , Please Login Again")
        dipatch(removeData(null));

      if (response.status) {
        navigate("/admin/opex/all");
        setIsLoading(false);
      } else {
        toast.error(response.message || "An error occurred");
        setIsLoading(false);
      }
    } catch (error) {
      toast.error(error.message || "An error occurred");
    }
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
        <Button
          type="submit"
          isDisabled={isLoading}
          isLoading={isLoading}
          className={`font-bold rounded-sm shadow-sm flex items-center bg-white text-blue-700 border-blue-500 border-2 ${isLoading
              ? ""
              : "hover:opacity-75 text-sm hover:text-white hover:bg-blue-700"
            }`}
          onClick={handleSubmit}
        >
          Save
        </Button>
        <Button
          isDisabled={isLoading}
          isLoading={isLoading}
          className={`rounded-sm shadow-sm flex items-center  text-red-500 border-red-500 bg-white border-2 text-sm ${isLoading
              ? ""
              : "hover:opacity-75 hover:text-white hover:bg-red-500 font-bold"
            }`}
          onClick={() => navigate("/admin/opex/all")}
        >
          Discard
        </Button>
      </div>
      <div className="container mt-2">
        <h2 className="lg:text-xl font-bold my-2">Opex Create</h2>
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
                  value={formData.name}
                  // color={isInvalid ? "danger" : "success"}
                  // errorMessage={isInvalid && "Please enter a valid email"}
                  onChange={(e) => handleInputChange(e)}
                  placeholder="Enter Partner name..."
                  labelPlacement="outside"
                />
              </div>
              <div className="w-60">
                <Input
                  type="text"
                  name="remark"
                  label="Remark"
                  value={formData.remark}
                  onChange={(e) => handleInputChange(e)}
                  placeholder="Enter remark..."
                  labelPlacement="outside"
                />
              </div>
              <div className="w-60">
                <Input
                  type="number"
                  name="amount"
                  label="Amount"
                  value={formData.amount}
                  onChange={(e) => handleInputChange(e)}
                  placeholder="Enter amount..."
                  labelPlacement="outside"
                />
              </div>
              <div className="w-60">
                <Input
                  type="text"
                  name="ref"
                  label="Ref"
                  value={formData.ref}
                  onChange={(e) => handleInputChange(e)}
                  placeholder="Enter ref..."
                  labelPlacement="outside"
                />
              </div>
              <div className="w-60">
                <Input
                  type="date"
                  name="date"
                  label="Date"
                  value={formData.date}
                  onChange={(e) => handleInputChange(e)}
                  placeholder="Enter date..."
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
