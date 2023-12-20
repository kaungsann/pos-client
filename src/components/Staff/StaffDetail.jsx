import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { removeData } from "../../redux/actions";
import { TbEdit } from "react-icons/tb";
import { getApi } from "../Api";
import { Icon } from "@iconify/react";
import { format } from "date-fns";
import FadeLoader from "react-spinners/FadeLoader";

export default function StaffDetail() {
  const { id } = useParams();

  const [detail, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = useSelector((state) => state.IduniqueData);
  const dipatch = useDispatch();

  const singleUserApi = async () => {
    setLoading(true);
    let resData = await getApi(`/user/${id}`, token.accessToken);

    console.log("res data staf user is ", resData);

    if (resData.message == "Token Expire , Please Login Again") {
      dipatch(removeData(null));
    }
    if (resData.status) {
      setDetails(resData.data);
    }
  };

  useEffect(() => {
    singleUserApi();
  }, []);
  return (
    <>
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Link
            to="/admin/user/all"
            className="font-bold rounded-sm shadow-sm flex items-center text-gray-700 border-gray-500 border-2 hover:opacity-75 text-sm hover:text-white hover:bg-gray-500 px-3 py-1.5"
          >
            Back
          </Link>
        </div>
      </div>

      {detail && detail.length > 0 ? (
        <div className="container my-5">
          <h2 className="lg:text-xl font-bold my-2">Staff Information</h2>
          <div className="container bg-white p-5 rounded-lg max-w-6xl">
            <div className="flex">
              <div className="w-40 h-36 my-3">
                {detail[0].image ? (
                  <img src={detail[0].image} className="w-full h-full" />
                ) : (
                  <Icon
                    icon="fluent:image-off-48-regular"
                    className="w-full h-full text-slate-400"
                  />
                )}
              </div>
              <div className="ml-auto">
                <Link to={`/admin/user/edit/${id}`}>
                  <Icon icon="ep:edit" className="text-xl" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 max-w-3xl gap-10">
              <div className="container space-y-8 font-semibold text-sm">
                <div className="flex justify-between items-center">
                  <h4>Role</h4>
                  <h3 className="font-medium">
                    {detail[0].role ? detail[0].role.name : "]None"}
                  </h3>
                </div>
                <div className="flex justify-between items-center">
                  <h4>Name</h4>
                  <h3 className="font-medium">{detail[0].username}</h3>
                </div>
                <div className="flex justify-between items-center">
                  <h4>Address</h4>
                  <h3 className="font-medium">
                    {detail[0].address
                      ? detail[0].address
                      : "This user need to add address"}
                  </h3>
                </div>
                <div className="flex justify-between items-center">
                  <h4>Gender</h4>
                  <h3 className="font-medium">
                    {detail[0].gender
                      ? detail[0].gender
                      : "This user need to add Gender"}
                  </h3>
                </div>
              </div>
              <div className="container space-y-8 font-semibold text-sm">
                <div className="flex justify-between items-center">
                  <h4>Email</h4>
                  <h3 className="font-medium">{detail[0].email}</h3>
                </div>
                <div className="flex justify-between items-center">
                  <h4>DOB</h4>
                  <h3 className="font-medium">
                    {detail[0].birthdate
                      ? new Date(detail[0].birthdate).toLocaleDateString()
                      : "This user needs to add DoB"}
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
