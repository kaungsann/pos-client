import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../Api";
import { useParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { removeData } from "../../../redux/actions";
import { Button, Input, Progress } from "@nextui-org/react";
import axios from "axios";

export default function DiscountEdit() {
  const [isLoading, setIsLoading] = useState(false);

  const token = useSelector((state) => state.IduniqueData);
  const navigate = useNavigate();

  const { id } = useParams();
  const dispatch = useDispatch();

  const DiscountDoc = {
    name: "",
    amount: 0,
  };
  const [discount, setDiscount] = useState(DiscountDoc);

  const inputChangeHandler = (event) => {
    const { name, value } = event.target;
    setDiscount({ ...discount, [name]: value });
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      console.log("discout is a", discount);
      const { data } = await axios.patch(
        BASE_URL + `/discount/${id}`,
        discount,
        {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!data.status) {
        if (data?.message === "Token Expire , Please Login Again") {
          dispatch(removeData(null));
        }
        toast.warn(data.message);
      } else {
        navigate("/admin/discount/all");
      }
    } catch (error) {
      console.error("Error updating discount:", error);
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchDiscount = async () => {
      try {
        const { data } = await axios.get(BASE_URL + `/discount/${id}`, {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (data?.message === "Token Expire , Please Login Again") {
          dispatch(removeData(null));
        }

        const discountData = data.data[0];
        setDiscount({
          name: discountData.name,
          amount: discountData.amount,
        });
      } catch (error) {
        console.error("Error fetching discount:", error);
        toast.error(error.response?.data?.message || "An error occurred");
      }
    };

    fetchDiscount();
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
      <div className="flex gap-3 my-5">
        <Button
          type="submit"
          isDisabled={isLoading}
          isLoading={isLoading}
          className={`font-bold rounded-sm shadow-sm flex items-center bg-white text-blue-700 border-blue-500 border-2 ${
            isLoading
              ? ""
              : "hover:opacity-75 text-sm hover:text-white hover:bg-blue-700"
          }`}
          onClick={onSubmitHandler}
        >
          Save
        </Button>
        <Button
          isDisabled={isLoading}
          isLoading={isLoading}
          className={`rounded-sm shadow-sm flex items-center  text-red-500 border-red-500 bg-white border-2 text-sm ${
            isLoading
              ? ""
              : "hover:opacity-75 hover:text-white hover:bg-red-500 font-bold"
          }`}
          onClick={() => navigate("/admin/discount/all")}
        >
          Discard
        </Button>
      </div>

      <div className="container mt-2">
        <h2 className="lg:text-xl font-bold my-2">Discount Edit</h2>
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
                  value={discount.name}
                  onChange={(e) => inputChangeHandler(e)}
                  placeholder="Enter discount name..."
                  labelPlacement="outside"
                />
              </div>
              <div className="w-60">
                <Input
                  type="number"
                  name="amount"
                  label="Amount"
                  value={discount.amount}
                  onChange={(e) => inputChangeHandler(e)}
                  placeholder="Enter amount..."
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
