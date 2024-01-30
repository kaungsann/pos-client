import { useState, useEffect, useCallback } from "react";
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
  addCustomerToPurchaseOrder,
  addDateToPurchaseOrder,
  addLineToPurchaseOrder,
  addLocationToPurchaseOrder,
  addNoteToPurchaseOrder,
  removeAllLinesFromPurchaseOrder,
  removeData,
  removeLineFromPurchaseOrder,
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

export default function PurchaseCreate() {
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [partners, setPartners] = useState([]);

  const [paymentType, setPaymentType] = useState("cash");

  const [refreshIconRotation, setRefreshIconRotation] = useState(false);
  const [partIconRotation, setPartIconRotation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const INIT_LINE_STATE = {
    product: {
      id: "",
      name: "",
      salePrice: 0,
    },
    qty: 0,
    tax: 0,
    subTotal: 0,
    subTaxTotal: 0,
  };
  const [line, setLine] = useState(INIT_LINE_STATE);

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

  const navigate = useNavigate();

  const userData = useSelector((state) => state.loginData);
  const purchaseOrderData = useSelector((state) => state.purchaseOrder);
  const token = useSelector((state) => state.IduniqueData);
  const dipatch = useDispatch();

  const createProductApi = async () => {
    setIsLoading(true);

    if (purchaseOrderData.lines.length == 0) {
      toast.error("You need to select products before saving");
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      return;
    }

    const data = {
      ...purchaseOrderData,
      lines: purchaseOrderData.lines.map((line) => {
        const modifiedLine = {
          ...line,
          product: line.product.id,
          unitPrice: line.product.salePrice,
        };

        return modifiedLine;
      }),
      user: userData._id,
      state: "pending",
    };

    try {
      let resData = await sendJsonToApi("/purchase", data, token.accessToken);
      if (resData.message == "Token Expire , Please Login Again") {
        dipatch(removeData(null));
      }
      if (resData.status) {
        setIsLoading(false);
        toast(resData.message);
        navigate("/admin/purchase/all");
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

  const getLocation = useCallback(async () => {
    const resData = await getApi("/location", token.accessToken);
    const filteredLocation = resData.data.filter((la) => la.active === true);
    setLocations(filteredLocation);
  }, [token.accessToken]);

  const getPartner = useCallback(async () => {
    const resData = await getApi("/partner", token.accessToken);
    const filteredPartners = resData.data.filter(
      (partner) => partner.isCustomer === true && partner.active === true
    );
    setPartners(filteredPartners);
  }, [token.accessToken]);

  const getProduct = useCallback(async () => {
    const resData = await getApi("/product", token.accessToken);
    const filteredProducts = resData.data.filter((pd) => pd.active === true);
    setProducts(filteredProducts);
  }, [token.accessToken]);

  const handleAddProduct = () => {
    if (!line.product || !line.product.id) {
      toast.error("Please select a product before adding it to the sale order");
      return;
    }

    dispatch(addLineToPurchaseOrder(line));
    setLine(INIT_LINE_STATE);
  };

  useEffect(() => {
    getPartner();
    getProduct();
    getLocation();
  }, [getPartner, getProduct]);

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
        <div className="flex flex-row justify-between my-5">
          <h2 className="lg:text-xl font-bold">Create Purchase Order</h2>

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
              <Button
                onClick={() => {
                  dispatch(removeAllLinesFromPurchaseOrder());
                }}
                className="rounded-sm shadow-sm flex items-center  text-red-500 border-red-500 bg-white border-2 hover:opacity-75 text-sm hover:text-white hover:bg-red-500 font-bold px-3 py-1.5"
              >
                Discard
              </Button>
            </Link>
          </div>
        </div>

        <div className="container bg-white p-5 rounded-lg">
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
                    selectedKeys={[paymentType]?.filter(Boolean) || []}
                    placeholder="Select Payment Type"
                    onChange={(e) => {
                      setPaymentType(e.target.value);
                    }}
                    className="max-w-xs"
                  >
                    <SelectItem value="bank" key="bank">
                      Bank
                    </SelectItem>
                    <SelectItem value="cash" key="cash">
                      Cash
                    </SelectItem>
                  </Select>
                </div>
              </div>
              <div className="w-60">
                <Input
                  type="date"
                  name="expiredAt"
                  label="Order Date"
                  value={purchaseOrderData.orderDate}
                  placeholder="enter date"
                  labelPlacement="outside"
                  onChange={(e) =>
                    dispatch(addDateToPurchaseOrder(e.target.value))
                  }
                />
              </div>
              <div className="flex">
                <div className="w-60 flex justify-between relative">
                  <Select
                    labelPlacement="outside"
                    label="Partner"
                    name="partner"
                    selectedKeys={
                      [purchaseOrderData.partner]?.filter(Boolean) || []
                    }
                    placeholder="Select partner"
                    onChange={(e) =>
                      dispatch(addCustomerToPurchaseOrder(e.target.value))
                    }
                    className="max-w-xs"
                  >
                    {partners.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
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
                    selectedKeys={
                      [purchaseOrderData.location]?.filter(Boolean) || []
                    }
                    placeholder="Select an location"
                    onChange={(e) => {
                      dispatch(addLocationToPurchaseOrder(e.target.value));
                    }}
                    className="max-w-xs"
                  >
                    {locations.map((ct) => (
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
                  value={purchaseOrderData.note}
                  onChange={(e) =>
                    dispatch(addNoteToPurchaseOrder(e.target.value))
                  }
                  placeholder="Enter Note..."
                  labelPlacement="outside"
                />
              </div>
            </div>
            <Divider />
            <div className="flex items-center w-full justify-between">
              <h3 className="text-lg font-semibold">Select Products</h3>
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
                    placeholder="Select Product"
                    isDisabled={!products.length}
                    selectedKeys={[line.product.id]?.filter(Boolean) || []}
                    onChange={(e) => {
                      const selectedProduct = products.find(
                        (pt) => pt.id === e.target.value
                      );
                      if (selectedProduct) {
                        setLine((prev) => {
                          return {
                            ...prev,
                            product: selectedProduct,
                            qty: 1,
                            tax:
                              (selectedProduct.salePrice *
                                selectedProduct.tax) /
                              100,
                            subTotal:
                              (selectedProduct.salePrice +
                                (selectedProduct.salePrice *
                                  selectedProduct.tax) /
                                  100) *
                              1,
                            subTaxTotal:
                              (selectedProduct.salePrice *
                                selectedProduct.tax) /
                              100,
                          };
                        });
                      }
                    }}
                    className="max-w-xs"
                  >
                    {products.map((pt) => (
                      <SelectItem key={pt.id} value={pt.id}>
                        {pt.name}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <div className="w-20">
                  <Input
                    type="number"
                    label="Unit Price"
                    name="salePrice"
                    isDisabled
                    value={line.product?.salePrice}
                    placeholder="Tax"
                    labelPlacement="outside"
                  />
                </div>
                <div className="w-20">
                  <Input
                    type="number"
                    label="Qty"
                    name="qty"
                    value={line.qty}
                    onChange={(e) => {
                      const qty = parseInt(e.target.value);
                      if (qty > 0) {
                        setLine((prev) => {
                          return {
                            ...prev,
                            qty: qty,
                            subTotal:
                              (prev.product.salePrice +
                                (prev.product.salePrice * prev.product.tax) /
                                  100) *
                              qty,
                            subTaxTotal:
                              ((prev.product.salePrice * prev.product.tax) /
                                100) *
                              qty,
                          };
                        });
                      }
                    }}
                    placeholder="Enter Qty..."
                    labelPlacement="outside"
                  />
                </div>

                <div className="w-20">
                  <Input
                    type="number"
                    label="Tax"
                    name="tax"
                    isDisabled
                    value={line.tax}
                    placeholder="Tax"
                    labelPlacement="outside"
                  />
                </div>
                <div className="w-20">
                  <Input
                    type="number"
                    label="Tax Total"
                    name="subTaxTotal"
                    isDisabled
                    value={line.subTaxTotal}
                    placeholder="Tax"
                    labelPlacement="outside"
                  />
                </div>
                <div className="w-23">
                  <Input
                    type="number"
                    label="Discount Total"
                    name="subDiscTotal"
                    isDisabled
                    value={line.subDiscTotal}
                    placeholder="Tax"
                    labelPlacement="outside"
                  />
                </div>
                <div className="w-32">
                  <Input
                    type="number"
                    label="Subtotal (Inc. Tax)"
                    name="subTotal"
                    isDisabled
                    value={line.subTotal}
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
                  <TableColumn>Unit Price</TableColumn>
                  <TableColumn>Qty</TableColumn>
                  <TableColumn>Tax</TableColumn>
                  <TableColumn>Tax Total</TableColumn>
                  <TableColumn>SubTotal (Inc. Tax)</TableColumn>
                  <TableColumn>Delete</TableColumn>
                </TableHeader>
                <TableBody>
                  {purchaseOrderData.lines.length > 0 &&
                    purchaseOrderData.lines.map((line) => (
                      <TableRow key={line.product?._id}>
                        <TableCell>{line.product?.name}</TableCell>
                        <TableCell>{line.product?.barcode}</TableCell>
                        <TableCell>{line.product?.salePrice}</TableCell>
                        <TableCell>{line.qty}</TableCell>
                        <TableCell>{line.tax.toFixed(2)}</TableCell>
                        <TableCell>{line.subTaxTotal}</TableCell>
                        <TableCell>{line.subTotal}</TableCell>
                        <TableCell>
                          <BsTrash
                            className="text-center text-[#ef4444] text-lg font-bold hover:text-[#991b1b]"
                            onClick={() =>
                              dispatch(
                                removeLineFromPurchaseOrder(line.product?.id)
                              )
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex flex-col w-full">
              <div className="flex mt-4 justify-self-end">
                <h1 className="text-lg font-semibold">
                  Total Tax :{" "}
                  <span>{purchaseOrderData.taxTotal.toFixed(2) ?? 0}</span>
                </h1>
              </div>
              <div className="flex mt-4 justify-self-end">
                <h1 className="text-lg font-semibold">
                  Total : <span>{purchaseOrderData.total.toFixed(2) ?? 0}</span>
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
