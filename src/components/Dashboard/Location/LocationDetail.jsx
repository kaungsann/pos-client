import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getApi } from "../../Api";
import { TbEdit } from "react-icons/tb";
import FadeLoader from "react-spinners/FadeLoader";
import { useDispatch, useSelector } from "react-redux";
import { removeData } from "../../../redux/actions";

export default function LocationDetail() {
  const { id } = useParams();
  const [detail, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.IduniqueData);
  const dipatch = useDispatch();

  const singlecategory = async () => {
    setLoading(true);
    let response = await getApi(`/location/${id}`, token.accessToken);
    if (response.message == "Token Expire , Please Login Again") {
      dipatch(removeData(null));
    }
    if (response.status) {
      setLoading(false);
      setDetails(response.data);
    } else {
      setLoading(true);
    }
  };

  useEffect(() => {
    singlecategory();
  }, []);
  return (
    <>
      <div className="flex justify-between">
        <Link to="/admin/locations/all">
          <button className="hover:opacity-75 lg:px-8 md:px-4 py-2  text-white bg-blue-600 rounded-md shadow-md border-2 border-blue-600 hover:opacity-75text-white">
            Back
          </button>
        </Link>
        <Link to={`/admin/locations/edit/${id}`}>
          <TbEdit className="text-4xl font-bold text-blue-700 hover:text-slate-700" />
        </Link>
      </div>
      <h2 className="py-1.5 text-lg font-bold mt-6 bg-blue-600 text-white pl-4">
        Location Details
      </h2>

      <div className="relative w-full">
        {detail && detail.length > 0 ? (
          <div className="flex justify-between">
            <div className="w-2/4">
              <div className="flex justify-between my-3">
                <h4 className="font-bold text-lg text-slate-500">Location</h4>
                <h3 className="font-bold text-lg text-blue-600 w-2/5 mr-20 pl-3 py-2 rounded-md bg-slate-100 ">
                  {detail[0].name}
                </h3>
              </div>
              <div className="flex justify-between my-3">
                <h4 className="font-bold text-lg text-slate-500">Is Have?</h4>
                <h3 className="font-bold text-lg text-blue-600 w-2/5 mr-20 pl-3 py-2 rounded-md bg-slate-100 ">
                  {detail[0].active ? "YES" : "NO"}
                </h3>
              </div>
            </div>

            <div className="w-2/4 justify-between">
              <div className="flex justify-between my-3">
                <h4 className="font-bold text-lg text-slate-500">
                  Created Date
                </h4>
                <h3 className="font-bold text-lg text-slate-600 w-2/5 mr-20 pl-3 py-2 rounded-md bg-slate-100 ">
                  {new Date(detail[0].createdAt).toLocaleDateString("en-US")}
                </h3>
              </div>

              <div className="flex justify-between my-3">
                <h4 className="font-bold text-lg text-slate-500">
                  Update Date
                </h4>
                <h3 className="font-bold text-lg text-slate-600 w-2/5 mr-20 pl-3 py-2 rounded-md bg-slate-100 ">
                  {new Date(detail[0].updatedAt).toLocaleDateString("en-US")}
                </h3>
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
      </div>
    </>
  );
}
