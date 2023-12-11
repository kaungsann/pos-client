import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { removeData } from "../../../redux/actions";
import FadeLoader from "react-spinners/FadeLoader";

import { TbEdit } from "react-icons/tb";
import { getApi } from "../../Api";
import { Icon } from "@iconify/react";
import { format } from "date-fns";

export default function EmployeeDetail() {
  const { id } = useParams();

  const [detail, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = useSelector((state) => state.IduniqueData);
  const dipatch = useDispatch();

  const singleEmployeeApi = async () => {
    setLoading(true);
    let resData = await getApi(`/employee/${id}`, token.accessToken);

    console.log("res data is", resData);

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

      </div>



      {detail && detail.length > 0 ? (
        <div className="container my-5 ">
          <h2 className="lg:text-xl font-bold my-2">Employee Information</h2>
          <div className="container bg-white p-5 rounded-lg max-w-6xl ">
            <div className="flex">

              <div className="ml-auto">
                <Link
                  to={`/admin/employee/edit/${id}`}
                >
                  <Icon icon="ep:edit" className="text-xl" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 max-w-3xl gap-10 my-10 ">
              <div className="container space-y-8 font-semibold text-sm">
                <div className="flex justify-between items-center">
                  <h4>Name</h4>
                  <h3 className="font-medium">
                    {detail[0].name ? detail[0].name.toUpperCase() : ""}
                  </h3>
                </div>
                <div className="flex justify-between items-center">
                  <h4>Staff Email</h4>
                  <h3 className="font-medium">
                    {detail[0].email ? detail[0].email : ""}
                  </h3>
                </div>
                <div className="flex justify-between items-center">
                  <h4>Phone</h4>
                  <h3 className="font-medium">
                    {detail[0].phone
                      ? detail[0].phone
                      : "This user need to add phone"}
                  </h3>
                </div>
                <div className="flex justify-between items-center">
                  <h4>Birthday</h4>
                  <h3 className="font-medium">
                    {detail[0].birthdate
                      ? format(new Date(detail[0].birthdate), "yyyy-MM-dd")
                      : "This user need to add birthday"}
                  </h3>
                </div>
                <div className="flex justify-between items-center">
                  <h4>Address</h4>
                  <h3 className="font-medium">
                    {detail[0].address
                      ? detail[0].address
                      : "This user need to add address"}                  </h3>
                </div>
              </div>
              <div className="container space-y-8 font-semibold text-sm">
                <div className="flex justify-between items-center">
                  <h4>City</h4>
                  <h3 className="font-medium"> {detail[0].city
                    ? detail[0].city
                    : "This user need to add city"}</h3>
                </div>
                <div className="flex justify-between items-center">
                  <h4>Gender</h4>

                  <h3 className="font-medium ">
                    {detail[0].gender
                      ? detail[0].gender
                      : "This user need to add city"}</h3>
                </div>



              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center mt-40">
          {loading && (
            <FadeLoader
              color={"#0284c7"}
              loading={loading}
              size={20}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          )}
        </div>
      )}
    </>
  );
}