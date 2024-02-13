import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL, getApi } from "../Api";
import { removeData } from "../../redux/actions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Input, Progress, Select, SelectItem } from "@nextui-org/react";
import axios from "axios";

export default function StaffEdit() {
  const { id } = useParams();

  const [showBox, setShowBox] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  //const [locations, setLocations] = useState([]);

  const token = useSelector((state) => state.IduniqueData);

  const navigate = useNavigate();

  const staffDoc = {
    username: "",
    email: "",
    phone: 0,
    gender: "",
    address: "",
    birthdate: "",
    city: "",
    // location: "",
  };
  const [staff, setStaff] = useState(staffDoc);

  const dispatch = useDispatch();

  const inputChangeHandler = (event) => {
    const { name, value } = event.target;

    setStaff({ ...staff, [name]: value });
  };

  const getSingleStaff = async () => {
    const response = await getApi(`/user/${id}`, token.accessToken);

    if (response.status) {
      setStaff({
        username: response.data[0].username,
        email: response.data[0].email,
        phone: response.data[0].phone,
        gender: response.data[0].gender,
        city: response.data[0].city,
        address: response.data[0].address,
        birthdate: response.data[0].birthdate,
        //  location: response.data[0].location.id,
      });
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await axios.patch(BASE_URL + `/user/${id}`, staff, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!data.status) {
        if (data?.message === "Token Expire , Please Login Again") {
          dispatch(removeData(null));
        }
        toast.warn(data.message);
      } else {
        navigate("/admin/user/all");
      }
    } catch (error) {
      console.error("Error updating staff:", error);
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // const getLocation = async () => {
    //   const resData = await getApi("/location", token.accessToken);
    //   const filteredLocation = resData.data.filter((la) => la.active === true);
    //   setLocations(filteredLocation);
    // };

    // getLocation();

    getSingleStaff();
  }, []);

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={4000}
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

      <div className="container mt-2">
        <div className="flex flex-row justify-between my-4 max-w-6xl">
          <h2 className="lg:text-xl font-bold ">Staff Edit</h2>
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
              onClick={() => setShowBox(true)}
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
              onClick={() => navigate("/admin/user/all")}
            >
              Discard
            </Button>
            <div className="w-96 absolute top-32 left-0 right-0 z-50 mx-auto bg-white rounded-md shadow-md flex justify-center cursor-pointer">
              {showBox && (
                <div className="w-72 my-3">
                  <div className="flex justify-between">
                    <label
                      htmlFor="phone"
                      className="after:content-['*'] mb-3 after:ml-0.5 after:text-red-500 block text-lg font-semibold text-slate-600"
                    >
                      Password*
                    </label>
                    <h3
                      onClick={() => setShowBox(false)}
                      className="text-slate-600 font-semibold text-xl hover:text-slate-400"
                    >
                      X
                    </h3>
                  </div>

                  <div className="mt-2">
                    <input
                      onChange={(e) => inputChangeHandler(e)}
                      id="password"
                      name="password"
                      type="password"
                      required
                      placeholder="Enter the admin password"
                      className=" px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                    />
                    <button
                      onClick={onSubmitHandler}
                      className="w-72 my-3 items-center flex justify-center rounded-md bg-blue-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              )}
            </div>
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
                  name="username"
                  value={staff.username}
                  onChange={(e) => inputChangeHandler(e)}
                  // onChange={(e) => setName(e.target.value)}
                  placeholder="Enter Staff name..."
                  labelPlacement="outside"
                />
              </div>
              <div className="w-60">
                <Input
                  type="email"
                  name="email"
                  label="Email"
                  value={staff.email}
                  onChange={(e) => inputChangeHandler(e)}
                  placeholder="Enter reference..."
                  labelPlacement="outside"
                />
              </div>
              {/* <div className="w-60">
                <Select
                  labelPlacement="outside"
                  label="Location"
                  name="location"
                  placeholder="Select an location"
                  selectedKeys={staff.location ? [staff.location] : false}
                  onChange={(e) => inputChangeHandler(e)}
                  className="w-60"
                >
                  {locations.map((loc) => (
                    <SelectItem key={loc.id} value={loc.id}>
                      {loc.name}
                    </SelectItem>
                  ))}
                </Select>
              </div> */}
              <div className="w-60">
                <Input
                  type="text"
                  name="address"
                  label="Address"
                  value={staff.address}
                  onChange={(e) => inputChangeHandler(e)}
                  placeholder="Enter Address..."
                  labelPlacement="outside"
                />
              </div>
              <div className="w-60">
                <span className="text-sm">Date of Birth</span>
                <Input
                  type="date"
                  name="birthdate"
                  labelPlacement="outside"
                  onChange={(e) => inputChangeHandler(e)}
                  value={
                    staff.birthdate
                      ? new Date(staff.birthdate).toISOString().split("T")[0]
                      : ""
                  }
                />
              </div>
              <div className="w-60">
                <Input
                  type="number"
                  name="phone"
                  label="Phone"
                  value={staff.phone}
                  onChange={(e) => inputChangeHandler(e)}
                  placeholder="Enter Phone..."
                  labelPlacement="outside"
                />
              </div>
              <div className="w-60">
                <Input
                  type="text"
                  name="city"
                  label="City"
                  value={staff.city}
                  onChange={(e) => inputChangeHandler(e)}
                  placeholder="Enter City..."
                  labelPlacement="outside"
                />
              </div>
              <div className="mt-1">
                <div className="w-60">
                  <Select
                    labelPlacement="outside"
                    label="Gender"
                    name="gender"
                    value={staff.gender}
                    onChange={(e) => inputChangeHandler(e)}
                    placeholder="Select an gender"
                    selectedKeys={staff.gender ? [staff.gender] : false}
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
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
