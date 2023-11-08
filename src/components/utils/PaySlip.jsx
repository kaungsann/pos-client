import React, { useRef } from "react";
import logo from "../../../public/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { removeAllItems } from "../../redux/actions";

export default function PaySlip({ change, total, cash, pay, tax, sub, order }) {
  let user = useSelector((state) => state.loginData);
  const product = useSelector((state) => state.orderData);
  const dispatch = useDispatch();
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <>
      <div className="flex justify-center">
        <div className="mx-3">
          <h3 className="text-lg font-bold">Total Paid</h3>
          <h4 className=" text-md ">{total}</h4>
        </div>
        <div className="mx-3">
          <h3 className="text-lg font-bold">Charge</h3>
          <h4 className="text-md">{pay.toFixed(2)}</h4>
        </div>
      </div>

      <div
        ref={componentRef}
        className="shadow-lg rounded-sm w-80 mx-auto text-center overflow-y-scroll custom-scrollbar h-3/5 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-100"
      >
        <img src={logo} width={"60px"} height={"30px"} className="mx-auto" />
        <h3 className="text-black text-xl font-bold">
          Amitbound Technology
        </h3>
        <h3 className="text-black text-lg font-bold mt-1">
          Tel+95-973426589
        </h3>
        <h3 className="text-black text-lg font-bold mt-1">
          TextID:US39699
        </h3>
        <h3 className="text-black text-lg font-bold mt-1">
          kaungsann@ambitboundtech.com
        </h3>
        <a className="text-black text-lg font-bold mt-1">
          https://www.amitboundtech.com
        </a>
        <hr class="border-t-4 border-black border-dotted text-xl mt-1 w-1/2 mx-auto" />
        <h3 className="text-black text-lg font-bold mt-1">
          Served by {user.username}
        </h3>
        <div className="flex px-3  flex-col">
          {product.length > 0 &&
            product.map((pd) => (
              <div
                key={pd._id}
                className="text-lg font-bold text-black flex justify-evenly"
              >
                <h4 className="w-2/5">{pd.name}</h4>
                <h4>x{pd.quantity}</h4>
                <h4>{pd.price * pd.quantity}</h4>
              </div>
            ))}
        </div>
        <hr class="justify-self-end  border-t-1 border-black border-solid mx-6 my-2" />
        <div className="flex flex-col">
          <div className="flex justify-between mx-6">
            <h4 className="text-lg font-bold text-black">Total</h4>
            <h4 className="text-md font-bold text-black">{sub}</h4>
          </div>
          <div className="flex justify-between mx-6">
            <h4 className="text-md font-bold text-black">Cash</h4>
            <h4 className="text-md font-bold text-black">{cash}</h4>
          </div>
          <div className="flex justify-between mx-6">
            <h4 className="text-md font-bold text-black">Tax</h4>
            <h4 className="text-md font-bold text-black">{tax}</h4>
          </div>
          <div className="flex justify-between mx-6">
            <h4 className="text-md font-bold text-black">Total Tax</h4>
            <h4 className="text-md font-bold text-black">
              {total} mmk
            </h4>
          </div>
        </div>
        <div className="flex flex-col my-6 justify-center">
          <h5 className="text-md font-bold text-black">
            Order : {order.length > 0 ? order[0].orderRef : "none"}
          </h5>
          <h5 className="text-md font-bold text-black">
            {new Date().toLocaleString()}
          </h5>
        </div>
      </div>

      <div className="w-80 mx-auto mt-2 mb-4">
        <button
          onClick={handlePrint}
          className="w-full mt-2 font-bold py-2 text-white bg-blue-600 rounded-md shadow-md"
        >
          Print
        </button>

        <button
          className="w-full mt-2  font-bold py-2 text-white bg-cyan-500 rounded-md shadow-md"
          onClick={() => {
            change(false);
            dispatch(removeAllItems());
          }}
        >
          New Order
        </button>
      </div>
    </>
  );
}
