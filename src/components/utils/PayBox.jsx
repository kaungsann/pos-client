import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { BiMinus } from "react-icons/bi";
import { useSelector } from "react-redux";
import { BsFillTrash3Fill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import img from "../../assets/product.svg";
import "react-toastify/dist/ReactToastify.css";
import {
  Dropdown,
  DropdownItem,
  DropdownTrigger,
  DropdownMenu,
  Button,
  Chip,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";

import {
  add,
  itemRemove,
  removeAllItems,
  updateItemQuantity,
  applyDiscount,
  removeDiscountItem,
} from "../../redux/actions";
import "../../App.css";

import ChoosePay from "./ChoosePay";
import { BASE_URL } from "../Api";
import axios from "axios";

export default function PayBox() {
  const [payment, setPayment] = useState(false);

  const [discount, setDiscount] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState(new Set(["text"]));

  const dispatch = useDispatch();

  const DISCOUNT_API = {
    INDEX: BASE_URL + "/discount",
  };

  const token = useSelector((state) => state.IduniqueData);

  const fetchDiscountData = async () => {
    try {
      const response = await axios.get(DISCOUNT_API.INDEX, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          "Content-Type": "application/json",
        },
      });

      const validDiscountFilter = response.data.data.filter(
        (dis) => dis.active === true
      );

      setDiscount(validDiscountFilter);
    } catch (error) {
      console.error("Error fetching discount:", error);
    }
  };

  useEffect(() => {
    fetchDiscountData();
  }, [token]);

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
    totalTax += ((sel.tax * sel.quantity) / 100) * sel.salePrice;
    //subTotal += sel.salePrice * sel.quantity;
    subTotal += sel.discount
      ? (sel.salePrice - (sel.salePrice * sel.discount.amount) / 100) *
        sel.quantity.toLocaleString("en-US")
      : sel.salePrice * sel.quantity.toLocaleString("en-US");
  });

  const totalCost = subTotal + totalTax;

  const handleDiscountAdd = (name, amount, Id, item) => {
    const selectedDiscount = {
      name: name,
      id: Id,
      amount: parseInt(amount, 10),
    };
    const existingProduct = product.find((pd) => pd.id === item.id);

    if (existingProduct) {
      dispatch(applyDiscount(item.id, Id, selectedDiscount));
    }
  };

  const handleRemoveDiscountItem = (productId) => {
    dispatch(removeDiscountItem(productId));
  };

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
        <div className="relative">
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
              Clear
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
                  <div className="flex flex-col justify-between ml-4 w-full cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <h4 className="font-bold text-md text-slate-700">
                          {sel.name.substring(0, 5)}
                        </h4>

                        <Dropdown>
                          <DropdownTrigger>
                            <Icon
                              icon="ic:twotone-discount"
                              className="ml-1.5"
                            />
                          </DropdownTrigger>
                          <DropdownMenu
                            aria-label="Multiple selection example"
                            variant="flat"
                            selectionMode="single"
                            selectedKeys={selectedKeys}
                            onSelectionChange={setSelectedKeys}
                          >
                            {discount.map((dis) => (
                              <DropdownItem
                                key={dis.name}
                                value={dis.amount}
                                onClick={() =>
                                  handleDiscountAdd(
                                    dis.name,
                                    dis.amount,
                                    dis.id,
                                    sel
                                  )
                                }
                              >
                                {dis.name +
                                  " " +
                                  " ( " +
                                  dis.amount +
                                  "%" +
                                  " ) "}
                              </DropdownItem>
                            ))}
                          </DropdownMenu>
                        </Dropdown>

                        {sel.discount?.amount ? (
                          <div className="flex relative">
                            <Chip
                              color="success"
                              variant="bordered"
                              className="ml-1.5"
                            >
                              {sel.discount?.name}
                              {`${" ( " + sel.discount?.amount + " ) "}% `}
                            </Chip>
                            <span
                              className="text-[8px] hover:opacity-75 text-slate-300 bg-slate-600 font-bold bottom-4 h-4 w-4 p-1.5 border-2 rounded-full flex items-center justify-center cursor-pointer"
                              onClick={() => handleRemoveDiscountItem(sel.id)}
                            >
                              X
                            </span>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>

                      <div onClick={() => dispatch(itemRemove(sel.id))}>
                        <BsFillTrash3Fill className="text-red-700 hover:opacity-70" />
                      </div>
                    </div>
                    <span className=" font-semibold text-md text-slate-600">
                      tax -{" "}
                      {sel.tax && sel.quantity
                        ? (sel.tax * sel.quantity).toLocaleString("en-US")
                        : 0}
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

                        {/* <input
                          className="w-8"
                          type="text" 
                          inputMode="numeric" 
                          pattern="[0-9]*" 
                          value={sel.quantity + dynamicInputValue}
                          // value={dynamicInputValue}
                          onChange={(e) => {
                            dispatch(
                              updateItemQuantity(
                                sel.id,
                                sel.quantity + e.target.value
                              )
                            );
                          }}
                        /> */}
                        <BiMinus
                          className="text-md rounded-sm shadow-md bg-blue-600 ml-3 text-white"
                          onClick={() => handleDecrement(sel.id, sel)}
                        />
                      </div>
                      <span className="font-bold text-md text-blue-600">
                        {sel.discount
                          ? (sel.salePrice -
                              (sel.salePrice * sel.discount.amount) / 100) *
                            sel.quantity.toLocaleString("en-US")
                          : sel.salePrice *
                            sel.quantity.toLocaleString("en-US")}
                        {/* {( sel.salePrice * sel.quantity).toLocaleString("en-US")} */}
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

            <Button
              className="w-full mt-5"
              color="primary"
              variant="solid"
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
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
