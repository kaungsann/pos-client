import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getApi } from "../../Api";
import { TbEdit } from "react-icons/tb";
import img from "../../../assets/user.jpeg";
import FadeLoader from "react-spinners/FadeLoader";
import { useReactToPrint } from "react-to-print";
import Barcode from "react-barcode";
import { useDispatch, useSelector } from "react-redux";

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
        <div>
          <Link to="/admin/products/all">
            <button className="hover:opacity-75 lg:px-8 md:px-4 py-2  text-white bg-blue-600 rounded-sm shadow-md border-2 border-blue-600 hover:opacity-75text-white">
              Back
            </button>
          </Link>
          <button
            onClick={handlePrint}
            className="px-8 py-2 text-white font-bold rounded-sm shadow-md ml-6 border-2 border-blue-500 bg-blue-600 hover:opacity-75"
          >
            Print Barcode
          </button>
        </div>

        <Link to={`/admin/products/edit/${id}`}>
          <TbEdit className="text-4xl font-bold text-blue-700 hover:text-slate-700" />
        </Link>
      </div>

      {detail && detail.length > 0 ? (
        <div className="w-full">
          <h2 className="py-1.5 text-lg font-bold mt-2 bg-blue-600 text-white pl-4">
            Product Information
          </h2>
          <div className="flex items-center">
            <img
              src={detail[0].image ? detail[0].image : img}
              className="w-42 h-36 my-4 rounded-md shadow-md mr-8"
            />
            <div className="mx-8" ref={componentRef}>
              <h2>{detail[0].name ? detail[0].name.toUpperCase() : ""}</h2>
              <Barcode value={detail[0].barcode} />
            </div>
          </div>

          <div className="flex justify-between">
            <div className="w-2/4">
              <div className="flex justify-between my-3">
                <h4 className="font-bold text-lg text-slate-500">
                  Product Name
                </h4>
                <h3 className="font-bold text-lg text-slate-600 w-3/5 mr-20 pl-3 py-2 rounded-md bg-slate-100">
                  {detail[0].name ? detail[0].name.toUpperCase() : ""}
                </h3>
              </div>
              <div className="flex justify-between my-3">
                <h4 className="font-bold text-lg text-slate-500">
                  Category Name
                </h4>
                <h3 className="font-bold text-lg text-blue-600 w-3/5 mr-20 pl-3 py-2 rounded-md bg-slate-100 ">
                  {detail[0].category ? detail[0].category.name : "none"}
                </h3>
              </div>
              <div className="flex justify-between my-3">
                <h4 className="font-bold text-lg text-slate-500">
                  Expiration Date
                </h4>
                <h3 className="font-bold text-lg text-slate-600 w-3/5 mr-20 pl-3 py-2 rounded-md bg-slate-100 ">
                  {new Date(detail[0].expiredAt).toLocaleDateString()}
                </h3>
              </div>
              <div className="flex justify-between my-3">
                <h4 className="font-bold text-lg text-slate-500">
                  avaliableInPos
                </h4>
                <h3 className="font-bold text-lg text-slate-600 w-3/5 mr-20 pl-3 py-2 rounded-md bg-slate-100 ">
                  {detail[0].avaliableInPos ? "Have Product" : "No have in pos"}
                </h3>
              </div>
              <div className="flex justify-between my-3">
                <h4 className="font-bold text-lg text-slate-500">
                  Stock Quantity
                </h4>
                <h3 className="font-bold text-lg text-slate-600 w-3/5 mr-20 pl-3 py-2 rounded-md bg-slate-100 ">
                  {detail[0].minStockQty}
                </h3>
              </div>
            </div>
            <div className="w-2/4 justify-between">
              <div className="flex justify-between my-3">
                <h4 className="font-bold text-lg text-slate-500">Price</h4>
                <h3 className="font-bold text-lg text-center text-slate-600 w-3/5 mr-20 pl-3 py-2 rounded-md bg-slate-100 ">
                  {detail[0].salePrice}
                </h3>
              </div>
              <div className="flex justify-between my-3">
                <h4 className="font-bold text-lg text-slate-500">Tax</h4>
                <h3 className="font-bold text-lg text-center text-slate-600 w-3/5 mr-20 pl-3 py-2 rounded-md bg-slate-100 ">
                  {detail[0].tax}
                </h3>
              </div>

              <div className="flex justify-between my-3">
                <h4 className="font-bold text-lg text-slate-500">
                  Product Ref
                </h4>
                <h3 className="font-bold text-lg text-center text-slate-600 w-3/5 mr-20 pl-3 py-2 rounded-md bg-slate-100 ">
                  {detail[0].ref}
                </h3>
              </div>
              <div className="flex justify-between my-3">
                <h4 className="font-bold text-lg text-slate-500">BarCode</h4>
                <h3 className="font-bold text-lg text-center text-slate-600 w-3/5 mr-20 pl-3 py-2 rounded-md bg-slate-100 ">
                  {detail[0].barcode}
                </h3>
              </div>
              <div className="flex justify-between my-3">
                <h4 className="font-bold text-lg text-slate-500">
                  Description
                </h4>
                <h3 className="font-bold text-lg text-center text-slate-600 w-3/5 mr-20 pl-3 py-2 rounded-md bg-slate-100 ">
                  {detail[0].description}
                </h3>
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
