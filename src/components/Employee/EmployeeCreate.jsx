import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { sendJsonToApi } from "../Api";
import { useSelector } from "react-redux";
import { Input, Progress, Button, Select, SelectItem } from "@nextui-org/react";

export default function EmployeeCreate() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    birthdate: "",
    gender: "",
    city: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const token = useSelector((state) => state.IduniqueData);

  const handleEmployee = async () => {
    let response = await sendJsonToApi(
      "/employee",
      formData,
      token.accessToken
    );

    if (response.status) {
      setIsLoading(false);
      navigate("/admin/employee/all");
    } else {
      setIsLoading(false);
      toast(response.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    handleEmployee();
  };

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
      />

      <div className="container mt-2">
        <div className="flex flex-row justify-between my-4 max-w-6xl">
          <h2 className="lg:text-xl font-bold">Employee Create</h2>

          <div className="flex gap-3">
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
              onClick={() => navigate("/admin/employee/all")}
            >
              Discard
            </Button>
          </div>
        </div>
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
                  // color={isInvalid ? "danger" : "success"}
                  // errorMessage={isInvalid && "Please enter a valid email"}
                  // onChange={(e) => setName(e.target.value)}
                  onChange={(e) => handleInputChange(e)}
                  placeholder="Enter Employee name..."
                  labelPlacement="outside"
                />
              </div>
              <div className="w-60">
                <Input
                  type="email"
                  required
                  name="email"
                  label="Email"
                  value={formData.email}
                  //onChange={(e) => setEmail(e.target.value)}
                  onChange={(e) => handleInputChange(e)}
                  placeholder="Enter reference..."
                  labelPlacement="outside"
                />
              </div>
              <div className="w-60   relative">
                <Input
                  type="number"
                  name="phone"
                  label="Phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange(e)}
                  placeholder="Enter Phone..."
                  labelPlacement="outside"
                />
              </div>
              <div className="w-60">
                <span className="text-sm">Date of Birth</span>
                <Input
                  type="date"
                  name="birthdate"
                  labelPlacement="outside"
                  value={formData.birthdate}
                  onChange={(e) => handleInputChange(e)}
                  // onChange={(e) => setBirthDate(e.target.value)}
                />
              </div>
              <div className="w-60">
                <Input
                  type="text"
                  label="address"
                  name="address"
                  value={formData.address}
                  // color={isInvalid ? "danger" : "success"}
                  // errorMessage={isInvalid && "Please enter a valid email"}
                  // onChange={(e) => setName(e.target.value)}
                  onChange={(e) => handleInputChange(e)}
                  placeholder="Enter address ..."
                  labelPlacement="outside"
                />
              </div>
              <div className="w-60">
                <Input
                  type="text"
                  label="City"
                  name="city"
                  value={formData.city}
                  // color={isInvalid ? "danger" : "success"}
                  // errorMessage={isInvalid && "Please enter a valid email"}
                  // onChange={(e) => setName(e.target.value)}
                  onChange={(e) => handleInputChange(e)}
                  placeholder="Enter city name..."
                  labelPlacement="outside"
                />
              </div>
              <div className="w-60 my-2">
                {/* <label className="after:content-['*'] mb-3 after:ml-0.5 after:text-red-500 block text-lg font-semibold text-slate-600">
                  Gender
                </label>
                <select
                  // onChange={(e) => setGender(e.target.value)}
                  onChange={(e) => handleInputChange(e)}
                  id="gender"
                  required
                  name="gender"
                  className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                  value={formData.gender}
                >
                  <option disabled value="">
                    Select an option
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select> */}

                <Select
                  label="Gender"
                  placeholder="Select Gender"
                  labelPlacement="outside"
                  className="max-w-xs"
                  id="gender"
                  name="gender"
                  onChange={(e) => handleInputChange(e)}
                >
                  <SelectItem key="male" value="male">
                    Male
                  </SelectItem>
                  <SelectItem key="female" value="female">
                    Female
                  </SelectItem>
                  <SelectItem value="other" key="other">
                    Other
                  </SelectItem>
                </Select>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
