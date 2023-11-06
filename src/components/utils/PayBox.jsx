import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { BiMinus } from "react-icons/bi";
import { useSelector } from "react-redux";
import { BsFillTrash3Fill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { add } from "../../redux/actions";
import { ToastContainer, toast } from "react-toastify";
import img from "../../assets/user.jpeg";
import "react-toastify/dist/ReactToastify.css";
import {
  itemRemove,
  removeAllItems,
  updateItemQuantity,
} from "../../redux/actions";
import "../../App.css";

import ChoosePay from "./ChoosePay";

export default function PayBox({ onContinueToPay }) {
  const [payment, setPayment] = useState(false);
  const dispatch = useDispatch();

  const product = useSelector((state) => state.orderData);
  dispatch(add(false));

  const handleIncrement = (productId, product) => {
    dispatch(updateItemQuantity(productId, (product.quantity += 1)));
  };

  const handleDecrement = (productId, product) => {
    if (product.quantity > 0) {
      dispatch(updateItemQuantity(productId, (product.quantity -= 1)));
    }
    if (product.quantity < 1) {
      dispatch(itemRemove(productId));
    }
  };
  const reBack = (payment) => {
    setPayment(payment);
  };

  let subTotal = 0;
  let totalTax = 0;

  product.forEach((sel) => {
    totalTax += ((sel.tax * sel.quantity) / 100) * sel.listPrice;
    subTotal += sel.listPrice * sel.quantity;
  });

  const totalCost = subTotal + totalTax;

  return (
    <>
      {payment ? (
        <ChoosePay
          totalCost={totalCost}
          change={reBack}
          tax={totalTax}
          subTotal={subTotal}
        />
      ) : (
        <div className="cursor-pointer">
          {!setPayment && (
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
          )}

          <div className="flex p-2">
            <h3 className="font-semibold text-xl w-full">Current Order</h3>
            <h3
              className="text-lg w-40 text-end hover:text-red-700 font-semibold"
              onClick={() => dispatch(removeAllItems())}
            >
              Clear All
            </h3>
          </div>
          <div className="h-96 overflow-y-scroll my-3 custom-scrollbar">
            {product.length > 0 ? (
              product.map((sel) => (
                <div
                  key={sel.id}
                  className="mt-3 flex shadow-md p-2 bg-slate-50
                  "
                >
                  <img
                    src={sel.image ? sel.image : img}
                    className="w-16 h-17 rounded-sm"
                    alt={sel.name}
                  />
                  <div className="flex flex-col justify-between ml-4 w-full">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-md text-slate-700">
                        {sel.name}
                      </h4>
                      <div onClick={() => dispatch(itemRemove(sel.id))}>
                        <BsFillTrash3Fill className="text-red-700 hover:opacity-70" />
                      </div>
                    </div>
                    <span className=" font-semibold text-md text-slate-600">
                      tax -{" "}
                      {(sel.tax && sel.tax * sel.quantity).toLocaleString(
                        "en-US"
                      )}
                    </span>

                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <FiPlus
                          className="text-md rounded-sm shadow-md bg-blue-600 mr-3 text-white"
                          onClick={() => handleIncrement(sel.id, sel)}
                        />
                        <span className="text-slate-700 text-lg">
                          {sel.quantity}
                        </span>
                        <BiMinus
                          className="text-md rounded-sm shadow-md bg-blue-600 ml-3 text-white"
                          onClick={() => handleDecrement(sel.id, sel)}
                        />
                      </div>
                      <span className="font-bold text-md text-blue-600">
                        {(sel.listPrice * sel.quantity).toLocaleString("en-US")}{" "}
                        mmk
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <h1 className="text-slate-600 text-md font-semibold my-4 ml-3">
                No Selected Products
              </h1>
            )}
          </div>
          <div>
            <div className="items-center flex justify-between">
              <h3 className="text-slate-600 font-bold">Sub Total</h3>
              <h3 className="text-md font-bold">
                {subTotal.toLocaleString("en-US")}
              </h3>
            </div>
            <div className="items-center flex justify-between">
              <h3 className="text-slate-600 font-bold">Total Tax</h3>
              <h3 className="text-md font-bold">
                {totalTax.toLocaleString("en-US")}
              </h3>
            </div>
            <hr className="border-t border-dotted border-black my-5" />
            <div className="items-center flex justify-between">
              <h3 className="text-slate-800 font-bold text-lg">Total</h3>
              <h3 className="text-lg font-bold">
                {totalCost.toLocaleString("en-US")}MMK
              </h3>
            </div>
            <button
              className="mt-3 text-center text-white font-semibold rounded-md shadow-md py-3 bg-blue-600 w-full"
              onClick={() => {
                if (product.length > 0) {
                  setPayment(!payment);
                } else {
                  setPayment(false);
                  toast("You need to select a product");
                }
              }}
            >
              Continue To Pay
            </button>
          </div>
        </div>
      )}
    </>
  );
}
