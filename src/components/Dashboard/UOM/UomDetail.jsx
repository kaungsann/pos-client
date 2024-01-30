import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { removeData } from "../../../redux/actions";
import { Icon } from "@iconify/react";
import { getApi } from "../../Api";
import { Spinner } from "@nextui-org/react";

export default function UomDetail() {
  const { id } = useParams();

  const [detail, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = useSelector((state) => state.IduniqueData);
  const dipatch = useDispatch();

  const singleOpexApi = async () => {
    setLoading(true);
    let resData = await getApi(`/uom/${id}`, token.accessToken);

    console.log("res data is ", resData);

    if (resData.message == "Session expired") {
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
            <div className="w-4/5">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl mt-8 font-bold text-slate-600">
                  Unit Of Measurement Information
                </h1>
                <Link to={`/admin/uom/edit/${detail[0].id}`}>
                  <Icon
                    icon="mdi:edit"
                    className="text-xl hover:opacity-75 text-slate-500 font-semibold"
                  />
                </Link>
              </div>

              <div className="flex mt-8 justify-between items-center">
                <div className="w-48">
                  <h4 className="text-md text-slate-500">Name</h4>
                  <h2 className="text-md text-slate-600 mt-1 font-semibold">
                    {detail[0].name ? detail[0].name.toUpperCase() : ""}
                  </h2>
                </div>
                <div className="w-48">
                  <h4 className="text-md text-slate-500">Ref-Type</h4>
                  <h2 className="text-md text-slate-600 mt-1 font-semibold">
                    {detail[0].refType ? detail[0].refType : "none"}
                  </h2>
                </div>
                <div className="w-48">
                  <h4 className="text-md text-slate-500">Ratio</h4>
                  <h2 className="text-md text-slate-600 mt-1 font-semibold">
                    {detail[0].ratio ? detail[0].ratio : 0}
                  </h2>
                </div>
                <div className="w-48">
                  <h4 className="text-md text-slate-500">Uom-Category</h4>
                  <h2 className="text-md text-slate-600 mt-1 font-semibold">
                    {detail[0].uomCatg ? detail[0].uomCatg.name : "none"}
                  </h2>
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
