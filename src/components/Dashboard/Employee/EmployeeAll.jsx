import React, { useEffect, useState, useRef } from "react";
import { getApi, deleteMultiple } from "../../Api";
import { BiSolidEdit, BiImport, BiExport } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import DeleteAlert from "../../utils/DeleteAlert";
import FadeLoader from "react-spinners/FadeLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { FaEye } from "react-icons/fa6";
import { FiFilter } from "react-icons/fi";
import { MdClear } from "react-icons/md";
import { format } from "date-fns";
import { removeData } from "../../../redux/actions";

export default function EmployeeAll() {
  const [employee, setEmployee] = useState([]);

  const token = useSelector((state) => state.IduniqueData);
  const dipatch = useDispatch();

  const allEmployeeApi = async () => {
    const resData = await getApi("/employee", token.accessToken);
    if (resData.status) {
      setEmployee(resData.data);
    } else {
      toast(resData.message);
    }
  };

  useEffect(() => {
    allEmployeeApi();
  }, []);
  return (
    <>
      <div className="flex w-full">
        <div className="flex w-full justify-between items-center">
          <div className="flex md:mr-8 justify-around cursor-pointer">
            <Link to="/admin/employee/create">
              <div className="font-bold rounded-sm shadow-sm flex items-cente text-blue-700 border-blue-500 border-2 hover:opacity-75 text-md hover:text-white hover:bg-blue-700 px-6 py-2">
                Add
              </div>
            </Link>
            <div className="rounded-sm ml-3 transition shadow-sm flex items-center text-[#4338ca] border-[#4338ca] border-2 hover:opacity-75 text-md hover:text-white hover:bg-[#4338ca] font-bold px-6 py-2">
              <FiFilter className="text-xl mx-2" />
              <h4>Filter</h4>
            </div>
          </div>

          <div className="w-96 md:w-72 relative">
            <input
              type="text"
              className="px-3 py-2 w-full rounded-md border-2 border-blue-500 shadow-md bg-white focus:outline-none"
              id="products"
              placeholder="search products"
              onChange={(e) => setSearchItems(e.target.value.toLowerCase())}
            />
          </div>
        </div>
      </div>
      <div className="w-full">
        <div className="flex justify-between items-center">
          <h2 className="lg:text-2xl font-bold my-4">Employee</h2>
        </div>

        <table className="w-full">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="lg:px-4 py-2 text-center">
                <input type="checkbox" />
              </th>
              <th className=" py-2 text-center">Name</th>
              <th className=" py-2 text-center">Email</th>
              <th className=" py-2 text-center">Phone</th>
              <th className=" py-2 text-center">Address</th>
              <th className=" py-2 text-center">DateOfBirth</th>
              <th className=" py-2 text-center">Gender</th>
              <th className=" py-2 text-center">EmployeeId</th>

              <th></th>
            </tr>
          </thead>
          <tbody className="w-full space-y-10">
            {employee.length > 0 &&
              employee.map((employ) => (
                <tr
                  key={usr._id}
                  onClick={() => toggleSelectItem(employ._id)}
                  className={`${
                    selectedItems.includes(employ._id)
                      ? "bg-[#60a5fa] text-white"
                      : "odd:bg-white even:bg-slate-200"
                  }  mb-8 w-full items-center cursor-pointer hover:text-white hover:bg-[#60a5fa]`}
                >
                  <td className="lg:px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      onChange={() => toggleSelectItem(employ._id)}
                      checked={selectedItems.includes(employ._id)}
                    />
                  </td>

                  <td className="lg:px-4 py-2 text-center">{employ.name}</td>
                  <td className="lg:px-4 py-2 text-center">{employ.email}</td>
                  <td className="lg:px-4 py-2 text-center">{employ.phone}</td>
                  <td className="lg:px-4 py-2 text-center">{employ.address}</td>
                  <td className="lg:px-4 py-2 text-center">
                    {employ.birthdate}
                  </td>
                  <td className="lg:px-4 py-2 text-center">{employ.gender}</td>
                  <td className="lg:px-4 py-2 text-center">
                    {employ.employeeId}
                  </td>

                  <td className="lg:px-4 py-2 text-center">
                    <div className="flex justify-center">
                      <FaEye
                        onClick={() =>
                          navigate(`/admin/staff/detail/${usr._id}`)
                        }
                        className="text-2xl text-sky-600 BiSolidEdit hover:text-sky-900"
                      />
                      <BiSolidEdit
                        className="text-2xl mx-2 text-[#5e54cd] BiSolidEdit hover:text-[#2c285f]"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/staff/edit/${usr._id}`);
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
