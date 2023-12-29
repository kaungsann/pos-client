import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { getApi, PathData } from "../../Api";
import { useDispatch, useSelector } from "react-redux";
import { removeData } from "../../../redux/actions";
import { ToastContainer, toast } from "react-toastify";
import { Input, Progress, Button, Checkbox } from "@nextui-org/react";

export default function PartnerEdit() {
  const { id } = useParams();
  let [name, setName] = useState("");
  let [city, setCity] = useState("");
  let [contactAddress, setcontentAddress] = useState("");
  let [phone, setPhone] = useState("");
  const [isCustomer, setIsCustomer] = useState(null);
  const [isCompany, setIsCompany] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const token = useSelector((state) => state.IduniqueData);
  const dipatch = useDispatch();

  const getSinglePartnere = async () => {
    let resData = await getApi(`/partner/${id}`, token.accessToken);
    setName(resData.data[0].name);
    setCity(resData.data[0].city);
    setcontentAddress(resData.data[0].address);
    setPhone(resData.data[0].phone);
    setIsCustomer(resData.data[0].isCustomer);
    setIsCompany(resData.data[0].isCompany);
  };
  const editPartnerApi = async () => {
    const data = {};
    if (name) {
      data.name = name;
    }
    if (contactAddress) {
      data.address = contactAddress;
    }
    if (city) {
      data.city = city;
    }
    if (phone) {
      data.phone = phone;
    }
    if (isCustomer) {
      data.isCustomer = isCustomer;
    }
    if (isCompany) {
      data.isCompany = isCompany;
    }

    try {
      let resData = await PathData(`/partner/${id}`, data, token.accessToken);
      if (resData.message == "Token Expire , Please Login Again") {
        dipatch(removeData(null));
      }
      if (resData.status) {
        setIsLoading(false);
        navigate("/admin/partners/all");
      } else {
        setIsLoading(false);
        toast.error(resData.message);
      }
    } catch (error) {
      console.error("Error edit partner:", error);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    editPartnerApi();
  };
  useEffect(() => {
    getSinglePartnere();
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
          <h2 className="lg:text-xl font-bold ">Partner Edit</h2>
          <div className="flex gap-3 ">
            <Button
              type="submit"
              isDisabled={isLoading}
              isLoading={isLoading}
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
              isDisabled={isLoading}
              isLoading={isLoading}
              className={`rounded-sm shadow-sm flex items-center  text-red-500 border-red-500 bg-white border-2 text-sm ${
                isLoading
                  ? ""
                  : "hover:opacity-75 hover:text-white hover:bg-red-500 font-bold"
              }`}
              onClick={() => navigate("/admin/partners/all")}
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
            <div className="flex flex-wrap gap-8 items-center">
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
                  name="address"
                  label="Address"
                  value={contactAddress}
                  onChange={(e) => setcontentAddress(e.target.value)}
                  placeholder="Enter reference..."
                  labelPlacement="outside"
                />
              </div>
              <div className="w-60">
                <Input
                  type="number"
                  name="phone"
                  label="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter barcode..."
                  labelPlacement="outside"
                />
              </div>
              <div className="w-60 flex items-center mt-6">
                <Checkbox
                  size="md"
                  id="customer"
                  isSelected={isCustomer}
                  onChange={() => setIsCustomer(!isCustomer)}
                  className=""
                >
                  Customer
                </Checkbox>
                <Checkbox
                  size="md "
                  id="customer"
                  isSelected={isCompany}
                  className="ml-3"
                  onChange={() => setIsCompany(!isCompany)}
                >
                  Company
                </Checkbox>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
