import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { removeData } from "../../../redux/actions";
import { TbEdit } from "react-icons/tb";
import { getApi } from "../../Api";
import { Icon } from "@iconify/react";

export default function EmployeeDetail() {
  const { id } = useParams();

  const [detail, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = useSelector((state) => state.IduniqueData);
  const dipatch = useDispatch();

  const singleEmployeeApi = async () => {
    setLoading(true);
    let resData = await getApi(`/employee/${id}`, token.accessToken);

    console.log("res data is" , resData)

    if (resData.message == "Token Expire , Please Login Again") {
      dipatch(removeData(null));
    }
    if (resData.status) {
      setDetails(resData.data);
    }
  };

  useEffect(() => {
    singleEmployeeApi();
  }, []);
  return (
    <>
      <div className="flex justify-between items-center cursor-pointer">
        <Link to="/admin/employee/all">
          <button className="hover:opacity-75 lg:px-8 md:px-4 py-2 text-white bg-blue-600 rounded-sm shadow-md border-2 border-blue-600 hover:opacity-75text-white">
            Back
          </button>
        </Link>
        <Link to={`/admin/employee/edit/${id}`}>
          <TbEdit className="text-4xl font-bold text-blue-700 hover:text-slate-700" />
        </Link>
      </div>

      <h2 className="py-1.5 text-lg text-start font-bold mt-2 bg-blue-600 text-white pl-4">
        Employee Information
      </h2>

     {detail.length > 0 && (
        <>
          <div className="flex justify-between">
            <div className="w-2/4">
              <div className="flex justify-between my-3 items-center">
                <h4 className="font-bold text-lg text-slate-500">Employee Id</h4>
                <h3 className="font-bold text-lg text-slate-600 w-3/5 mr-20 pl-3 py-2 rounded-md bg-slate-100">
                  {detail[0].employeeId}
                </h3>
              </div>
              <div className="flex justify-between my-3 items-center">
                <h4 className="font-bold text-lg text-slate-500">Name</h4>
                <h3 className="font-bold text-lg text-slate-600 w-3/5 mr-20 pl-3 py-2 rounded-md bg-slate-100">
                  {detail[0].name}
                </h3>
              </div>
              <div className="flex justify-between my-3 items-center">
                <h4 className="font-bold text-lg text-slate-500">
                  Staff Email
                </h4>
                <h3 className="font-bold text-lg text-blue-600 w-3/5 mr-20 pl-3 py-2 rounded-md bg-slate-100 ">
                  {detail[0].email}
                </h3>
              </div>
              <div className="flex justify-between my-3 items-center">
                <h4 className="font-bold text-lg text-slate-500">Phone</h4>
                <h3
                  className={`font-bold text-lg w-3/5 mr-20 pl-3 py-2 rounded-md bg-slate-100 ${
                    detail[0].phone ? "text-slate-600" : "text-red-400"
                  }`}
                >
                  {detail[0].phone
                    ? detail[0].phone
                    : "This user need to add phone"}
                </h3>
              </div>
            </div>
            <div className="w-2/4 justify-between">
              <div className="flex justify-between my-3">
                <h4 className="font-bold text-lg text-slate-500">Birthday</h4>
                <h3
                  className={`font-bold text-lg w-3/5 mr-20 pl-3 py-2 rounded-md bg-slate-100 ${
                    detail[0].birthdate ? "text-slate-600" : "text-red-400"
                  }`}
                >
                  {detail[0].birthdate
                    ? detail[0].birthdate
                    : "This user need to add birthday"}
                </h3>
              </div>
              <div className="flex justify-between my-3">
                <h4 className="font-bold text-lg text-slate-500">Address</h4>
                <h3
                  className={`font-bold text-lg w-3/5 mr-20 pl-3 py-2 rounded-md bg-slate-100 ${
                    detail[0].address ? "text-slate-600" : "text-red-400"
                  }`}
                >
                  {detail[0].address
                    ? detail[0].address
                    : "This user need to add address"}
                </h3>
              </div>
              <div className="flex justify-between my-3">
                <h4 className="font-bold text-lg text-slate-500">City</h4>
                <h3
                  className={`font-bold text-lg w-3/5 mr-20 pl-3 py-2 rounded-md bg-slate-100 ${
                    detail[0].city ? "text-slate-600" : "text-red-400"
                  }`}
                >
                  {detail[0].city
                    ? detail[0].city
                    : "This user need to add city"}
                </h3>
              </div>
              <div className="flex justify-between my-3">
                <h4 className="font-bold text-lg text-slate-500">Gender</h4>
                <h3
                  className={`font-bold text-lg w-3/5 mr-20 pl-3 py-2 rounded-md bg-slate-100 ${
                    detail[0].gender ? "text-slate-600" : "text-red-400"
                  }`}
                >
                  {detail[0].gender
                    ? detail[0].gender
                    : "This user need to add city"}
                </h3>
              </div>
            </div>
          </div>
        </>
      )} 
    </>
  );
}
