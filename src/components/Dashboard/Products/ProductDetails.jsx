import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getApi } from "../../Api";
import BoxImg from "../../../assets/box.png";
import FadeLoader from "react-spinners/FadeLoader";
import { useReactToPrint } from "react-to-print";
import Barcode from "react-barcode";
import { Icon } from "@iconify/react";
import { useDispatch, useSelector } from "react-redux";
import { removeData } from "../../../redux/actions";

export default function ProductDetails() {
  const { id } = useParams();
  const [detail, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const componentRef = useRef();
  const dipatch = useDispatch();

  const token = useSelector((state) => state.IduniqueData);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const singleProducts = async () => {
    setLoading(true);
    const response = await getApi(`/product/${id}`, token.accessToken);
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
    singleProducts();
  }, []);
  
  return (
    <>
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Link
            to="/admin/products/all"
            className="font-bold rounded-sm shadow-sm flex items-center text-gray-700 border-gray-500 border-2 hover:opacity-75 text-sm hover:text-white hover:bg-gray-500 px-3 py-1.5"
          >
            Back
          </Link>
          <button
            onClick={handlePrint}
            className="rounded-sm shadow-sm flex items-center  text-[#15803d] border-[#15803d] bg-white border-2 hover:opacity-75 text-sm hover:text-white hover:bg-green-700 font-bold px-3 py-1.5"
          >
            Print Barcode
          </button>
        </div>
      </div>

      {detail && detail.length > 0 ? (
        <div className="container my-5">
          <h2 className="lg:text-xl font-bold my-2">Product Information</h2>
          <div className="container bg-white p-5 rounded-lg max-w-6xl">
            <div className="flex">
              <img
                src={detail[0]?.image ? detail[0]?.image : BoxImg}
                className="w-42 h-36 my-4 rounded-md shadow-md"
              />
              <div className="mx-8" ref={componentRef}>
                <h2>{detail[0].name ? detail[0].name.toUpperCase() : ""}</h2>
                <Barcode value={detail[0].barcode} />
              </div>
              <div className="ml-auto">
                <Link
                  to={`/admin/products/edit/${id}`}
                >
                  <Icon icon="ep:edit" className="text-xl" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 max-w-3xl gap-10 my-10">
              <div className="container space-y-8 font-semibold text-sm">
                <div className="flex justify-between items-center">
                  <h4>Name</h4>
                  <h3 className="font-medium">
                    {detail[0].name ? detail[0].name.toUpperCase() : ""}
                  </h3>
                </div>
                <div className="flex justify-between items-center">
                  <h4>Category</h4>
                  <h3 className="font-medium">
                    {detail[0].category ? detail[0].category.name : ""}
                  </h3>
                </div>
                <div className="flex justify-between items-center">
                  <h4>Expired Date</h4>
                  <h3 className="font-medium">
                    {detail[0].expiredAt
                      ? new Date(detail[0].expiredAt).toLocaleDateString()
                      : ""}
                  </h3>
                </div>
                <div className="flex justify-between items-center">
                  <h4>Min-Stock Qty</h4>
                  <h3 className="font-medium">{detail[0].minStockQty}</h3>
                </div>
                <div className="flex justify-between items-center">
                  <h4>Description</h4>
                  <h3 className="font-medium">
                    {detail[0].description ? detail[0].description : ""}
                  </h3>
                </div>
              </div>
              <div className="container space-y-8 font-semibold text-sm">
                <div className="flex justify-between items-center">
                  <h4>Price</h4>
                  <h3 className="font-medium">{detail[0].salePrice}</h3>
                </div>
                <div className="flex justify-between items-center">
                  <h4>Tax</h4>
                  <h3 className="font-medium">{detail[0].tax}</h3>
                </div>

                <div className="flex justify-between items-center">
                  <h4>Product Ref</h4>
                  <h3 className="font-medium">
                    {detail[0].ref ? detail[0].tax : ""}
                  </h3>
                </div>
                <div className="flex justify-between items-center">
                  <h4>BarCode</h4>
                  <h3 className="font-medium">{detail[0].barcode}</h3>
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
