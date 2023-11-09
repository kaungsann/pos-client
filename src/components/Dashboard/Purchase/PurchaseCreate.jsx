import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { getApi, jsonStringPostData } from "../../Api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { BsTrash } from "react-icons/bs";

export default function SaleOrderCreate() {
  const [product, setProduct] = useState([]);
  const [location, setLocation] = useState([]);
  const [part, setPart] = useState([]);
  const [partner, setPartner] = useState("");
  const [loca, setLoca] = useState("");
  const [state, setState] = useState("");
  const [note, setNote] = useState("");

  const [payment, setPayment] = useState(null);
  const [item, setItem] = useState(null);

  const [pd, setPd] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [Tax, setTax] = useState(0);
  const [unitPrice, setUnitPrice] = useState(0);
  const [subTotal, setTotalPrice] = useState(0);
  const [saleOrderLines, setSaleOrderLines] = useState([]);
  const [date, setDate] = useState("");
  const [totalTax, setTotalTax] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  const navigate = useNavigate();

  // State variables for showing red borders and error messages
  const [showErrorPartner, setShowErrorPartner] = useState(false);
  const [showErrorLocation, setShowErrorLocation] = useState(false);
  const [showErrorState, setShowErrorState] = useState(false);
  const [showErrorNote, setShowErrorNote] = useState(false);
  const [showErrorProduct, setShowErrorProduct] = useState(false);
  const [showErrorQuantity, setShowErrorQuantity] = useState(false);
  const [showErrorPayment, setShowErrorPayment] = useState(false);
  const [showErrorDate, setShowErrorDate] = useState("");

  const userData = useSelector((state) => state.loginData);
  const token = useSelector((state) => state.IduniqueData);
  const dipatch = useDispatch();

  const createProductApi = async () => {
    if (date === "") {
      setShowErrorDate(true);
    } else {
      setShowErrorDate(false);
    }
    if (payment === "") {
      setShowErrorPayment(true);
    } else {
      setShowErrorPayment(false);
    }
    if (partner.trim() === "") {
      setShowErrorPartner(true);
    } else {
      setShowErrorPartner(false);
    }
    if (loca.trim() === "") {
      setShowErrorLocation(true);
    } else {
      setShowErrorLocation(false);
    }
    if (state.trim() === "") {
      setShowErrorState(true);
    } else {
      setShowErrorState(false);
    }
    if (note.trim() === "") {
      setShowErrorNote(true);
    } else {
      setShowErrorNote(false);
    }

    const data = {
      orderDate: date,
      user: userData._id,
      partner: partner,
      location: loca,
      lines: saleOrderLines.map((line) => ({
        product: line.product.id,
        qty: line.qty,
        tax: line.tax,
        unitPrice: line.unitPrice,
        subTotal: line.subTotal,
      })),
      state: state,
      note: note,
      // payment: payment,
      taxTotal: totalTax,
      total: totalCost,
    };

    try {
      let resData = await jsonStringPostData(
        "/purchase",
        data,
        token.accessToken
      );
      if (resData.message == "Token Expire , Please Login Again") {
        dipatch(removeData(null));
      }

      if (resData.status) {
        toast(resData.message);
        navigate("/admin/purchase/all");
      }
    } catch (error) {
      toast(resData.message);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    createProductApi();
  };
  const getLocation = async () => {
    const resData = await getApi("/location", token.accessToken);
    setLocation(resData.data);
  };
  const getProduct = async () => {
    const resData = await getApi("/product", token.accessToken);
    setProduct(resData.data);
  };
  const getPartner = async () => {
    const resData = await getApi("/partner", token.accessToken);
    const filteredPartners = resData.data.filter(
      (partner) => partner.isCustomer === false
    );
    setPart(filteredPartners);
  };

  const handleAddProduct = () => {
    if (pd === null) {
      setShowErrorProduct(true);
    } else {
      setShowErrorProduct(false);
    }
    if (quantity === 0) {
      setShowErrorQuantity(true);
    } else {
      setShowErrorQuantity(false);
    }

    if (pd === null || quantity === 0) {
      return;
    }
    const subTotal = unitPrice * quantity;
    const selectedProduct = product.find((pt) => pt.id === pd);
    if (selectedProduct) {
      const calculatedTax = selectedProduct.tax * quantity;
      setTax(calculatedTax);
    }

    const newSaleOrderLine = {
      product: item,
      qty: quantity,
      tax: Tax * quantity,
      unitPrice: unitPrice,
      subTotal: subTotal,
    };

    setSaleOrderLines([...saleOrderLines, newSaleOrderLine]);

    setPd(null);
    setQuantity(0);
    setUnitPrice(0);
  };

  const removeProduct = (id) => {
    // Filter out the product with the specified id
    const updatedSaleOrderLines = saleOrderLines.filter(
      (line) => line.id !== id
    );
    setSaleOrderLines(updatedSaleOrderLines);
  };

  useEffect(() => {
    let calculatedTotalTax = 0;
    let calculatedSubTotal = 0;

    saleOrderLines.forEach((sel) => {
      calculatedTotalTax += ((sel.tax * sel.qty) / 100) * sel.unitPrice;
      calculatedSubTotal += sel.unitPrice * sel.qty;
    });

    setTotalTax(calculatedTotalTax);
    setTotalCost(calculatedSubTotal + calculatedTotalTax);
    getLocation();
    getPartner();
    getProduct();
  }, [saleOrderLines]);

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

      <div className="flex">
        <button
          type="submit"
          className="font-bold rounded-sm shadow-sm flex items-cente text-blue-700 border-blue-500 border-2 hover:opacity-75 text-md hover:text-white hover:bg-blue-700 px-6 py-2"
          onClick={handleSubmit}
        >
          Save
        </button>
        <Link to="/admin/purchase/all">
          <button className="rounded-sm ml-3 transition shadow-sm flex items-center text-[#4338ca] border-[#4338ca] border-2 hover:opacity-75 text-md hover:text-white hover:bg-[#4338ca] font-bold px-6 py-2">
            Discard
          </button>
        </Link>
      </div>

      <div className="mt-2">
        <div className="w-full mx-auto flex justify-center cursor-pointer flex-col">
          <h2 className="py-1.5 text-lg font-bold mt-2 bg-blue-600 text-white pl-4">
            Create Purchase Order
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-wrap">
          <div className="flex mt-8">
            <label
              className={`text-md font-semibold ${
                showErrorPayment ? "text-red-600" : "border-slate-400"
              }`}
            >
              Payment :
            </label>
            <select
              id="payment"
              className={`border-b ml-3 outline-none w-36 ${
                showErrorPayment ? "border-red-600" : "border-slate-400"
              }`}
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
            >
              <option value="BANK" className="py-2">
                BANK
              </option>
              <option value="CASH" className="py-2">
                CASH
              </option>
            </select>
          </div>

          <div className="flex mt-8">
            <label
              className={`text-md font-semibold ${
                showErrorDate ? "text-red-600" : "border-slate-400"
              }`}
            >
              Order Date :
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`border-b ml-3 outline-none w-36 ${
                showErrorDate ? "border-red-600" : "border-slate-400"
              }`}
              placeholder="Enter note"
            />
          </div>

          <div className="flex mt-8">
            <label
              className={`text-md font-semibold ${
                showErrorPartner ? "text-red-600" : ""
              }`}
            >
              partner :
            </label>
            <select
              required
              id="ptid"
              onChange={(e) => setPartner(e.target.value)}
              className={`border-b ml-3 outline-none w-36 ${
                showErrorPartner ? "border-red-600" : "border-slate-400"
              }`}
            >
              <option disabled value>
                Select an option
              </option>
              {part.length > 0 &&
                part.map((pt) => (
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

          <div className="flex mt-8">
            <label
              className={`text-md font-semibold ${
                showErrorLocation ? "text-red-600" : ""
              }`}
            >
              Location :
            </label>
            <select
              required
              id="locid"
              onChange={(e) => setLoca(e.target.value)}
              className={`border-b ml-3 outline-none w-36 ${
                showErrorLocation ? "border-red-600" : "border-slate-400"
              }`}
            >
              <option disabled value>
                Select an option
              </option>
              {location.length > 0 &&
                location.map((ct) => (
                  <option
                    key={ct.id}
                    value={ct.id}
                    className="hover:bg-cyan-300 hover:font-bold"
                  >
                    {ct.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex mt-8">
            <label
              className={`text-md font-semibold ${
                showErrorState ? "text-red-600" : ""
              }`}
            >
              State:
            </label>

            <select
              id="payment"
              className={`border-b ml-3 outline-none w-36 ${
                showErrorState ? "border-red-600" : "border-slate-400"
              }`}
              value={state}
              onChange={(e) => setState(e.target.value)}
            >
              <option value="pending" className="py-2">
                Pending
              </option>
              <option value="deliver" className="py-2">
                Deliver
              </option>
              <option value="arrived" className="py-2">
                Arrived
              </option>
            </select>
          </div>

          <div className="flex mt-8">
            <label
              className={`text-md font-semibold ${
                showErrorNote ? "text-red-600" : ""
              }`}
            >
              Note :
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className={`border-b ml-3 outline-none w-36 ${
                showErrorNote ? "border-red-600" : "border-slate-400"
              }`}
              placeholder="Enter note"
            />
          </div>

          <div className="flex mt-8">
            <label className="text-md font-semibold">TaxTotal :</label>
            <input
              value={totalTax}
              type="number"
              className="border-b ml-3 border-slate-400 outline-none w-36"
            />
          </div>
          <div className="flex mt-8">
            <label className="text-md font-semibold">Total :</label>
            <input
              value={totalCost}
              type="number"
              className="border-b  ml-3 border-slate-400 outline-none w-36"
            />
          </div>
        </form>
      </div>

      <div className="mt-6">
        <div className="flex justify-between">
          <h2 className="lg:text-2xl font-semibold">New Purchase Order Line</h2>
          <button
            onClick={handleAddProduct}
            className="px-8 py-2 text-white font-bold rounded-md shadow-md ml-6 border-2 border-blue-500 bg-blue-600 hover:opacity-75"
          >
            Add
          </button>
        </div>

        <form onSubmit={handleAddProduct} className="flex mt-8">
          <div>
            <label
              className={`text-md font-semibold ${
                showErrorProduct ? "text-red-600" : ""
              }`}
            >
              Product:
            </label>
            <select
              required
              id="pdId"
              value={pd}
              onChange={(e) => {
                setPd(e.target.value);
                const selectedProduct = product.find(
                  (pt) => pt.id === e.target.value
                );
                if (selectedProduct) {
                  setUnitPrice(selectedProduct.salePrice);
                  setTotalPrice(selectedProduct.salePrice);
                  setTax(selectedProduct.tax);
                  setItem(selectedProduct);
                }
              }}
              className={`border-b ml-3 outline-none w-36 ${
                showErrorProduct ? "border-red-600" : "border-slate-400"
              }`}
            >
              <option disabled value>
                Select an option
              </option>
              {product.length > 0 &&
                product.map((pt) => (
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
          <div>
            <label
              className={`text-md font-semibold ${
                showErrorQuantity ? "text-red-600" : ""
              }`}
            >
              Quantity:
            </label>
            <input
              type="number"
              value={quantity}
              className={`border-b ml-3 outline-none w-36 ${
                showErrorQuantity ? "border-red-600" : "border-slate-400"
              }`}
              onChange={(e) => {
                setQuantity(e.target.value);
              }}
            />
          </div>
          <div>
            <label className="text-md font-semibold">Tax:</label>
            <input
              type="number"
              value={Tax * quantity}
              className="border-b border-slate-400 outline-none w-36"
            />
          </div>
          <div>
            <label className="text-md font-semibold">Unit Price:</label>
            <input
              type="number"
              value={unitPrice}
              className="border-b border-slate-400 outline-none w-36"
            />
          </div>
          <div>
            <label className="text-md font-semibold">subTotal Price:</label>
            <input
              type="number"
              value={subTotal * quantity}
              className="border-b border-slate-400 outline-none w-36"
            />
          </div>
        </form>
      </div>

      <table className="w-full mt-8">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="lg:px-4 py-2 text-center">Photo</th>
            <th className="lg:px-4 py-2 text-center">Product</th>
            <th className="lg:px-4 py-2 text-center">Tax</th>
            <th className="lg:px-4 py-2 text-center">Unit Price</th>
            <th className="lg:px-4 py-2 text-center">SubTotal</th>
            <th className="lg:px-4 py-2 text-center">Remove</th>
          </tr>
        </thead>

        <tbody className="w-full space-y-10 bg-slate-300">
          {saleOrderLines.map((line) => (
            <tr
              key={line.id}
              className="odd:bg-white even:bg-slate-200 space-y-10  mb-8 w-full items-center cursor-pointer"
            >
              <td className="lg:px-4 py-2 text-center">
                {line.product && line.product.image ? (
                  <img
                    src={line.product.image}
                    alt={line.product.name}
                    className="w-10 h-10 rounded-md shadow-md mx-auto"
                  />
                ) : (
                  <div>No Image</div>
                )}
              </td>
              <td className="lg:px-4 py-2 text-center">{line.product.name}</td>
              <td className="lg:px-4 py-2 text-center">{line.tax}</td>
              <td className="lg:px-4 py-2 text-center">{line.unitPrice}</td>
              <td className="lg:px-4 py-2 text-center">{line.subTotal}</td>
              <td className="lg:px-4 py-2">
                <div className="text-center flex justify-center">
                  <BsTrash
                    className="text-center text-[#ef4444] text-lg font-bold hover:text-[#991b1b]"
                    onClick={() => removeProduct(line.id)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
