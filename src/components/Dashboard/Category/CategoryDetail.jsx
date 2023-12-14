import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getApi } from "../../Api";
import { TbEdit } from "react-icons/tb";
import FadeLoader from "react-spinners/FadeLoader";
import { useDispatch, useSelector } from "react-redux";
import { removeData } from "../../../redux/actions";
import { Icon } from "@iconify/react";

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
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Link
            to="/admin/categorys/all"
            className="font-bold rounded-sm shadow-sm flex items-center text-gray-700 border-gray-500 border-2 hover:opacity-75 text-sm hover:text-white hover:bg-gray-500 px-3 py-1.5"
          >
            Back
          </Link>
        </div>
      </div>

      {detail && detail.length > 0 ? (
        <div className="container my-5">
          <h2 className="lg:text-xl font-bold my-2">Category Information</h2>
          <div className="container bg-white p-5 rounded-lg max-w-6xl">
            <div className="flex">
              <div className="ml-auto">
                <Link to={`/admin/products/edit/${id}`}>
                  <Icon icon="ep:edit" className="text-xl" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 max-w-3xl gap-10 my-10">
              <div className="container space-y-8 font-semibold text-sm">
                <div className="flex justify-between items-center">
                  <h4>Category Name</h4>
                  <h3 className="font-medium">
                    {detail[0].name ? detail[0].name.toUpperCase() : ""}
                  </h3>
                </div>

                <div className="flex justify-between items-center">
                  <h4>Created Date</h4>
                  <h3 className="font-medium">
                    {detail[0].createdAt
                      ? new Date(detail[0].createdAt).toLocaleDateString()
                      : ""}
                  </h3>
                </div>
              </div>
              <div className="container space-y-8 font-semibold text-sm">
                <div className="flex justify-between items-center">
                  <h4>Active</h4>
                  <h3 className="font-medium">
                    {" "}
                    {detail[0].active ? "Yes" : "No"}
                  </h3>
                </div>
                <div className="flex justify-between items-center">
                  <h4>Updated Date</h4>
                  <h3 className="font-medium">
                    {detail[0].updatedAt
                      ? new Date(detail[0].updatedAt).toLocaleDateString()
                      : ""}
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
