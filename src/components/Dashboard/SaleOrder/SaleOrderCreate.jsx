import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { getApi, sendJsonToApi } from "../../Api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { BsTrash } from "react-icons/bs";
import { Input, Select, SelectItem } from "@nextui-org/react";
import { removeData } from "../../../redux/actions";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from "@nextui-org/react";


export default function SaleOrderCreate() {
  const [product, setProduct] = useState([]);
  const [location, setLocation] = useState([]);
  const [part, setPart] = useState([]);
  const [partner, setPartner] = useState("");
  const [loca, setLoca] = useState("");
  const [state, setState] = useState("pending");
  const [note, setNote] = useState("");

  const [payment, setPayment] = useState(null);
  const [item, setItem] = useState(null);
  
  const handleDropdownItemClick = (key) => {
    setShowErrorPayment(false); // Reset error state on change
    setSelectedOption(key);
  };

  const [pd, setPd] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [Tax, setTax] = useState(0);
  const [unitPrice, setUnitPrice] = useState(0);
  const [saleOrderLines, setSaleOrderLines] = useState([]);
  const [date, setDate] = useState("");
  const [totalTax, setTotalTax] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [selectedOption, setSelectedOption] = React.useState("default");
  const [showErrorPayment, setShowErrorPayment] = React.useState(false);

  const navigate = useNavigate();

  // State variables for showing red borders and error messages
  const [showErrorPartner, setShowErrorPartner] = useState(false);
  const [showErrorLocation, setShowErrorLocation] = useState(false);
  const [showErrorState, setShowErrorState] = useState(false);
  const [showErrorNote, setShowErrorNote] = useState(false);
  const [showErrorProduct, setShowErrorProduct] = useState(false);
  const [showErrorQuantity, setShowErrorQuantity] = useState(false);
  const [showErrorDate, setShowErrorDate] = useState("");

  const userData = useSelector((state) => state.loginData);
  const token = useSelector((state) => state.IduniqueData);
  const dipatch = useDispatch();

  const columns = [
    {
      key: "image", label: "Image", align: "center", render: (line) => (
        <TableCell align="center" className="table-cell">
          {line.product && line.product.image ? (
            <img
              src={line.product.image}
              alt={line.product.name}
              className="w-10 h-10 rounded-md shadow-md mx-auto"
            />
          ) : (
            <div>No Image</div>
          )}
        </TableCell>
      )
    },
    {
      key: "name", label: "Name", align: "center", render: (line) => (
        <TableCell align="center" className="table-cell">
          {line.product.name}
        </TableCell>
      )
    },
    {
      key: "tax", label: "Tax", align: "center", render: (line) => (
        <TableCell align="center" className="table-cell">
          {line.tax.toFixed(2)}
        </TableCell>
      )
    },
    {
      key: "qty", label: "Stock Qty", align: "center", render: (line) => (
        <TableCell align="center" className="table-cell">
          {line.qty}
        </TableCell>
      )
    },
    {
      key: "unitPrice", label: "Unit Price", align: "center", render: (line) => (
        <TableCell align="center" className="table-cell">
          {line.unitPrice}
        </TableCell>
      )
    },
    {
      key: "subTotal", label: "Subtotal", align: "center", render: (line) => (
        <TableCell align="center" className="table-cell">
          {line.subTotal}
        </TableCell>
      )
    },
    {
      key: "delete", label: "Delete", align: "center", render: (line, removeProduct) => (
        <TableCell align="center" className="table-cell">
          <div className="text-center flex justify-center">
            <BsTrash
              className="text-center text-[#ef4444] text-lg font-bold hover:text-[#991b1b]"
              onClick={() => removeProduct(line.product.id)}
            />
          </div>
        </TableCell>
      )
    },
  ];



  const createProductApi = async () => {
    if (saleOrderLines.length == 0) {
      toast("you need to selecte the product")
      return
    }
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
      let resData = await sendJsonToApi("/sale", data, token.accessToken);
      if (resData.message == "Token Expire , Please Login Again") {
        dipatch(removeData(null));
      }
      if (resData.status) {
        toast(resData.message);
        navigate("/admin/saleorders/all");
      } else {
        toast(resData.message);
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
    const filteredLocation = resData.data.filter((la) => la.active === true);
    setLocation(filteredLocation);
  };
  const getProduct = async () => {
    const resData = await getApi("/product", token.accessToken);
    const filteredProduct = resData.data.filter((pt) => pt.active === true);
    setProduct(filteredProduct);
  };
  const getPartner = async () => {
    const resData = await getApi("/partner", token.accessToken);
    const filteredPartners = resData.data.filter(
      (partner) => partner.isCustomer === true && partner.active === true
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
      tax: (selectedProduct.tax / 100) * quantity * unitPrice,
      unitPrice: unitPrice,
      subTotal: subTotal,
    };

    setSaleOrderLines([...saleOrderLines, newSaleOrderLine]);

    setQuantity(0);
    setUnitPrice(0);
  };

  const removeProduct = (id) => {
    console.log("slae line is", id);

    // Filter out the product with the specified id
    const updatedSaleOrderLines = saleOrderLines.filter(
      (line) => line.product.id !== id
    );
    setSaleOrderLines(updatedSaleOrderLines);
  };

  useEffect(() => {
    let calculatedTotalTax = 0;
    let calculatedSubTotal = 0;

    saleOrderLines.forEach((sel) => {
      calculatedTotalTax += sel.tax;
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
      <div className="flex gap-3 my-5">
        <button
          type="submit"
          className="font-bold rounded-sm shadow-sm flex items-center text-blue-700 border-blue-500 border-2 hover:opacity-75 text-sm hover:text-white hover:bg-blue-700 px-3 py-1.5"
          onClick={handleSubmit}
        >
          Save
        </button>
        <Link to="/admin/saleOrders/all">
          <button className="rounded-sm shadow-sm flex items-center  text-red-500 border-red-500 bg-white border-2 hover:opacity-75 text-sm hover:text-white hover:bg-red-500 font-bold px-3 py-1.5">
            Discard
          </button>
        </Link>
      </div>

      <div className="container mt-2">
        <h2 className="lg:text-xl font-bold my-2">Create Sale Order</h2>
        <div className="container bg-white p-5 rounded-lg max-w-6xl">
          <div className="flex justify-between flex-wrap gap-10 p-5">
            <div className="flex flex-wrap gap-8">
              <div className="mt-1">
                <div className="w-60">
                  <Select
                    labelPlacement="outside"
                    label="PaymentType"
                    name="payment"
                    value={selectedOption}
                    placeholder="Select Payment Type"
                    onChange={(e) => {
                      setShowErrorPayment(false); // Reset error state on change
                      setSelectedOption(e.target.value);
                    }}
                    className="max-w-xs"
                  >
                    {/* Replace dynamic data with fixed options */}
                    <SelectItem value="bank">Bank</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                  </Select>
                </div>
              </div>
              <div className="w-60">
                <Input
                  type="date"
                  name="expiredAt"
                  label="Order Date"
                  placeholder="enter date"
                  labelPlacement="outside"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="w-60">
                <Select
                  labelPlacement="outside"
                  label="Partner"
                  name="partner"
                  placeholder="Select partner"
                  onChange={(e) => setPartner(e.target.value)}
                  className="max-w-xs"
                >
                  {part.map((ct) => (
                    <SelectItem key={ct.id} value={ct.id}>
                      {ct.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <div className="w-60">
                <Select
                  labelPlacement="outside"
                  label="Location"
                  name="location"
                  placeholder="Select an category"
                  onChange={(e) => setLoca(e.target.value)}
                  className="max-w-xs"
                >
                  {location.map((ct) => (
                    <SelectItem key={ct.id} value={ct.id}>
                      {ct.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <div className="w-60">
                <Select
                  labelPlacement="outside"
                  label="State"
                  name="state"
                  value={state}
                  placeholder="State"
                  onChange={(e) => setState(e.target.value)}
                  className="max-w-xs"
                >
                  {/* Replace dynamic data with fixed options */}
                  <SelectItem value="pending">Pending</SelectItem>
                </Select>
              </div>
              <div className="w-60">
                <Input
                  type="text"
                  label="Note"
                  name="note"
                  value={note}
                  // color={isInvalid ? "danger" : "success"}
                  // errorMessage={isInvalid && "Please enter a valid email"}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Enter Note name..."
                  labelPlacement="outside"
                />
              </div>
            </div>
            <span>Order Products</span>
            <button
              onClick={handleAddProduct}
              className="px-8 py-2 text-white font-bold rounded-md shadow-md ml-6 border-2 border-blue-500 bg-blue-600 hover:opacity-75"
            >
              Add
            </button>
            <form onSubmit={handleAddProduct} className="flex mt-8 justify-between">
            <div className="flex flex-wrap gap-8">
              <div className="w-60">
                <Select
                  labelPlacement="outside"
                  label="Product"
                  name="product"
                  value={pd}
                  placeholder="Select Product"
                  
                  onChange={(e) => {
                    setPd(e.target.value);
                    const selectedProduct = product.find(
                      (pt) => pt.id === e.target.value
                    );
                    if (selectedProduct) {
                      setUnitPrice(selectedProduct.salePrice);
                      setQuantity(1);
                      setTax(selectedProduct.tax);
                      setItem(selectedProduct);
                    }
                  }}
                  className="max-w-xs"
                >
                  {product.map((pt) => (
                    <SelectItem key={pt.id} value={pt.id}>
                      {pt.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <div className="w-60">
                <Input
                  type="number"
                  label="Qty"
                  name="qty"
                  value={quantity}
                  onChange={(e) => {
                    setQuantity(e.target.value);
                  }}
                  placeholder="Enter Qty..."
                  labelPlacement="outside"
                />
              </div>
              <div className="w-60">
                <Input
                  type="number"
                  label="Tax"
                  name="tax"
                  value={(Tax * quantity) / 100}
                  onChange={(e) => setTax(e.target.value)}

                  placeholder="Tax"
                  labelPlacement="outside"
                />
              </div>
              <div className="w-60">
                <Input
                  type="number"
                  label="SubTotal"
                  name="subTotal"
                  value={unitPrice * quantity}
                    onChange={(e) => setTotalCost(e.target.value)}

                  placeholder="SubTotal"
                  labelPlacement="outside"
                />
              </div>
            </div>
            </form>
            <div className="w-full mb-6">
              <Table isStriped aria-label="Order Lines Table" className="my-custom-table">
                <TableHeader columns={columns}>
                  {(column) => (
                    <TableColumn key={column.key} align={column.align} className="header-cell bg-blue-500 text-white">
                      {column.label}
                    </TableColumn>
                  )}
                </TableHeader>
                <TableBody items={saleOrderLines || []}>
                  {(line) => (
                    <TableRow key={line._d} className="table-row">
                      {columns.map((column) => (
                        <React.Fragment key={column.key}>
                          {column.render ? column.render(line, removeProduct) : null}
                        </React.Fragment>
                      ))}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex flex-col">
              <div className="flex mt-8 justify-self-end">
                <h1 className="text-lg font-semibold">
                  TaxTotal : <span>{totalTax.toFixed(2) ?? 0}</span>
                </h1>
              </div>
              <div className="flex mt-4 justify-self-end">
                <h1 className="text-lg font-semibold">
                  Total : <span>{totalCost.toFixed(2) ?? 0}</span>
                </h1>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
