import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { removeData } from "../../../redux/actions";
import { getApi } from "../../Api";
import { format } from "date-fns";
import { Spinner } from "@nextui-org/react";

export default function OpexDetail() {
  const { id } = useParams();

  const [detail, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = useSelector((state) => state.IduniqueData);
  const dipatch = useDispatch();

  const singleOpexApi = async () => {
    setLoading(true);
    let resData = await getApi(`/opex/${id}`, token.accessToken);

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
      {detail && detail.length > 0 ? (
        <div className="container cursor-pointer">
          <div className="container bg-white p-5 rounded-md max-w-6xl">
            <div className="flex gap-2 pb-4">
              <Link
                to="/admin/opex/all"
                className="font-bold rounded-sm shadow-sm flex items-center text-gray-700 border-gray-500 border-2 hover:opacity-75 text-sm hover:text-white hover:bg-gray-500 px-3 py-1.5"
              >
                Back
              </Link>
            </div>
            <div>
              <div className="flex">
                <h1 className="text-2xl font-bold text-slate-600">
                  Opex Information
                </h1>
              </div>

              <div className="my-4 flex p-4 items-center w-4/5 border-b-2">
                <div className="flex justify-between w-full">
                  <div>
                    <div>
                      <h4 className="text-md text-slate-500">Name</h4>
                      <h2 className="text-md text-slate-600 mt-1 font-semibold">
                        {detail[0].name ? detail[0].name.toUpperCase() : ""}
                      </h2>
                    </div>
                    <div className="my-6">
                      <h4 className="text-md text-slate-500">Remark</h4>
                      <h2 className="text-md text-slate-600 mt-1 font-semibold">
                        {detail[0].remark ? detail[0].remark : "none"}
                      </h2>
                    </div>
                  </div>
                  <div>
                    <div>
                      <h4 className="text-md text-slate-500">Date</h4>
                      <h2 className="text-md text-slate-600 mt-1 font-semibold">
                        {detail[0].date
                          ? format(new Date(detail[0].date), "yyyy-MM-dd")
                          : "none"}
                      </h2>
                    </div>
                    <div className="my-6">
                      <h4 className="text-md text-slate-500">Amount</h4>
                      <h2 className="text-md text-slate-600 mt-1 font-semibold">
                        {detail[0].amount ? detail[0].amount : "none"}
                      </h2>
                    </div>
                  </div>
                  <div>
                    <div>
                      <h4 className="text-md text-slate-500">State</h4>
                      <h2
                        className={`font-semibold text-md mt-1 ${
                          detail[0].state == "rejected"
                            ? " bg-orange-50 text-orange-700 px-6"
                            : detail[0].state == "pending"
                            ? "bg-cyan-50 text-cyan-600 px-6"
                            : detail[0].state == "approved"
                            ? "bg-green-50 text-green-700 px-4"
                            : ""
                        }`}
                      >
                        {detail[0].state}
                      </h2>
                    </div>
                    <div className="my-6">
                      <h4 className="text-md text-slate-500">Created-Date</h4>
                      <h2 className="text-md text-slate-600 mt-1 font-semibold">
                        {detail[0].createdAt
                          ? format(new Date(detail[0].createdAt), "yyyy-MM-dd")
                          : "none"}
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-10/12 h-screen mx-auto  flex justify-center items-center">
          {loading && <Spinner size="lg" />}
        </div>
      )}
    </>
  );
}
