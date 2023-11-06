import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getApi } from "../../Api";
import { TbEdit } from "react-icons/tb";
import FadeLoader from "react-spinners/FadeLoader";

export default function PartnerDetail() {
  const { id } = useParams();
  const [detail, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const singleProducts = async () => {
    setLoading(true);
    let resData = await getApi(`/partner/${id}`);
    if (resData.status) {
      setLoading(false);
      setDetails(resData.data);
    } else {
      setLoading(true);
    }
  };

  useEffect(() => {
    singleProducts();
  }, []);

  return (
    <>
      <div className="flex justify-between">
        <Link to="/admin/partners/all">
          <button className="hover:opacity-75 lg:px-8 md:px-4 py-2  text-white bg-blue-600 rounded-md shadow-md border-2 border-blue-600 hover:opacity-75text-white">
            Back
          </button>
        </Link>
        <Link to={`/admin/partners/edit/${id}`}>
          <TbEdit className="text-4xl font-bold text-blue-700 hover:text-slate-700" />
        </Link>
      </div>

      <h2 className="py-1.5 text-lg font-bold mt-6 bg-blue-600 text-white pl-4">
        Partner Information
      </h2>

      {detail && detail.length > 0 ? (
        <div className="flex justify-between">
          <div className="w-2/4">
            <div className="flex justify-between my-3">
              <h4 className="font-bold text-lg text-slate-500">Date</h4>
              <h3 className="font-bold text-lg text-slate-600 w-2/5 mr-20 pl-3 py-2 rounded-md bg-slate-100">
                {new Date(detail[0].createdAt).toLocaleDateString("en-US")}
              </h3>
            </div>
            <div className="flex justify-between my-3">
              <h4 className="font-bold text-lg text-slate-500">Parnter Name</h4>
              <h3 className="font-bold text-lg text-blue-600 w-2/5 mr-20 pl-3 py-2 rounded-md bg-slate-100 ">
                {detail[0].name}
              </h3>
            </div>
            <div className="flex justify-between my-3">
              <h4 className="font-bold text-lg text-slate-500">City</h4>
              <h3 className="font-bold text-lg text-slate-600 w-2/5 mr-20 pl-3 py-2 rounded-md bg-slate-100 ">
                {detail[0].city}
              </h3>
            </div>
          </div>
          <div className="w-2/4 justify-between">
            <div className="flex justify-between my-3">
              <h4 className="font-bold text-lg text-slate-500">Address</h4>
              <h3 className="font-bold text-lg text-slate-600 w-2/5 mr-20 pl-3 py-2 rounded-md bg-slate-100 ">
                {detail[0].address}
              </h3>
            </div>
            <div className="flex justify-between my-3">
              <h4 className="font-bold text-lg text-slate-500">
                Is Customer ?
              </h4>
              <h3 className="font-bold text-lg text-blue-600 w-2/5 mr-20 pl-3 py-2 rounded-md bg-slate-100 ">
                {detail[0].isCustomer ? "YES" : "NO"}
              </h3>
            </div>
            <div className="flex justify-between my-3">
              <h4 className="font-bold text-lg text-slate-500">Is Company ?</h4>
              <h3 className="font-bold text-lg text-blue-600 w-2/5 mr-20 pl-3 py-2 rounded-md bg-slate-100 ">
                {detail[0].isCompany ? "YES" : "NO"}
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
    </>
  );
}
