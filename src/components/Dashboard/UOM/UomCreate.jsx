import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApi, sendJsonToApi } from "../../Api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { removeData } from "../../../redux/actions";
import { Input, Progress, Button, Select, SelectItem } from "@nextui-org/react";

export default function UomCreate() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [uomCats, setUomCats] = useState([]);

  const token = useSelector((state) => state.IduniqueData);
  const dipatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    refType: "",
    ratio: 0,
    uomCatg: "",
  });

  // const handleInputChange = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "uomCatg" ? value : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await sendJsonToApi("/uom", formData, token.accessToken);

      if (response.message === "Token Expire , Please Login Again")
        dipatch(removeData(null));

      if (response.status) {
        navigate("/admin/uom/all");
        setIsLoading(false);
      } else {
        toast.error(response.message || "An error occurred");
        setIsLoading(false);
      }
    } catch (error) {
      toast.error(error.message || "An error occurred");
    }
  };

  useEffect(() => {
    const getUomCats = async () => {
      const resData = await getApi("/uomCategory", token.accessToken);
      const filteredLocation = resData.data.filter((la) => la.active === true);
      setUomCats(filteredLocation);
    };
    getUomCats();
  }, []);

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
          onClick={() => navigate("/admin/uom/all")}
        >
          Discard
        </Button>
      </div>
      <div className="container mt-2">
        <h2 className="lg:text-xl font-bold my-2">Uom Create</h2>
        <div className="container bg-white p-5 rounded-lg max-w-6xl">
          {isLoading && (
            <Progress size="sm" isIndeterminate aria-label="Loading..." />
          )}
          <form className="flex justify-between gap-10 p-5">
            <div className="flex flex-wrap gap-8">
              <div className="w-60">
                <Input
                  type="text"
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange(e)}
                  placeholder="enter uom name..."
                  labelPlacement="outside"
                />
              </div>
              <div className="w-60">
                <Input
                  type="number"
                  name="ratio"
                  label="Ratio"
                  value={formData.ratio}
                  onChange={(e) => handleInputChange(e)}
                  placeholder="enter ratio..."
                  labelPlacement="outside"
                />
              </div>
              <div className="w-60">
                <Select
                  labelPlacement="outside"
                  label="Ref-Type"
                  name="refType"
                  placeholder="Select Ref-Type"
                  className="max-w-xs"
                  value={formData.refType}
                  onChange={(e) => handleInputChange(e)}
                >
                  <SelectItem key="reference" value="reference">
                    reference
                  </SelectItem>
                  <SelectItem key="bigger" value="bigger">
                    bigger
                  </SelectItem>
                  <SelectItem key="smaller" value="smaller">
                    smaller
                  </SelectItem>
                </Select>
              </div>

              <Select
                labelPlacement="outside"
                label="UOM-Category"
                name="uomCatg"
                required
                placeholder="Select an Uom Category"
                onChange={(e) => handleInputChange(e)}
                className="w-60"
              >
                {uomCats.map((um) => (
                  <SelectItem key={um._id} value={um._id}>
                    {um.name}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
