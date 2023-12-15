import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FormPathApi, getApi } from "../Api";
import { removeData } from "../../redux/actions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Input, Progress, Button, Select, SelectItem } from "@nextui-org/react";

export default function EmployeeEdit() {
  const { id } = useParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [birth, setBirth] = useState("");
  const [gender, setGender] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const token = useSelector((state) => state.IduniqueData);
  const navigate = useNavigate();
  const dipatch = useDispatch();

  const getSingleStaff = async () => {
    const response = await getApi(`/employee/${id}`, token.accessToken);
    if (response.status) {
      const formattedBirthDate = response.data[0].birthdate
        ? new Date(response.data[0].birthdate).toISOString().split("T")[0]
        : "";
      setBirth(formattedBirthDate);
      setName(response.data[0].name);
      setEmail(response.data[0].email);
      setAddress(response.data[0].address ? response.data[0].address : null);
      setPhone(response.data[0].phone ? response.data[0].phone : null);
      //setBirth(response.data[0].birthdate ? response.data[0].birthdate : null);
      setCity(response.data[0].city ? response.data[0].city : null);
      setGender(response.data[0].gender ? response.data[0].gender : null);
    }
  };

  const EditStaffInfoApi = async () => {
    const formData = new FormData();
    if (name) {
      formData.append("name", name);
    }
    if (email) {
      formData.append("email", email);
    }
    if (phone) {
      formData.append("phone", phone);
    }
    if (address) {
      formData.append("address", address);
    }
    if (birth) {
      formData.append("birthdate", birth);
    }
    if (city) {
      formData.append("city", city);
    }
    if (gender) {
      formData.append("gender", gender);
    }

    let resData = await FormPathApi(
      `/employee/${id}`,
      formData,
      token.accessToken
    );
    if (resData.message == "Token Expire , Please Login Again") {
      dipatch(removeData(null));
    }

    if (resData.status) {
      setIsLoading(false);
      navigate("/admin/employee/all");
    } else {
      setIsLoading(false);
      toast(resData.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    EditStaffInfoApi();
  };

  useEffect(() => {
    getSingleStaff();
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
          onClick={() => navigate("/admin/employee/all")}
        >
          Discard
        </Button>
      </div>

      <div className="container mt-2">
        <h2 className="lg:text-xl font-bold my-2">Employee Edit</h2>
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
                  value={name}
                  // color={isInvalid ? "danger" : "success"}
                  // errorMessage={isInvalid && "Please enter a valid email"}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter  name..."
                  labelPlacement="outside"
                />
              </div>
              <div className="w-60">
                <Input
                  type="text"
                  name="email"
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email..."
                  labelPlacement="outside"
                />
              </div>

              <div className="w-60">
                <Input
                  type="text"
                  isDisabled
                  name="address"
                  label="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter Address..."
                  labelPlacement="outside"
                />
              </div>
              <div className="w-60">
                <span className="text-sm">Date of Birth</span>
                <Input
                  type="date"
                  name="dob"
                  labelPlacement="outside"
                  value={
                    birth ? new Date(birth).toISOString().split("T")[0] : ""
                  }
                  onChange={(e) => setBirth(e.target.value)}
                />
              </div>
              <div className="w-60">
                <Input
                  type="text"
                  name="phone"
                  label="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter Phone..."
                  labelPlacement="outside"
                />
              </div>
              <div className="w-60">
                <Select
                  labelPlacement="outside"
                  label="Gender"
                  name="gender"
                  value={gender}
                  placeholder="Select an gender"
                  selectedKeys={gender ? [gender] : false}
                  onChange={(e) => setGender(e.target.value)}
                  className="max-w-xs"
                >
                  <SelectItem value="male" key="male">
                    male
                  </SelectItem>
                  <SelectItem value="female" key="female">
                    female
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
