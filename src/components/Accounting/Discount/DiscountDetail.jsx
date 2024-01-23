import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { removeData } from "../../../redux/actions";
import { Icon } from "@iconify/react";
import { getApi } from "../../Api";
import { Spinner } from "@nextui-org/react";

export default function DiscountDetail() {
  const { id } = useParams();

  const [detail, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = useSelector((state) => state.IduniqueData);
  const dipatch = useDispatch();

  const singleOpexApi = async () => {
    setLoading(true);
    let resData = await getApi(`/discount/${id}`, token.accessToken);

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
                to="/admin/discount/all"
                className="font-bold rounded-sm shadow-sm flex items-center text-gray-700 border-gray-500 border-2 hover:opacity-75 text-sm hover:text-white hover:bg-gray-500 px-3 py-1.5"
              >
                Back
              </Link>
            </div>
            <div className="w-3/5">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl mt-8 font-bold text-slate-600">
                  Discount Information
                </h1>
                <Link to={`/admin/discount/edit/${detail[0].id}`}>
                  <Icon
                    icon="mdi:edit"
                    className="text-xl hover:opacity-75 text-slate-500 font-semibold"
                  />
                </Link>
              </div>

              <div className="my-4 flex p-4 items-center border-b-2">
                <div className="flex  w-full">
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <h4 className="text-md text-slate-500">Name</h4>
                      <h2 className="text-md text-slate-600 mt-1 font-semibold">
                        {detail[0].name ? detail[0].name.toUpperCase() : ""}
                      </h2>
                    </div>
                    <div className="my-6">
                      <h4 className="text-md text-slate-500">Remark</h4>
                      <h2 className="text-md text-slate-600 mt-1 font-semibold">
                        {detail[0].amount ? detail[0].amount : "none"}
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
