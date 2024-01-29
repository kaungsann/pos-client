import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../Api";
import { useParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { removeData } from "../../../redux/actions";
import { Button, Input, Progress, Select, SelectItem } from "@nextui-org/react";
import axios from "axios";

export default function UomEdit() {
  const [isLoading, setIsLoading] = useState(false);

  const [uomCats, setUomCats] = useState([]);

  const token = useSelector((state) => state.IduniqueData);
  const navigate = useNavigate();

  const { id } = useParams();
  const dispatch = useDispatch();

  const uomDoc = {
    name: "",
    refType: "",
    ratio: 0,
    uomCatg: "",
  };
  const [uom, setUom] = useState(uomDoc);

  const inputChangeHandler = (event) => {
    const { name, value } = event.target;
    setUom({ ...uom, [name]: value });
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await axios.patch(BASE_URL + `/uom/${id}`, uom, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!data.status) {
        if (data?.message === "Token Expire , Please Login Again") {
          dispatch(removeData(null));
        }
        toast.warn(data.message);
      } else {
        navigate("/admin/uom/all");
      }
    } catch (error) {
      console.error("Error updating uom:", error);
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const getUom = async () => {
      try {
        const { data } = await axios.get(BASE_URL + `/uom/${id}`, {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (data?.message === "Token Expire , Please Login Again") {
          dispatch(removeData(null));
        }

        const uomData = data.data[0];
        setUom({
          name: uomData.name,
          ratio: uomData.ratio,
          refType: uomData.refType,
          uomCatg: uomData.uomCatg,
        });
      } catch (error) {
        console.error("Error fetching uom:", error);
        toast.error(error.response?.data?.message || "An error occurred");
      }
    };

    const getUomCats = async () => {
      try {
        const { data } = await axios.get(BASE_URL + "/uomCategory", {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (data?.message === "Token Expire , Please Login Again") {
          dispatch(removeData(null));
        }

        const filteredUom = data.data.filter((la) => la.active === true);
        setUomCats(filteredUom);
      } catch (error) {
        console.error("Error fetching uom:", error);
        toast.error(error.response?.data?.message || "An error occurred");
      }
    };

    getUomCats();
    getUom();
  }, []);

  console.log("uom cat is a", uomCats);
  console.log("uom  is a", uom);

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
          onClick={() => navigate("/admin/uom/all")}
        >
          Discard
        </Button>
      </div>

      <div className="container mt-2">
        <h2 className="lg:text-xl font-bold my-2">Unit Of Measurement Edit</h2>
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
                  value={uom.name}
                  onChange={(e) => inputChangeHandler(e)}
                  placeholder="Enter discount name..."
                  labelPlacement="outside"
                />
              </div>
              <div className="w-60">
                <Input
                  type="number"
                  name="ratio"
                  label="Ratio"
                  value={uom.ratio}
                  onChange={(e) => inputChangeHandler(e)}
                  placeholder="Enter ratio..."
                  labelPlacement="outside"
                />
              </div>
              <div className="w-60">
                <Select
                  labelPlacement="outside"
                  label="Ref-Type"
                  name="refType"
                  placeholder="Select Ref-Type"
                  className="max-w-xs"
                  value={uom.refType}
                  onChange={(e) => inputChangeHandler(e)}
                >
                  <SelectItem key="reference" value="reference">
                    reference
                  </SelectItem>
                  <SelectItem key="bigger" value="bigger">
                    bigger
                  </SelectItem>
                  <SelectItem key="smaller" value="smaller">
                    smaller
                  </SelectItem>
                </Select>
              </div>

              <Select
                labelPlacement="outside"
                label="UOM-Category"
                name="uomCatg"
                required
                placeholder="Select an Uom Category"
                value={uom.uomCatg}
                onChange={(e) => inputChangeHandler(e)}
                className="w-60"
              >
                {uomCats.map((um) => (
                  <SelectItem key={um._id} value={um._id}>
                    {um.name}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
