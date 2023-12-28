import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { removeData } from "../../redux/actions";
import { TbEdit } from "react-icons/tb";
import { getApi } from "../Api";
import { Icon } from "@iconify/react";
import { format } from "date-fns";
import FadeLoader from "react-spinners/FadeLoader";
import user from "../../assets/icon.png";

export default function StaffDetail() {
  const { id } = useParams();

  const [detail, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = useSelector((state) => state.IduniqueData);
  const dipatch = useDispatch();
  const navigate = useNavigate();

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
      {/* <div className="flex justify-between">
        <div className="flex gap-2">
          <Link
            to="/admin/user/all"
            className="font-bold rounded-sm shadow-sm flex items-center text-gray-700 border-gray-500 border-2 hover:opacity-75 text-sm hover:text-white hover:bg-gray-500 px-3 py-1.5"
          >
            Back
          </Link>
        </div>
      </div> */}

      {detail && detail.length > 0 ? (
        <div className="container cursor-pointer">
          <div className="container bg-white p-5 rounded-md max-w-6xl">
            <Icon
              icon="cil:arrow-left"
              className="text-slate-600 font-semibold text-xl mb-3 hover:text-slate-400"
              onClick={() => navigate("/admin/user/all")}
            />
            <div>
              <div className="flex">
                <div className="flex">
                  <h1 className="text-3xl font-bold text-slate-600">
                    {detail[0].username ? detail[0].username.toUpperCase() : ""}
                  </h1>
                  <span className="mx-6 bg-[#E7F9F2] text-[#38CC97]  px-4 rounded-sm py-1.5">
                    {detail[0].active ? "Active" : "noActive"}
                  </span>
                </div>
              </div>
              <h3 className="text-md my-3 text-slate-500">POS Staff</h3>
              <div className="my-6 flex justify-between items-center w-4/5">
                <h1 className="text-xl font-bold text-slate-600">
                  Personal Data
                </h1>

                <Icon
                  icon="mdi:edit"
                  className="text-slate-500 text-2xl hover:opacity-70"
                  onClick={() => navigate(`/admin/user/edit/${id}`)}
                />
              </div>
              <div className="mb-4 flex p-4 items-center w-4/5">
                <img
                  src={detail[0].image ? detail[0].image : user}
                  className="w-48 h-52 rounded-lg shadow-md"
                />
                <div className="flex ml-8 justify-between w-full">
                  <div>
                    <div>
                      <h4 className="text-md text-slate-500">Full Name</h4>
                      <h2 className="text-md text-slate-600 mt-1 font-semibold">
                        {detail[0].username
                          ? detail[0].username.toUpperCase()
                          : ""}
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
                      <h4 className="text-md text-slate-500">Role</h4>
                      <h2 className="text-md text-slate-600 mt-1 font-semibold">
                        {detail[0].role ? detail[0].role.name : "None"}
                      </h2>
                    </div>
                    <div className="my-6">
                      <h4 className="text-md text-slate-500">Account-ID</h4>
                      <h2 className="text-md text-slate-600 mt-1 font-semibold">
                        {detail[0].accountId ? detail[0].accountId : "None"}
                      </h2>
                    </div>
                    <div>
                      <h4 className="text-md text-slate-500">Date Of Birth</h4>
                      <h2 className="text-md text-slate-600 mt-1 font-semibold">
                        {detail[0].birthdate
                          ? format(new Date(detail[0].birthdate), "yyyy-MM-dd")
                          : "None"}
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
                      <h4 className="text-md text-slate-500">Address</h4>
                      <h2 className="text-md text-slate-600 mt-1 font-semibold">
                        {detail[0].address ? detail[0].address : "None"}
                      </h2>
                    </div>

                    <div>
                      <h4 className="text-md text-slate-500">Gender</h4>
                      <h2 className="text-md text-slate-600 mt-1 font-semibold">
                        {detail[0].gender ? detail[0].gender : "None"}
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
