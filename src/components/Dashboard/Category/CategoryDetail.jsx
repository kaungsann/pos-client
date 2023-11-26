import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getApi } from "../../Api";
import { TbEdit } from "react-icons/tb";
import FadeLoader from "react-spinners/FadeLoader";
import { useDispatch, useSelector } from "react-redux";
import { removeData } from "../../../redux/actions";

export default function CategoryDetail() {
  const { id } = useParams();
  const [detail, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = useSelector((state) => state.IduniqueData);
  const dipatch = useDispatch();

  const singleProducts = async () => {
    setLoading(true);
    let resData = await getApi(`/category/${id}`, token.accessToken);
    if (resData.message == "Token Expire , Please Login Again") {
      dipatch(removeData(null));
    }
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
      <div className="flex justify-between items-center cursor-pointer">
        <Link to="/admin/categorys/all">
          <button className="hover:opacity-75 lg:px-8 md:px-4 py-2 text-white bg-blue-600 rounded-sm shadow-md border-2 border-blue-600 hover:opacity-75text-white">
            Back
          </button>
        </Link>
        <Link to={`/admin/categorys/edit/${id}`}>
          <TbEdit className="text-4xl font-bold text-blue-700 hover:text-slate-700" />
        </Link>
      </div>

      {detail ? (
        <div className="text-center">
          {detail && detail.length > 0 ? (
            <div className="w-full">
              <h2 className="py-1.5 text-lg text-start font-bold mt-2 bg-blue-600 text-white pl-4">
                Category Information
              </h2>
              <div className="flex justify-between">
                <div className="w-2/4">
                  <div className="flex justify-between my-3">
                    <h4 className="font-bold text-lg text-slate-500">
                      Category Name
                    </h4>
                    <h3 className="font-bold text-lg text-slate-600 w-3/5 mr-20 pl-3 py-2 rounded-md bg-slate-100">
                      {detail[0].name}
                    </h3>
                  </div>
                  <div className="flex justify-between my-3">
                    <h4 className="font-bold text-lg text-slate-500">
                      Created Date
                    </h4>
                    <h3 className="font-bold text-lg text-blue-600 w-3/5 mr-20 pl-3 py-2 rounded-md bg-slate-100 ">
                      {new Date(detail[0].createdAt).toLocaleDateString(
                        "en-US"
                      )}
                    </h3>
                  </div>
                </div>

                <div className="w-2/4 justify-between">
                  <div className="flex justify-between my-3">
                    <h4 className="font-bold text-lg text-slate-500">
                      Updated Date
                    </h4>
                    <h3 className="font-bold text-lg text-slate-600 w-3/5 mr-20 pl-3 py-2 rounded-md bg-slate-100 ">
                      {new Date(detail[0].updatedAt).toLocaleDateString(
                        "en-US"
                      )}
                    </h3>
                  </div>
                  <div className="flex justify-between my-3">
                    <h4 className="font-bold text-lg text-slate-500">Active</h4>
                    <h3 className="font-bold text-lg text-slate-600 w-3/5 mr-20 pl-3 py-2 rounded-md bg-slate-100 ">
                      {detail[0].active ? "Yes" : "No"}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>Loading...</div>
          )}
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
