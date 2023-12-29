import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getApi } from "../../Api";
import FadeLoader from "react-spinners/FadeLoader";
import { useDispatch, useSelector } from "react-redux";
import { removeData } from "../../../redux/actions";
import { Icon } from "@iconify/react";
import { format } from "date-fns";

export default function PartnerDetail() {
  const { id } = useParams();
  const [detail, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = useSelector((state) => state.IduniqueData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const singleProducts = async () => {
    setLoading(true);

    try {
      let resData = await getApi(`/partner/${id}`, token.accessToken);

      if (resData.message === "Token Expire , Please Login Again") {
        dispatch(removeData(null));
      }

      if (resData.status) {
        setLoading(false);
        setDetails(resData.data);
      } else {
        throw new Error("Data not found");
      }
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    singleProducts();
  }, []);

  return (
    <>
      {error ? (
        <div className="flex items-center justify-center mt-40 pb-10">
          <p className="text-red-500 text-xl px-4 py-2 ">Failed To Load Data</p>
        </div>
      ) : detail && detail.length > 0 ? (
        <div className="container cursor-pointer">
          <div className="container bg-white p-5 rounded-md max-w-6xl">
              <div className="flex gap-2 pb-4">
                <Link
                  to="/admin/partners/all"
                  className="font-bold rounded-sm shadow-sm flex items-center text-gray-700 border-gray-500 border-2 hover:opacity-75 text-sm hover:text-white hover:bg-gray-500 px-3 py-1.5"
                >
                  Back
                </Link>
              </div>
            <div>
              <div className="flex">
                <div className="flex">
                  <h1 className="text-3xl font-bold text-slate-600">
                    {detail[0].name ? detail[0].name.toUpperCase() : ""}
                  </h1>
                  <span className="mx-6 bg-[#E7F9F2] text-[#38CC97]  px-4 rounded-sm py-1.5">
                    {detail[0].active ? "Active" : "noActive"}
                  </span>
                </div>
              </div>
              <div className="my-6 flex justify-between items-center w-4/5">
                <h1 className="text-xl font-bold text-slate-600">
                  Personal Data
                </h1>

                <Icon
                  icon="mdi:edit"
                  className="text-slate-500 text-2xl hover:opacity-70"
                  onClick={() => navigate(`/admin/partners/edit/${id}`)}
                />
              </div>
              <div className="mb-4 flex p-4 items-center w-4/5">
                <div className="flex justify-between w-full">
                  <div>
                    <div>
                      <h4 className="text-md text-slate-500">Full Name</h4>
                      <h2 className="text-md text-slate-600 mt-1 font-semibold">
                        {detail[0].name ? detail[0].name.toUpperCase() : ""}
                      </h2>
                    </div>
                    <div className="my-6">
                      <h4 className="text-md text-slate-500">Email</h4>
                      <h2 className="text-md text-slate-600 mt-1 font-semibold">
                        {detail[0].email ? detail[0].email : "None"}
                      </h2>
                    </div>
                    <div>
                      <h4 className="text-md text-slate-500">Phone</h4>
                      <h2 className="text-md text-slate-600 mt-1 font-semibold">
                        {detail[0].phone ? detail[0].phone : "None"}
                      </h2>
                    </div>
                  </div>
                  <div>
                    <div>
                      <h4 className="text-md text-slate-500">Code</h4>
                      <h2 className="text-md text-slate-600 mt-1 font-semibold">
                        {detail[0].code ? detail[0].code : "None"}
                      </h2>
                    </div>
                    <div className="my-6">
                      <h4 className="text-md text-slate-500">Joining Date</h4>
                      <h2 className="text-md text-slate-600 mt-1 font-semibold">
                        {detail[0].createdAt
                          ? format(new Date(detail[0].createdAt), "yyyy-MM-dd")
                          : "None"}
                      </h2>
                    </div>
                    <div>
                      <h4 className="text-md text-slate-500">Address</h4>
                      <h2 className="text-md text-slate-600 mt-1 font-semibold">
                        {detail[0].address ? detail[0].address : "None"}
                      </h2>
                    </div>
                  </div>
                  <div>
                    <div>
                      <h4 className="text-md text-slate-500">City</h4>
                      <h2 className="text-md text-slate-600 mt-1 font-semibold">
                        {detail[0].city ? detail[0].city : "None"}
                      </h2>
                    </div>

                    <div className="my-6">
                      <h4 className="text-md text-slate-500">Customer</h4>
                      <h2
                        className={`text-md mt-1 font-semibold ${
                          detail[0].isCustomer
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {detail[0].isCustomer ? "YES" : "NO"}
                      </h2>
                    </div>

                    <div>
                      <h4 className="text-md text-slate-500">Company</h4>
                      <h2
                        className={`text-md mt-1 font-semibold ${
                          detail[0].isCompany
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {detail[0].isCompany ? "YES" : "NO"}
                      </h2>
                    </div>
                  </div>
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
