import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { getApi, PathData } from "../../Api";
import { useDispatch, useSelector } from "react-redux";
import { removeData } from "../../../redux/actions";
import { ToastContainer, toast } from "react-toastify";
import { Input, Select, SelectItem, Checkbox } from "@nextui-org/react";

export default function PartnerEdit() {
  const { id } = useParams();
  let [name, setName] = useState("");
  let [city, setCity] = useState("");
  let [contactAddress, setcontentAddress] = useState("");
  let [phone, setPhone] = useState("");
  const [isCustomer, setIsCustomer] = useState(null);
  const [isCompany, setIsCompany] = useState(null);
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
        navigate("/admin/partners/all");
      } else {
        toast(resData.message);
      }
    } catch (error) {
      console.error("Error edit partner:", error);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
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
          onClick={handleSubmit}
        >
          Save
        </button>
        <Link to="/admin/products/all">
          <button className="rounded-sm shadow-sm flex items-center  text-red-500 border-red-500 bg-white border-2 hover:opacity-75 text-sm hover:text-white hover:bg-red-500 font-bold px-3 py-1.5">
            Discard
          </button>
        </Link>
      </div>
      <div className="container mt-2">
        <h2 className="lg:text-xl font-bold my-2">Partner Edit</h2>
        <div className="container bg-white p-5 rounded-lg max-w-6xl">
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
                  type="text"
                  isDisabled
                  name="phone"
                  label="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter barcode..."
                  labelPlacement="outside"
                />
              </div>
              <Checkbox defaultSelected size="lg"
                id="customer"
                isSelected={isCustomer}
                onChange={() => setIsCustomer(!isCustomer)}
              >Customer</Checkbox>
              <Checkbox defaultSelected size="lg"
                id="customer"
                isSelected={isCompany}
                onChange={() => setIsCompany(!isCompany)}
              >
              Company</Checkbox>
           
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
