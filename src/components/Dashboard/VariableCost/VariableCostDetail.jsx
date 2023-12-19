import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { removeData } from "../../../redux/actions";
import FadeLoader from "react-spinners/FadeLoader";

import { getApi } from "../../Api";
import { Icon } from "@iconify/react";
import { format } from "date-fns";

export default function VariableCostDetail() {
  const { id } = useParams();

  const [detail, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = useSelector((state) => state.IduniqueData);
  const dipatch = useDispatch();

  const singleOpexApi = async () => {
    setLoading(true);
    let resData = await getApi(`/variable-cost/${id}`, token.accessToken);

    if (resData.message == "Token Expire , Please Login Again") {
      dipatch(removeData(null));
    }
    if (resData.status) {
      setDetails(resData.data);
    }
  };

  useEffect(() => {
    singleOpexApi();
  }, []);
  return (
    <>
      <div className="flex justify-between items-center cursor-pointer">
        <Link
          to="/admin/variable-cost/all"
          className="font-bold rounded-sm shadow-sm flex items-center text-gray-700 border-gray-500 border-2 hover:opacity-75 text-sm hover:text-white hover:bg-gray-500 px-3 py-1.5"
        >
          Back
        </Link>
      </div>

      {detail && detail.length > 0 ? (
        <div className="container">
          <h2 className="lg:text-xl font-bold my-4">
            Variable-Cost Information
          </h2>
          <div className="container bg-white p-5 rounded-lg max-w-6xl ">
            <div className="grid grid-cols-2 max-w-3xl gap-10">
              <div className="container space-y-8 font-semibold text-sm">
                <div className="flex justify-between items-center">
                  <h4>Name</h4>
                  <h3 className="font-medium">
                    {detail[0].name ? detail[0].name.toUpperCase() : ""}
                  </h3>
                </div>
                <div className="flex justify-between items-center">
                  <h4>Remark</h4>
                  <h3 className="font-medium">
                    {detail[0].remark ? detail[0].remark : "none"}
                  </h3>
                </div>
                <div className="flex justify-between items-center">
                  <h4>Date</h4>
                  <h3 className="font-medium">
                    {detail[0].date
                      ? format(new Date(detail[0].date), "yyyy-MM-dd")
                      : "none"}
                  </h3>
                </div>
                <div className="flex justify-between items-center">
                  <h4>Amount</h4>
                  <h3 className="font-medium">
                    {detail[0].amount ? detail[0].amount : "none"}
                  </h3>
                </div>
                <div className="flex justify-between items-center">
                  <h4>State</h4>
                  <h3
                    className={`rounded-xl py-2 text-sm ${
                      detail[0].state == "rejected"
                        ? " bg-orange-50 text-orange-700 px-6"
                        : detail[0].state == "pending"
                        ? "bg-cyan-50 text-cyan-600 px-6"
                        : detail[0].state == "approved"
                        ? "bg-green-50 text-green-700 px-4"
                        : ""
                    }`}
                  >
                    {detail[0].state ? detail[0].state : "none"}
                  </h3>
                </div>
              </div>
              <div className="container space-y-8 font-semibold text-sm">
                <div className="flex justify-between items-center">
                  <h4>Created-Date</h4>
                  <h3 className="font-medium">
                    {detail[0].createdAt
                      ? format(new Date(detail[0].createdAt), "yyyy-MM-dd")
                      : "none"}
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
