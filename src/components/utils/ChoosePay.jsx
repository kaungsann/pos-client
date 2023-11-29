import React, { useEffect, useState } from "react";
import PaySlip from "./PaySlip";
import { useDispatch, useSelector } from "react-redux";
import { add } from "../../redux/actions";
import { getApi, sendJsonToApi } from "../Api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ChoosePay({ totalCost, change, tax, subTotal }) {
  const [display, setDisplay] = useState("");
  const [partner, setPartner] = useState([]);
  const [payslip, setPaySlip] = useState(false);

  const [text, setText] = useState(null);
  const [order, setOrder] = useState([]);
  const [name, setName] = useState("");
  const [location , setLocation] = useState([])
  const [Locate , setLocate] = useState ("")

  const orderData = useSelector((state) => state.orderData);
  const user = useSelector((state) => state.loginData);
  const token = useSelector((state) => state.IduniqueData);

  const dispatch = useDispatch();
  dispatch(add(true));

  const getPartner = async () => {
    let resData = await getApi("/partner", token.accessToken);

    const filteredPartners = resData.data.filter(
      (partner) => partner.isCustomer === true  &&  partner.active === true
    );
    setPartner(filteredPartners);
    setName(resData.data[0].id);
  };
  const getLocation = async () => {
    let resData = await getApi("/location", token.accessToken);
      
    const filteredLocations = resData.data.filter(
      (locate) => locate.active === true
    );
    setLocation(filteredLocations);
    setLocate(resData.data[0].id);
  };

  const createSaleOrder = async () => {
    if (text === "" || display === "") {
      toast("You have to click Pay button & amount");
      return;
    } else {
      const orderLines = [];

      orderData.forEach((item) => {
        const orderLine = {
          product: item.id,
          qty: item.quantity,
          tax: item.tax,
          unitPrice: item.salePrice,
          subTotal: item.quantity * item.salePrice,
        };

        orderLines.push(orderLine);
      });

      const data = {
        user: user._id,
        location: Locate,
        partner: name,
        taxTotal: totalCost,
        // payment: text,
        lines: orderLines,
        total: subTotal,
      };

      try {
        let resData = await sendJsonToApi("/sale", data, token.accessToken);
        if (!resData.success) {
          toast(resData.message);
        }

        if (resData.status) {
          setOrder(resData.data);
          toast(resData.message);
          setPaySlip(true);
        }
      } catch (error) {
        console.error("Error creating product:", error);
      }
    }
  };

  const handleButtonClick = (value) => {
    setDisplay((prevDisplay) => prevDisplay + value);
  };

  const clearDisplay = () => {
    setDisplay("");
  };

  useEffect(() => {
    getPartner();
    getLocation ()
  }, []);

  let pay = display - totalCost;

  return (
    <>
      {payslip ? (
        <PaySlip
          change={change}
          total={totalCost}
          cash={display}
          pay={pay}
          tax={tax}
          sub={subTotal}
          order={order}
        />
      ) : (
        <div>
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
          <div className="flex justify-between w-full cursor-pointer">
            <h3 className="font-semibold text-lg">Choose Payment</h3>
            <h3 className="font-semibold text-lg" onClick={() => change(false)}>
              Go Back
            </h3>
          </div>
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setText("CASH")}
              className={`px-8 py-2 rounded-md mx-1 text-blue-700 border-blue-500 border-2 hover:opacity-75 bg-outline-none shadow-md ${
                text === "CASH" && "bg-cyan-700 text-white"
              }`}
            >
              Cash
            </button>
            <button
              onClick={() => setText("BANK")}
              className={`px-8 py-2 rounded-md mx-1 text-blue-700 border-blue-500 border-2 hover:opacity-75 shadow-md bg-outline-none ${
                text === "BANK" && "bg-cyan-700 text-white"
              }`}
            >
              Bank
            </button>
          </div>
          <div className="mt-4">
            <span className="text-lg font-semibold text-slate-600">
              Total Due
            </span>
            <span className="text-lg font-bold ml-4">{totalCost}</span>
          </div>
          <div className="flex flex-col justify-between my-2 ">
            <div>
              <span className="text-lg font-semibold text-slate-600">Cash</span>
              <span className="text-lg font-bold ml-10">
                {display.length > 0 ? display : 0} MMK
              </span>
            </div>
            <div className="mt-4">
              <span className="text-lg font-semibold text-slate-600">
                Charge
              </span>
              <span className="text-lg font-bold ml-4">
                {display.length > 0 ? (display - totalCost).toFixed(2) : 0} MMK
              </span>
            </div>
          </div>

           <div className="flex justify-around">
            <div>
              <h3 className="text-lg font-semibold text-slate-600 my-2">Customer</h3>
              <select
                required
                id="nameId"
                onChange={(e) => setName(e.target.value)}
                // value={partner.length > 0 ? partner[0].name : name}
                className="pl-2 py-1 border-2 hover:opacity-75 border-blue-500 rounded-md shadow-md"
              >
                <option disabled value selected>
                  Select an option
                </option>
                {partner.length > 0 &&
                  partner.map((pt) => (
                    <option
                      key={pt.id}
                      value={pt.id}
                      className="hover:bg-cyan-300 hover:font-bold"
                    >
                      {pt.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="">
              <h3 className="text-lg font-semibold text-slate-600 my-2">Location</h3>
              <select
                required
                id="nameId"
                onChange={(e) => setLocate(e.target.value)}
                // value={partner.length > 0 ? partner[0].name : name}
                className="pl-2 py-1 border-2 hover:opacity-75 border-blue-500 rounded-md shadow-md"
              >
                <option disabled value selected>
                  Select an option
                </option>
                {location.length > 0 &&
                  location.map((loc) => (
                    <option
                      key={loc.id}
                      value={loc.id}
                      className="hover:bg-cyan-300 hover:font-bold"
                    >
                      {loc.name}
                    </option>
                  ))}
              </select>
            </div>
            </div>

          <div className="calculator mt-8 flex justify-center">
            <div className="buttons  ">
              <div className="row">
                <button
                  className="border-2 hover:opacity-75 bg-blue-500 w-14 h-14 text-white font-semibold"
                  onClick={() => handleButtonClick("1")}
                >
                  1
                </button>
                <button
                  className="border-2 hover:opacity-75 bg-blue-500 w-14 h-14 text-white font-semibold"
                  onClick={() => handleButtonClick("2")}
                >
                  2
                </button>
                <button
                  className="border-2 hover:opacity-75 bg-blue-500 w-14 h-14 text-white font-semibold"
                  onClick={() => handleButtonClick("3")}
                >
                  3
                </button>
              </div>
              <div className="row">
                <button
                  className="border-2 hover:opacity-75 bg-blue-500 w-14 h-14 text-white font-semibold"
                  onClick={() => handleButtonClick("4")}
                >
                  4
                </button>
                <button
                  className="border-2 hover:opacity-75 bg-blue-500 w-14 h-14 text-white font-semibold"
                  onClick={() => handleButtonClick("5")}
                >
                  5
                </button>
                <button
                  className="border-2 hover:opacity-75 bg-blue-500 w-14 h-14 text-white font-semibold"
                  onClick={() => handleButtonClick("6")}
                >
                  6
                </button>
              </div>
              <div className="row">
                <button
                  className="border-2 hover:opacity-75 bg-blue-500 w-14 h-14 text-white font-semibold"
                  onClick={() => handleButtonClick("7")}
                >
                  7
                </button>
                <button
                  className="border-2 hover:opacity-75 bg-blue-500 w-14 h-14 text-white font-semibold"
                  onClick={() => handleButtonClick("8")}
                >
                  8
                </button>
                <button
                  className="border-2 hover:opacity-75 bg-blue-500 w-14 h-14 text-white font-semibold"
                  onClick={() => handleButtonClick("9")}
                >
                  9
                </button>
              </div>
              <div className="row">
                <button className="border-2  bg-blue-500 w-14 h-14 text-blue-500 font-semibold">
                  .
                </button>
                <button
                  className="border-2 hover:opacity-75 bg-blue-500 w-14 h-14 text-white font-semibold"
                  onClick={() => handleButtonClick("0")}
                >
                  0
                </button>
                <button className="border-2  bg-blue-500 w-14 h-14  font-semibold text-blue-500">
                  .
                </button>
                <button
                  className="border-2 hover:opacity-75 bg-blue-500 w-14 h-14 text-white font-semibold"
                  onClick={clearDisplay}
                >
                  C
                </button>
              </div>
            </div>
          </div>
          <button
            className="mt-3 text-center text-white font-semibold rounded-md shadow-md py-3 bg-blue-600 w-full"
            onClick={createSaleOrder}
          >
            Validate
          </button>
        </div>
      )}
    </>
  );
}
