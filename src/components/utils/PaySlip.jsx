import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { removeAllItems } from "../../redux/actions";
import { Button } from "@nextui-org/react";
import { getApi } from "../Api";
import PropTypes from "prop-types";

export default function PaySlip({
  change,
  total,
  cash,
  pay,
  tax,
  sub,
  order,
  // discount,
}) {
  let user = useSelector((state) => state.loginData);
  let [info, setInfo] = useState(null);
  const product = useSelector((state) => state.orderData);
  const token = useSelector((state) => state.IduniqueData);

  const dispatch = useDispatch();
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const getInfo = async () => {
    const response = await getApi("/company", token.accessToken);
    if (response.status) {
      setInfo(response.data[0]);
    }
  };

  useEffect(() => {
    getInfo();
  }, []);

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
        className="shadow-lg mt-3 rounded-sm w-80  h-3/5 mx-auto text-center overflow-y-scroll custom-scrollbar scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-100"
      >
        <h3 className="text-black mt-2 text-xl font-extrabold">
          {info?.name ? info.name : ""}
        </h3>
        <h3 className="text-black text-lg font-extrabold mt-1">
          Tel+ {info?.phone ? info.phone : ""}
        </h3>
        <h3 className="text-black text-lg font-extrabold mt-1">
          {info?.email ? info.email : ""}
        </h3>
        <hr className="border-t-4 border-black border-dotted text-xl mt-1 w-1/2 mx-auto" />
        <h3 className="text-black text-lg font-extrabold mt-1">
          Served by {user.username}
        </h3>
        <div className="flex px-3 flex-col">
          {product.length > 0 &&
            product.map((pd) => (
              <div
                key={pd._id}
                className="text-lg font-bold text-black flex justify-evenly"
              >
                <h4 className="w-2/5 extrabold">{pd.name}</h4>
                <h4 className="extrabold">x{pd.quantity}</h4>

                <div className="flex items-center">
                  <h4 className="extrabold">
                    {/* //{pd.salePrice * pd.quantity}{" "} */}
                    {pd.discount
                      ? (pd.salePrice -
                          (pd.salePrice * pd.discount.amount) / 100) *
                        pd.quantity.toLocaleString("en-US")
                      : pd.salePrice * pd.quantity.toLocaleString("en-US")}
                  </h4>
                  <h3 className="text-sm ml-2">
                    {pd.discount
                      ? " ( " + pd.discount.amount + "%" + " ) "
                      : ""}
                  </h3>
                </div>
              </div>
            ))}
        </div>
        <hr className="justify-self-end  border-t-1 border-black border-solid mx-6 my-2" />
        <div className="flex flex-col">
          <div className="flex justify-between mx-6">
            <h4 className="text-lg font-extrabold text-black">Total</h4>
            <h4 className="text-md font-extrabold text-black">{sub}</h4>
          </div>
          <div className="flex justify-between mx-6">
            <h4 className="text-md font-extrabold text-black">Cash</h4>
            <h4 className="text-md font-extrabold text-black">{cash}</h4>
          </div>
          <div className="flex justify-between mx-6">
            <h4 className="text-md font-extrabold text-black">Tax</h4>
            <h4 className="text-md font-extrabold text-black">{tax}</h4>
          </div>
          <div className="flex justify-between mx-6">
            <h4 className="text-md font-bold text-black">Charge</h4>
            <h4 className="text-md font-bold text-black">{pay.toFixed(2)}</h4>
          </div>
          {/* <div className="flex justify-between mx-6">
            <h4 className="text-md font-bold text-black">Discount</h4>
            <h4 className="text-md font-bold text-black">
              {discount.toFixed()}
            </h4>
          </div> */}
          <div className="flex justify-between mx-6">
            <h4 className="text-md font-extrabold text-black">Sub Total</h4>
            <h4 className="text-md font-extrabold text-black">{total} mmk</h4>
          </div>
        </div>
        <div className="flex flex-col my-3 justify-center">
          <h5 className="text-md font-extrabold text-black">
            Order : {order.length > 0 ? order[0].orderRef : "none"}
          </h5>
          <h5 className="text-md font-extrabold text-black">
            {new Date().toLocaleString()}
          </h5>
        </div>
      </div>

      <div className="w-80 mx-auto mt-2 mb-4">
        <Button
          className="w-full mb-2 mt-2"
          color="primary"
          variant="solid"
          onClick={handlePrint}
        >
          Print
        </Button>

        <Button
          className="w-full "
          color="primary"
          variant="solid"
          onClick={() => {
            change(false);
            dispatch(removeAllItems());
          }}
        >
          New Order
        </Button>
      </div>
    </>
  );
}

PaySlip.propTypes = {
  total: PropTypes.number,
  cash: PropTypes.number,
  pay: PropTypes.number,
  tax: PropTypes.number,
  sub: PropTypes.number,
  order: PropTypes.array,
  change: PropTypes.func,
};
