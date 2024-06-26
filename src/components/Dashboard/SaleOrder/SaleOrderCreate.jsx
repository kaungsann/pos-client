import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
  addCustomerToSaleOrder,
  addDateToSaleOrder,
  addLineToSaleOrder,
  addLocationToSaleOrder,
  addNoteToSaleOrder,
  removeAllLinesFromSaleOrder,
  removeData,
  removeLineFromSaleOrder,
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
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [partners, setPartners] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [uoms, setUoms] = useState([]);

  const [paymentType, setPaymentType] = useState("cash");
  const [stock, setStock] = useState([]);

  const [refreshIconRotation, setRefreshIconRotation] = useState(false);
  const [partIconRotation, setPartIconRotation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const navigate = useNavigate();

  const userData = useSelector((state) => state.loginData);
  const saleOrderData = useSelector((state) => state.saleOrder);
  const token = useSelector((state) => state.IduniqueData);
  const dipatch = useDispatch();

  const INIT_LINE_STATE = {
    product: {
      id: "",
      name: "",
      salePrice: 0,
    },
    qty: 0,
    uom: { id: "", name: "", ratio: 1 },
    tax: 0,
    discount: { id: "", amount: 0 },
    subTotal: 0,
    subTaxTotal: 0,
    subDiscTotal: 0,
  };
  const [line, setLine] = useState(INIT_LINE_STATE);

  const createProductApi = async () => {
    setIsLoading(true);

    if (saleOrderData.lines.length == 0) {
      toast.error("You need to select products before saving");
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      return;
    }

    const data = {
      ...saleOrderData,
      lines: saleOrderData.lines.map((line) => {
        const modifiedLine = {
          ...line,
          product: line.product._id,
          uom: line.uom.id,
          unitPrice: line.product.salePrice,
        };
        if (line.discount && line.discount.id) {
          modifiedLine.discount = line.discount.id;
        } else {
          delete modifiedLine.discount;
        }
        return modifiedLine;
      }),
      user: userData._id,
      state: "pending",
    };

    try {
      let resData = await sendJsonToApi("/sale", data, token.accessToken);
      if (resData.message == "Token Expire , Please Login Again") {
        dipatch(removeData(null));
      }
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

  const getDiscount = useCallback(async () => {
    const resData = await getApi("/discount", token.accessToken);
    const filteredDiscount = resData.data.filter((la) => la.active === true);
    setDiscounts(filteredDiscount);
  }, [token.accessToken]);

  const getStock = useCallback(async () => {
    const resData = await getApi("/stock", token.accessToken);
    const filteredStock = resData.data.filter((la) => la.active === true);

    function getUniqueLocations(data) {
      const uniqueLocations = {};
      const result = [];

      data.forEach((item) => {
        const { _id, name } = item.location;
        if (!uniqueLocations[_id]) {
          uniqueLocations[_id] = true;
          result.push({ _id, name });
        }
      });

      return result;
    }

    if (saleOrderData.location) {
      const filterProducts = filteredStock
        .filter((item) => item.location._id === saleOrderData.location)
        .map((item) => ({ ...item.product }));
      setProducts(filterProducts);
    }

    setLocations(getUniqueLocations(filteredStock));
    setStock(filteredStock);
  }, [token.accessToken]);

  const getUOM = useCallback(async () => {
    const resData = await getApi("/uom", token.accessToken);
    const filteredUoms = resData.data.filter((la) => la.active === true);

    setUoms(filteredUoms);
  }, [token.accessToken]);

  const handleAddProduct = () => {
    if (!line.product || !line.product._id) {
      toast.error("Please select a product before adding it to the sale order");
      return;
    }

    dispatch(addLineToSaleOrder(line));
    setLine(INIT_LINE_STATE);
  };

  const handleDiscard = (e) => {
    e.preventDefault();
    dispatch(removeAllLinesFromSaleOrder());
    navigate("/admin/saleOrders/all");
  };

  useEffect(() => {
    getPartner();
    getDiscount();
    getStock();
    getUOM();
  }, [getPartner, getDiscount, getStock, getUOM]);

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

            <Button
              onClick={handleDiscard}
              className="rounded-sm shadow-sm flex items-center  text-red-500 border-red-500 bg-white border-2 hover:opacity-75 text-sm hover:text-white hover:bg-red-500 font-bold px-3 py-1.5"
            >
              Discard
            </Button>
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
                  name="date"
                  label="Scheduled Date"
                  value={saleOrderData.orderDate}
                  placeholder="enter date"
                  labelPlacement="outside"
                  onChange={(e) => dispatch(addDateToSaleOrder(e.target.value))}
                />
              </div>
              <div className="flex">
                <div className="w-60 flex justify-between relative">
                  <Select
                    labelPlacement="outside"
                    label="Partner"
                    name="partner"
                    selectedKeys={
                      [saleOrderData.partner]?.filter(Boolean) || []
                    }
                    placeholder="Select partner"
                    onChange={(e) =>
                      dispatch(addCustomerToSaleOrder(e.target.value))
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
                      [saleOrderData.location]?.filter(Boolean) || []
                    }
                    placeholder="Select an location"
                    onChange={(e) => {
                      const products = stock
                        .filter((item) => item.location._id === e.target.value)
                        .map((item) => ({ ...item.product }));
                      setProducts(products);
                      dispatch(addLocationToSaleOrder(e.target.value));
                    }}
                    className="max-w-xs"
                  >
                    {locations.map((ct) => (
                      <SelectItem key={ct._id} value={ct._id}>
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
                  value={saleOrderData.note}
                  onChange={(e) => dispatch(addNoteToSaleOrder(e.target.value))}
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
                    selectedKeys={[line.product._id]?.filter(Boolean) || []}
                    onChange={(e) => {
                      const selectedProduct = products.find(
                        (pt) => pt._id === e.target.value
                      );
                      if (selectedProduct) {
                        setLine((prev) => {
                          return {
                            ...prev,
                            product: selectedProduct,
                            qty: 1,
                            uom: { id: "", name: "", ratio: 1 },
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
                      <SelectItem key={pt._id} value={pt._id}>
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
                <div className="w-16">
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
                              (qty * prev.uom.ratio),
                            subDiscTotal:
                              ((prev.product.salePrice * prev.discount.amount) /
                                100) *
                              (qty * prev.uom.ratio),
                            subTaxTotal:
                              ((prev.product.salePrice * prev.product.tax) /
                                100) *
                              (qty * prev.uom.ratio),
                          };
                        });
                      }
                    }}
                    placeholder="Enter Qty..."
                    labelPlacement="outside"
                  />
                </div>
                <div className="w-40">
                  <Select
                    labelPlacement="outside"
                    label="UOM"
                    name="uom"
                    selectedKeys={[line.uom.id]?.filter(Boolean) || []}
                    placeholder="Select an measurement"
                    onChange={(e) => {
                      const selectedUOM = uoms.find(
                        (uom) => uom.id === e.target.value
                      );
                      if (selectedUOM) {
                        setLine((prev) => {
                          return {
                            ...prev,
                            uom: selectedUOM,
                            subTotal:
                              (prev.product.salePrice +
                                (prev.product.salePrice * prev.product.tax) /
                                  100) *
                              (prev.qty * selectedUOM.ratio),
                            subDiscTotal:
                              ((prev.product.salePrice * prev.discount.amount) /
                                100) *
                              (prev.qty * selectedUOM.ratio),
                            subTaxTotal:
                              ((prev.product.salePrice * prev.product.tax) /
                                100) *
                              (prev.qty * selectedUOM.ratio),
                          };
                        });
                      }
                    }}
                  >
                    {uoms.map((uom) => (
                      <SelectItem key={uom.id} value={uom.id}>
                        {uom.name}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <div className="flex">
                  <div className="flex w-60 justify-between relative">
                    <Select
                      labelPlacement="outside"
                      label="Discount"
                      name="discount"
                      isDisabled={!discounts.length}
                      selectedKeys={[line.discount.id]?.filter(Boolean) || []}
                      placeholder="Select an discount"
                      onChange={(e) => {
                        const selectedDiscount = discounts.find(
                          (ds) => ds.id === e.target.value
                        );
                        if (selectedDiscount) {
                          setLine((prev) => {
                            return {
                              ...prev,
                              discount: selectedDiscount,
                              subDiscTotal:
                                ((prev.product.salePrice *
                                  selectedDiscount.amount) /
                                  100) *
                                prev.qty,
                              subTotal:
                                prev.product.salePrice * prev.qty -
                                (prev.product.salePrice *
                                  selectedDiscount.amount *
                                  prev.qty) /
                                  100,
                            };
                          });
                        }
                      }}
                    >
                      {discounts.map((dis) => (
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
                    className={`mt-10 mx-2 text-xl text-slate-600 font-semibold hover:opacity-70 duration-1000 transition-all ${
                      partIconRotation ? "rotate-[360deg]" : "rotate-0"
                    }`}
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
                    placeholder="Tax Total"
                    labelPlacement="outside"
                  />
                </div>
                <div className="w-20">
                  <Input
                    type="number"
                    label="Dis Total"
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
                  <TableColumn>UOM</TableColumn>
                  <TableColumn>Tax</TableColumn>
                  <TableColumn>Discount</TableColumn>
                  <TableColumn>Tax Total</TableColumn>
                  <TableColumn>Discount Total</TableColumn>
                  <TableColumn>SubTotal (Inc. Tax)</TableColumn>
                  <TableColumn>Delete</TableColumn>
                </TableHeader>
                <TableBody>
                  {saleOrderData.lines.length > 0 &&
                    saleOrderData.lines.map((line) => (
                      <TableRow key={`${line.product?.id}-${line.uom?.id}`}>
                        <TableCell>{line.product?.name}</TableCell>
                        <TableCell>{line.product?.barcode}</TableCell>
                        <TableCell>{line.product?.salePrice}</TableCell>
                        <TableCell>{line.qty}</TableCell>
                        <TableCell>{line.uom?.name}</TableCell>
                        <TableCell>{line.tax.toFixed(2)}</TableCell>
                        <TableCell>{line.discount?.amount}</TableCell>
                        <TableCell>{line.subTaxTotal}</TableCell>
                        <TableCell>{line.subDiscTotal}</TableCell>
                        <TableCell>{line.subTotal}</TableCell>
                        <TableCell>
                          <BsTrash
                            className="text-center text-[#ef4444] text-lg font-bold hover:text-[#991b1b]"
                            onClick={() =>
                              dispatch(
                                removeLineFromSaleOrder(
                                  line.product?._id,
                                  line.uom?.id
                                )
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
              <div className="flex mt-8 justify-self-end">
                <h1 className="text-lg font-semibold">
                  Total Discount :{" "}
                  <span>{saleOrderData.discountTotal.toFixed(2) ?? 0}</span>
                </h1>
              </div>
              <div className="flex mt-4 justify-self-end">
                <h1 className="text-lg font-semibold">
                  Total Tax :{" "}
                  <span>{saleOrderData.taxTotal.toFixed(2) ?? 0}</span>
                </h1>
              </div>
              <div className="flex mt-4 justify-self-end">
                <h1 className="text-lg font-semibold">
                  Total : <span>{saleOrderData.total.toFixed(2) ?? 0}</span>
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
