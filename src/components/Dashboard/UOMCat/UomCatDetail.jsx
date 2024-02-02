import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeData } from "../../../redux/actions";
import { Icon } from "@iconify/react";
import { Spinner } from "@nextui-org/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getApi } from "../../Api";

export default function UomCatDetail() {
  const { id } = useParams();
  const [detail, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = useSelector((state) => state.IduniqueData);
  const dispatch = useDispatch();

  const singleProducts = async () => {
    setLoading(true);

    try {
      let resData = await getApi(`/uomCategory/${id}`, token.accessToken);

      if (resData.message === "Session expired") {
        dispatch(removeData(null));
      }

      if (resData.status) {
        setLoading(false);
        setDetails(resData.data);
      } else {
        toast.error(resData.message);
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
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Link
            to="/admin/uom-category/all"
            className="font-bold rounded-sm shadow-sm flex items-center text-gray-700 border-gray-500 border-2 hover:opacity-75 text-sm hover:text-white hover:bg-gray-500 px-3 py-1.5"
          >
            Back
          </Link>
        </div>
      </div>

      {error ? (
        <div className="flex items-center justify-center mt-40 pb-10">
          <p className="text-red-500 text-xl px-4 py-2 ">Failed To Load Data</p>
        </div>
      ) : detail && detail.length > 0 ? (
        <div className="container my-5">
          <h2 className="lg:text-xl font-bold my-2">
            UOM-Category Information
          </h2>
          <div className="container bg-white p-5 rounded-lg max-w-6xl">
            <div className="flex">
              <div className="ml-auto">
                <Link to={`/admin/uom-category/edit/${id}`}>
                  <Icon icon="ep:edit" className="text-xl" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 max-w-3xl gap-10">
              <div className="container space-y-8 font-semibold text-sm">
                <div className="flex justify-between items-center">
                  <h4>Uom Category Name</h4>
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
        <div className="w-10/12 h-screen mx-auto  flex justify-center items-center">
          {loading && <Spinner size="lg" />}
        </div>
      )}
    </>
  );
}
