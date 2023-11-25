import React, { useEffect, useState, useRef } from "react";
import { getApi, deleteMultiple } from "../../Api";
import { BiSolidEdit, BiImport, BiExport } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import DeleteAlert from "../../utils/DeleteAlert";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { FaEye } from "react-icons/fa6";
import { FiFilter } from "react-icons/fi";
import { MdClear } from "react-icons/md";
import { format } from "date-fns";
import { removeData } from "../../../redux/actions";
import ClipLoader from "react-spinners/ClipLoader";


export default function EmployeeAll() {
  const [employee, setEmployee] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);

  const [email , setEmail] = useState("")
  const [phone , setPhone] = useState(null)
  const [emplyeeId , setEmplyeeId] = useState(null)
  const [dateOfBirth , setDateOfBirth] = useState("")
  const [Gender ,setGender] = useState("")
  const [filterName, setFilterName] = useState("");

  const [isFilterActive, setIsFilterActive] = useState(true); // Track if any filter is active

  const [showFilter, setShowFilter] = useState(false);

  const [alert, setAlert] = useState(false);

  const inputRef = useRef();

  const navigate = useNavigate()

  const token = useSelector((state) => state.IduniqueData);
  const dipatch = useDispatch();


  const allEmployeeApi = async () => {
    setLoading(true)
    const resData = await getApi("/employee", token.accessToken);
  if (resData.message == "Token Expire , Please Login Again") {
      dipatch(removeData(null));
    }
    if (resData.status) {
      setLoading(false)
      const filteredCategory = resData.data.filter((em) => em.active === true);
      setEmployee(filteredCategory);
    } else {
      setLoading(false)
      toast(resData.message);
    }
  };

  const filteredEmployee = employee.filter((employe) => {
    //Filter by name
    if (
      filterName &&
      !employe.name.toLowerCase().includes(filterName)
    ) {
      return false;
    }
    // Filter by email
    if (email && !employe.email.includes(email)) {
      return false;
    }

    if (dateOfBirth && !employe.birthdate.includes(dateOfBirth)) {
      return false;
    }
    if (Gender && !employe.gender.includes(Gender)) {
      return false;
    }
    if (phone && !employe.phone.includes(phone)) {
      return false;
    }
    if (emplyeeId && !employe.employeeId.includes(emplyeeId)) {
      return false;
    }
    return true;
  });

  const filterRemove = () => {
    // Clear filter criteria and update the state variable
    setFilterName("");
    setEmail("");
    setPhone(null);
    setEmplyeeId(null);
    setDateOfBirth("")
    setGender("")
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setIsFilterActive(false);
  };

  const toggleSelectItem = (employeeId) => {
    setSelectAll(true);
    const isSelected = selectedItems.includes(employeeId);
    if (isSelected) {
      setSelectedItems(selectedItems.filter((id) => id !== employeeId));
    } else {
      setSelectedItems([...selectedItems, employeeId]);
    }
  };

  // Handle select all items
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      const allemployeIds = employee.map((employe) => employe.id);
      setSelectedItems(allemployeIds);
    }
    setSelectAll(!selectAll);
  };

  const deleteEmployees = async () => {
    if (selectedItems.length === 0) {
      toast("No employee selected for deletion.");
      return;
    }

    const response = await deleteMultiple(
      "/employee",
      {
        employeeIds: selectedItems,
      },
      token.accessToken
    );

    console.log("respone data is" ,response )

    if (response.status) {
      toast("Selected employee deleted successfully.");
      setSelectedItems([]);
      setSelectAll(false);
      allEmployeeApi();
    } else {
      toast("Failed to delete selected employee.");
    }
  };

  // Toggle filter box visibility
  const toggleFilterBox = () => {
    setShowFilter(!showFilter);
  };

  useEffect(() => {
    allEmployeeApi();
    if (email || phone || emplyeeId || dateOfBirth || Gender || filterName) {
      setIsFilterActive(true);
    } else {
      setIsFilterActive(false);
    }
  }, [email, phone, dateOfBirth, Gender, filterName]);

  
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
      <div className="flex w-full">
        <div className="flex w-full justify-between items-center">
          <div className="flex md:mr-8 justify-around cursor-pointer">
            <Link to="/admin/employee/create">
              <div className="font-bold rounded-sm shadow-sm flex items-cente text-blue-700 border-blue-500 border-2 hover:opacity-75 text-md hover:text-white hover:bg-blue-700 px-6 py-2">
                Add
              </div>
            </Link>
            <div onClick={toggleFilterBox}  className="rounded-sm ml-3 transition shadow-sm flex items-center text-[#4338ca] border-[#4338ca] border-2 hover:opacity-75 text-md hover:text-white hover:bg-[#4338ca] font-bold px-6 py-2">
              <FiFilter className="text-xl mx-2" />

              <h4>Filter</h4>
            </div>
            
          </div>

          <div className="w-96 md:w-72 relative">
            <input
              ref={inputRef}
              type="text"
              className="px-3 py-2 w-full rounded-md border-2 border-blue-500 shadow-md bg-white focus:outline-none"
              id="employes"
              placeholder="search employee name"
              onChange={(e) => setFilterName(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="w-full">
        <div className="flex  justify-between items-center">
          <h2 className="lg:text-2xl font-bold my-4">Employee</h2>
          {isFilterActive && (
            <button
              className="bg-red-500 px-4 h-8 rounded-md text-white hover:opacity-70"
              onClick={filterRemove}
            >
              Remove Filter
            </button>
          )}
        </div>
            {selectedItems.length > 0 && (
            <div className="flex justify-between mb-2 items-center px-2 py-2 bg-red-100">
              <h3 className="text-orange-400 font-semibold">
                {selectedItems.length} rows selected
              </h3>
              <button
                className="bg-red-500 py-2 px-4 rounded-md text-white hover:opacity-70"
                onClick={() => setAlert(true)}
              >
                Delete
              </button>
            </div>
              )}
            <table className="w-full">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="lg:px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    onChange={toggleSelectAll}
                    checked={selectAll && selectedItems.length > 0}
                  />
                  </th>
                  <th className=" py-2 text-center">Name</th>
                  <th className=" py-2 text-center">Email</th>
                  <th className=" py-2 text-center">Phone</th>
                  <th className=" py-2 text-center">Address</th>
                  <th className=" py-2 text-center">DateOfBirth</th>
                  <th className=" py-2 text-center">Gender</th>
                  <th className=" py-2 text-center">EmployeeId</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="w-full space-y-10">
                {filteredEmployee.length > 0 ?  
                    filteredEmployee.map((employ) => (
                    <tr
                    key={employ.id}
                    onClick={() => toggleSelectItem(employ.id)}
                    className={`${
                      selectedItems.includes(employ.id)
                        ? "bg-[#60a5fa] text-white"
                        : "odd:bg-white even:bg-slate-200"
                    }  mb-8 w-full items-center cursor-pointer hover:text-white hover:bg-[#60a5fa]`}
                    >
                      <td className="lg:px-4 py-2 text-center">
                        <input
                          type="checkbox"
                          onChange={() => toggleSelectItem(employ.id)}
                          checked={selectedItems.includes(employ.id)}
                        />
                      </td>

                      <td className="lg:px-4 py-2 text-center">{employ.name}</td>
                      <td className="lg:px-4 py-2 text-center">{employ.email}</td>
                      <td className="lg:px-4 py-2 text-center">{employ.phone}</td>
                      <td className="lg:px-4 py-2 text-center">{employ.address}</td>
                      <td className="lg:px-4 py-2 text-center">
                        {format(new Date(employ.birthdate), "yyyy-MM-dd")}
                      </td>
                      <td className="lg:px-4 py-2 text-center">{employ.gender}</td>
                      <td className="lg:px-4 py-2 text-center">
                        {employ.employeeId}
                      </td>

                      <td className="lg:px-4 py-2 text-center">
                        <div className="flex justify-center">
                          <FaEye
                            onClick={() =>
                              navigate(`/admin/employee/detail/${employ.id}`)
                            }
                            className="text-2xl text-sky-600 BiSolidEdit hover:text-sky-900"
                          />
                          <BiSolidEdit
                            className="text-2xl mx-2 text-[#5e54cd] BiSolidEdit hover:text-[#2c285f]"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/admin/employee/edit/${employ.id}`);
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  )): 
                  <div className="w-10/12 mx-auto absolute mt-40 flex justify-center">
                  {loading && (
                    <ClipLoader
                      color={"#0284c7"}
                      loading={loading}
                      size={20}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    />
                  )}
                </div>
                  }
              </tbody>
            </table> 
       </div>
       {/* Filter Box */}
        {showFilter && (
            <div
              className={`w-96 bg-slate-50 h-screen fixed top-0 right-0 p-4 z-50 transition-transform transform ${
                showFilter ? "translate-x-0" : "-translate-x-full"
              }ease-in-out duration-700`}
            >
          <div className="flex justify-between my-6">
            <h2 className="text-xl font-bold text-slate-700">
              Filter Employee
            </h2>
            <MdClear
              onClick={() => setShowFilter(!showFilter)}
              className="text-2xl font-semibold text-slate-600 hover:opacity-70"
            />
          </div>
          <div>
            <div className="my-3 flex flex-col">
              <label className="text-lg my-2 text-slate-600 font-semibold">
                Email
              </label>
              <input
                type="text"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md py-2 px-3 border-2 border-blue-300"
                placeholder="Search By email"
              />
            </div>
            <div className="my-3 flex flex-col">
              <label className="text-lg my-2 text-slate-600 font-semibold">
                Phone
              </label>
              <input
                type="text"
                onChange={(e) =>setPhone(e.target.value)}
                className="w-full rounded-md py-2 px-3 border-2 border-blue-300"
                placeholder="Search By phone"
              />
            </div>
            <div className="my-3 flex flex-col">
              <label className="text-lg my-2 text-slate-600 font-semibold">
              Gender
              </label>
              <input
                type="text"
                onChange={(e) => setGender(e.target.value)}
                className="w-full rounded-md py-2 px-3 border-2 border-blue-300"
                placeholder="Search By gender"
              />
            </div>
            <div className="my-3 flex flex-col">
              <label className="text-lg my-2 text-slate-600 font-semibold">
                Employee Id
              </label>
              <input
                type="text"
                onChange={(e) => setEmplyeeId(e.target.value)}
                className="w-full rounded-md py-2 px-3 border-2 border-blue-300"
                placeholder="Search By Employee Id"
              />
            </div>
            <div className="my-3 flex flex-col">
              <label className="text-lg my-2 text-slate-600 font-semibold">
                Date Of Birth
              </label>
              <input
                type="text"
              onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full rounded-md py-2 px-3 border-2 border-blue-300"
                placeholder="Search By DateOfBirth"
              />
            </div>
            <div className="flex justify-between w-full my-4">
              {/* <button className="flex hover:opacity-70 px-4 py-2 justify-center items-center bg-blue-500 rounded-md text-white w-2/4">
                <FiFilter className="mx-1" />
                Filter
              </button> */}
              <button
                onClick={() => {
                  setShowFilter(!showFilter),filterRemove()
                }}
                className="px-4 hover:opacity-70 py-2 bg-red-500 rounded-md text-white w-full"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {alert && (
        <DeleteAlert
          cancel={() => {
            setAlert(false);
            setSelectedItems([]);
          }}
          onDelete={() => {
            deleteEmployees();
            setAlert(false);
          }}
        />
      )}
    </>
  );
}
