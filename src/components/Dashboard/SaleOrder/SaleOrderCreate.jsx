import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { getApi, sendJsonToApi } from "../../Api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { BsTrash } from "react-icons/bs";
import {
  Input,
  Select,
  SelectItem,
  TableCell,
  TableRow,
} from "@nextui-org/react";
import {
  addProduct,
  removeAllSaleDiscount,
  removeData,
  removeProduct,
} from "../../../redux/actions";
import { Icon } from "@iconify/react";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  Divider,
  Button,
  Progress,
} from "@nextui-org/react";

export default function SaleOrderCreate() {
  let count = 0;
  const [product, setProduct] = useState([]);
  const [location, setLocation] = useState([]);
  const [part, setPart] = useState([]);
  const [partner, setPartner] = useState("");
  const [loca, setLoca] = useState("");
  const [discountId, setDiscountId] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountValue, setDiscountValue] = useState(null);
  const [note, setNote] = useState("");

  const [refreshIconRotation, setRefreshIconRotation] = useState(false);
  const [partIconRotation, setPartIconRotation] = useState(false);

  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [pd, setPd] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [Tax, setTax] = useState(0);
  const [unitPrice, setUnitPrice] = useState(0);
  const [saleOrderLines, setSaleOrderLines] = useState([]);
  const [date, setDate] = useState("");
  const [totalTax, setTotalTax] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [discount, setDiscount] = useState([]);

  const dispatch = useDispatch();

  const handlePartnerButtonClick = () => {
    const url = "/admin/partners/create";
    window.open(url, "_blank");
  };

  const handleLocationButtonClick = () => {
    const url = "/admin/locations/create";
    window.open(url, "_blank");
  };

  const handleLocalRefreshIcon = () => {
    getLocation();
    setRefreshIconRotation(true);

    setTimeout(() => {
      setRefreshIconRotation(false);
    }, 500);
  };

  const handlePartRefreshIcon = () => {
    getPartner();
    setPartIconRotation(true);

    setTimeout(() => {
      setPartIconRotation(false);
    }, 500);
  };

  const handleDiscontRefresh = () => {
    getDiscount();
    setPartIconRotation(true);

    setTimeout(() => {
      setPartIconRotation(false);
    }, 500);
  };

  const handleDiscountButtonClick = () => {
    const url = "/admin/discount/create";
    window.open(url, "_blank");
  };

  const [selectedOption, setSelectedOption] = React.useState("default");

  const navigate = useNavigate();

  const userData = useSelector((state) => state.loginData);
  const selectProduct = useSelector((state) => state.discount);
  const token = useSelector((state) => state.IduniqueData);
  const dipatch = useDispatch();

  const createProductApi = async () => {
    console.log("is working sale api");
    setIsLoading(true);
    if (selectProduct.length == 0) {
      toast.error("You need to select products before saving");
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      return;
    }

    const data = {
      orderDate: date,
      user: userData._id,
      partner: partner,
      location: loca,
      lines: selectProduct.map((line) => ({
        product: line.id,
        qty: line.qty,
        tax: line.tax,
        discount: line.discount.id,
        unitPrice: line.salePrice,
        subTotal: line.discount.amount
          ? (line.salePrice - (line.salePrice * line.discount.amount) / 100) *
            line.qty
          : line.salePrice * line.qty,
      })),
      state: "pending",
      note: note,
      // payment: payment,
      taxTotal: totalTax,
      total: totalCost,
    };

    console.log(" adddata is a", data);

    try {
      let resData = await sendJsonToApi("/sale", data, token.accessToken);
      if (resData.message == "Token Expire , Please Login Again") {
        dipatch(removeData(null));
      }
      console.log("res data sale is ", resData);
      if (resData.status) {
        setIsLoading(false);
        toast(resData.message);
        navigate("/admin/saleorders/all");
      } else {
        toast.error(resData.message);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
    }
    setIsLoading(false);
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
  const getDiscount = async () => {
    const resData = await getApi("/discount", token.accessToken);
    const filteredDiscount = resData.data.filter((la) => la.active === true);
    setDiscount(filteredDiscount);
  };

  const handleDiscountChange = (e) => {
    const selectedDiscount = discount.find((ds) => ds.id === e.target.value);
    setDiscountId(e.target.value);
    setDiscountAmount(selectedDiscount ? selectedDiscount.amount : 0);
    setDiscountValue(selectedDiscount);
    //dispatch(removeAllSaleDiscount());
  };

  const handleAddProduct = () => {
    if (pd == "" || quantity == 0) {
      toast.error("you need to selecte the product and add quantity");
      return;
    }

    dispatch(addProduct(item, discountValue, quantity));

    selectProduct.forEach((item) => {
      const orderLine = {
        product: item.id,
        qty: parseInt(item.qty),
        tax: item.tax || 0,
        unitPrice: item.salePrice || 0,
        subTotal: item.salePrice * parseInt(item.qty),
      };

      // Include discount details if available
      if (discountValue) {
        orderLine.discount = discountValue.id;
        orderLine.unitPrice = (item.salePrice * discountValue.amount) / 100;
        orderLine.subTotal =
          ((pd.salePrice * discountValue.amount) / 100) * parseInt(item.qty);
      }

      // Add the new sale order line to the state
      setSaleOrderLines([...saleOrderLines, orderLine]);
    });

    // Reset input values
    setPd(options[0]);
    setQuantity(0);
    setTax(0);
    setUnitPrice(0);
  };

  useEffect(() => {
    let calculatedTotalTax = 0;
    let calculatedSubTotal = 0;

    selectProduct.forEach((sel) => {
      calculatedTotalTax += ((sel.tax * sel.qty) / 100) * sel.salePrice;
      //subTotal += sel.salePrice * sel.quantity;
      calculatedSubTotal += sel.discount?.amount
        ? (sel.salePrice - (sel.salePrice * sel.discount.amount) / 100) *
          sel.qty
        : sel.salePrice * sel.qty;
    });

    setTotalTax(calculatedTotalTax);
    setTotalCost(calculatedSubTotal + calculatedTotalTax);
    getLocation();
    getPartner();
    getProduct();
    getDiscount();
  }, [handleAddProduct]);

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
        <div className="flex flex-row justify-between my-5 max-w-7xl">
          <h2 className="lg:text-xl font-bold">Create Sale Order</h2>

          <div className="flex gap-3">
            <Button
              type="submit"
              isDisabled={isLoading}
              isLoading={isLoading}
              size="md"
              className={`font-bold rounded-sm shadow-sm flex items-center bg-white text-blue-700 border-blue-500 border-2 ${
                isLoading
                  ? ""
                  : "hover:opacity-75 text-sm hover:text-white hover:bg-blue-700"
              }`}
              onClick={handleSubmit}
            >
              Save
            </Button>

            <Link to="/admin/saleOrders/all">
              <Button className="rounded-sm shadow-sm flex items-center  text-red-500 border-red-500 bg-white border-2 hover:opacity-75 text-sm hover:text-white hover:bg-red-500 font-bold px-3 py-1.5">
                Discard
              </Button>
            </Link>
          </div>
        </div>

        <div className="container bg-white p-5 rounded-lg max-w-7xl">
          {isLoading && (
            <Progress size="sm" isIndeterminate aria-label="Loading..." />
          )}
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
                      setSelectedOption(e.target.value);
                    }}
                    className="max-w-xs"
                  >
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
              <div className="flex">
                <div className="w-60 flex justify-between relative">
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

                  <Icon
                    onClick={handlePartnerButtonClick}
                    icon="icomoon-free:new-tab"
                    className="text-lg absolute top-0 right-0 hover:opacity-70 text-slate-500 font-semibold"
                  />
                </div>
                <Icon
                  onClick={handlePartRefreshIcon}
                  icon="ic:baseline-refresh"
                  className={`mt-10 mx-3 text-xl text-slate-600 font-semibold hover:opacity-70 duration-1000 transition-all ${
                    partIconRotation ? "rotate-[360deg]" : "rotate-0"
                  }`}
                />
              </div>

              <div className="flex">
                <div className="w-60 flex justify-between relative">
                  <Select
                    labelPlacement="outside"
                    label="Location"
                    name="location"
                    placeholder="Select an location"
                    onChange={(e) => setLoca(e.target.value)}
                    className="max-w-xs"
                  >
                    {location.map((ct) => (
                      <SelectItem key={ct.id} value={ct.id}>
                        {ct.name}
                      </SelectItem>
                    ))}
                  </Select>

                  <Icon
                    onClick={handleLocationButtonClick}
                    icon="icomoon-free:new-tab"
                    className="text-lg absolute top-0 right-0 hover:opacity-70 text-slate-500 font-semibold"
                  />
                </div>
                <Icon
                  onClick={handleLocalRefreshIcon}
                  icon="ic:baseline-refresh"
                  className={`mt-10 mx-3 text-xl text-slate-600 font-semibold hover:opacity-70 duration-1000 transition-all ${
                    refreshIconRotation ? "rotate-[360deg]" : "rotate-0"
                  }`}
                />
              </div>

              <div className="w-60">
                <Input
                  type="text"
                  label="Note"
                  name="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Enter Note name..."
                  labelPlacement="outside"
                />
              </div>
            </div>
            <Divider />
            <div className="flex items-center w-full justify-between">
              <h3 className="text-lg font-semibold">Order Products</h3>
              <button
                onClick={handleAddProduct}
                className="font-bold rounded-sm shadow-sm flex items-center bg-slate-50 text-blue-700 border-blue-500 border-2 hover:opacity-75 text-sm hover:text-white hover:bg-blue-700 px-3 py-1.5"
              >
                <Icon icon="basil:plus-solid" className="text-lg" />
                Add
              </button>
            </div>
            <form onSubmit={handleAddProduct} className="flex justify-between">
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
                <div className="flex">
                  <div className="flex w-60 justify-between relative">
                    <Select
                      labelPlacement="outside"
                      label="Discount"
                      placeholder="Select an discount"
                      onChange={handleDiscountChange}
                    >
                      {discount.map((dis) => (
                        <SelectItem key={dis.id} value={dis.id}>
                          {dis.name + " " + " ( " + dis.amount + "%" + " ) "}
                        </SelectItem>
                      ))}
                    </Select>
                    <Icon
                      onClick={handleDiscountButtonClick}
                      icon="icomoon-free:new-tab"
                      className="text-lg absolute top-0 right-0 hover:opacity-70 text-slate-500 font-semibold"
                    />
                  </div>
                  <Icon
                    onClick={handleDiscontRefresh}
                    icon="ic:baseline-refresh"
                    className={`mt-10 mx-3 text-xl text-slate-600 font-semibold hover:opacity-70 duration-1000 transition-all ${
                      partIconRotation ? "rotate-[360deg]" : "rotate-0"
                    }`}
                  />
                </div>

                <div className="w-32">
                  <Input
                    type="number"
                    label="Tax"
                    name="tax"
                    isDisabled
                    value={(Tax * quantity) / 100}
                    onChange={(e) => setTax(e.target.value)}
                    placeholder="Tax"
                    labelPlacement="outside"
                  />
                </div>
                <div className="w-32">
                  <Input
                    type="number"
                    label="SubTotal"
                    name="subTotal"
                    isDisabled
                    value={
                      discountValue
                        ? unitPrice -
                          ((unitPrice * discountValue.amount) / 100) * quantity
                        : unitPrice * quantity
                    }
                    onChange={(e) => setTotalCost(e.target.value)}
                    placeholder="SubTotal"
                    labelPlacement="outside"
                  />
                </div>
              </div>
            </form>
            <div className="w-full mb-6">
              <Table removeWrapper aria-label="Example static collection table">
                <TableHeader className="header-cell bg-blue-500 text-white">
                  <TableColumn>Name</TableColumn>
                  <TableColumn>Barcode</TableColumn>
                  <TableColumn>Tax</TableColumn>
                  <TableColumn>Qty</TableColumn>
                  <TableColumn>Unit Price</TableColumn>
                  <TableColumn>SubTotal</TableColumn>
                  <TableColumn>Delete</TableColumn>
                </TableHeader>
                <TableBody>
                  {selectProduct.length > 0 &&
                    selectProduct.map((pd) => (
                      <TableRow key={count + 1}>
                        <TableCell>{pd.name}</TableCell>
                        <TableCell>{pd.barcode}</TableCell>
                        <TableCell>{pd.tax.toFixed(2)}</TableCell>
                        <TableCell>{pd.qty}</TableCell>
                        <TableCell>{pd.salePrice}</TableCell>
                        <TableCell>
                          {pd.discount?.amount
                            ? (pd.salePrice -
                                (pd.salePrice * pd.discount.amount) / 100) *
                              pd.qty
                            : pd.salePrice * pd.qty}
                        </TableCell>
                        <TableCell>
                          <BsTrash
                            className="text-center text-[#ef4444] text-lg font-bold hover:text-[#991b1b]"
                            onClick={() => dispatch(removeProduct(pd.id))}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex flex-col w-full">
              {/* <div className="flex w-60 justify-between relative">
                <Select
                  label="Discount"
                  variant="bordered"
                  placeholder="Select a discount"
                  labelPlacement="outside"
                  classNames={{
                    trigger: "font-bold w-60",
                  }}
                  onChange={handleDiscountChange}
                >
                  {discount.map((ds) => (
                    <SelectItem key={ds.id} value={ds.id}>
                      {ds.name}
                    </SelectItem>
                  ))}
                </Select>

                <Icon
                  onClick={handleDiscountButtonClick}
                  icon="icomoon-free:new-tab"
                  className="text-lg absolute top-0 right-0 hover:opacity-70 text-slate-500 font-semibold"
                />
              </div> */}

              <div className="flex mt-8 justify-self-end">
                <h1 className="text-lg font-semibold">
                  TaxTotal : <span>{totalTax.toFixed(2) ?? 0}</span>
                </h1>
              </div>
              <div className="flex mt-4 justify-self-end">
                <h1 className="text-lg font-semibold">
                  Total : <span>{totalCost.toFixed(2) ?? 0}</span>
                  {/* {(totalCost - (discountAmount / 100) * totalCost).toFixed(
                    2
                  ) ?? 0} */}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
