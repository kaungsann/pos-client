import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApi, sendJsonToApi } from "../../Api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { removeData } from "../../../redux/actions";
import { Input, Progress, Button, Select, SelectItem } from "@nextui-org/react";

export default function WasteCreateForm() {
  const navigate = useNavigate();
  const [product, setProduct] = useState([]);
  const [location, setLocation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [locationId, setLocationId] = useState("");

  const token = useSelector((state) => state.IduniqueData);
  const dipatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    remark: "",
    ref: "",
    date: "",
    product: "",
    location: locationId,
    quantity: 1,
    amount: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "product") {
      let filterProduct = product.find((pd) => pd._id === value);

      let totalPrice = filterProduct.salePrice * formData.quantity;

      setFormData({
        ...formData,
        product: value,
        amount: totalPrice,
      });
    } else if (name === "quantity") {
      let totalPrice = formData.product
        ? product.find((pd) => pd._id === formData.product).salePrice * value
        : 0;

      setFormData({
        ...formData,
        quantity: value,
        amount: totalPrice,
      });
    } else if (name === "location") {
      setLocationId(value);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updatedFormData = { ...formData, location: locationId };

      const response = await sendJsonToApi(
        "/waste",
        updatedFormData,
        token.accessToken
      );

      if (response.message === "Token Expire , Please Login Again")
        dipatch(removeData(null));

      if (response.status) {
        navigate("/admin/waste/all");
        setIsLoading(false);
      } else {
        toast.error(response.message || "An error occurred");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error creating partner:", error);
    }
  };

  const getStock = async () => {
    const resData = await getApi("/stock", token.accessToken);

    let selectedLocationId;

    if (locationId === "") {
      selectedLocationId = null;
    } else {
      selectedLocationId = locationId;
    }

    const filteredStock = resData.data.filter(
      (item) =>
        item.active === true &&
        (!selectedLocationId || item.location._id === selectedLocationId)
    );

    if (selectedLocationId !== null) {
      setProduct([...filteredStock.map((item) => item.product)]);
    } else {
      setProduct([]);
    }
  };

  useEffect(() => {
    const getLocation = async () => {
      const resData = await getApi("/location", token.accessToken);
      const filteredLocation = resData.data.filter((la) => la.active === true);
      setLocation(filteredLocation);
    };
    getStock();
    getLocation();
  }, [locationId]);

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
        <Button
          type="submit"
          isDisabled={isLoading}
          isLoading={isLoading}
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
          isDisabled={isLoading}
          isLoading={isLoading}
          className={`rounded-sm shadow-sm flex items-center  text-red-500 border-red-500 bg-white border-2 text-sm ${
            isLoading
              ? ""
              : "hover:opacity-75 hover:text-white hover:bg-red-500 font-bold"
          }`}
          onClick={() => navigate("/admin/waste/all")}
        >
          Discard
        </Button>
      </div>
      <div className="container mt-2">
        <h2 className="lg:text-xl font-bold my-2">Waste Create</h2>
        <div className="container bg-white p-5 rounded-lg max-w-6xl">
          {isLoading && (
            <Progress size="sm" isIndeterminate aria-label="Loading..." />
          )}
          <form className="flex justify-between gap-10 p-5">
            <div className="flex flex-wrap gap-8">
              <Select
                labelPlacement="outside"
                label="Waste"
                name="name"
                placeholder="Select type"
                className="w-60"
                value={formData.name}
                onChange={(e) => handleInputChange(e)}
              >
                <SelectItem key="P&L" value="P&L">
                  P&L
                </SelectItem>
                <SelectItem key="M&C" value="M&C">
                  M&C
                </SelectItem>
              </Select>

              <Select
                labelPlacement="outside"
                label="Location"
                name="location"
                required
                placeholder="Select an location"
                onChange={(e) => handleInputChange(e)}
                className="w-60"
              >
                {location.map((loc) => (
                  <SelectItem key={loc.id} value={loc.id}>
                    {loc.name}
                  </SelectItem>
                ))}
              </Select>

              <Select
                labelPlacement="outside"
                label="Product"
                name="product"
                required
                placeholder="Select an product"
                onChange={(e) => handleInputChange(e)}
                className="w-60"
              >
                {product.map((pt) => (
                  <SelectItem key={pt._id} value={pt._id}>
                    {pt.name}
                  </SelectItem>
                ))}
              </Select>

              <div className="w-60">
                <Input
                  type="number"
                  name="quantity"
                  label="Quantity"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange(e)}
                  placeholder="Enter quantity..."
                  labelPlacement="outside"
                />
              </div>

              <div className="w-60">
                <Input
                  type="number"
                  name="amount"
                  label="Amount"
                  value={formData.amount}
                  placeholder="Enter amount..."
                  labelPlacement="outside"
                />
              </div>

              <div className="w-60">
                <Input
                  type="text"
                  name="remark"
                  label="Remark"
                  value={formData.remark}
                  onChange={(e) => handleInputChange(e)}
                  placeholder="Enter remark..."
                  labelPlacement="outside"
                />
              </div>
              <div className="w-60">
                <Input
                  type="text"
                  name="ref"
                  label="Ref"
                  value={formData.ref}
                  onChange={(e) => handleInputChange(e)}
                  placeholder="Enter ref..."
                  labelPlacement="outside"
                />
              </div>
              <div className="w-60">
                <Input
                  type="date"
                  name="date"
                  label="Date"
                  value={formData.date}
                  onChange={(e) => handleInputChange(e)}
                  placeholder="Enter date..."
                  labelPlacement="outside"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
