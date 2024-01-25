import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BASE_URL } from "../Api";
import BoxImg from "../../assets/box.png";
import { useReactToPrint } from "react-to-print";
import Barcode from "react-barcode";
import { useDispatch, useSelector } from "react-redux";
import { removeData } from "../../redux/actions";
import axios from "axios";
import { Spinner } from "@nextui-org/react";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState({
    name: "",
    ref: "",
    image: null,
    salePrice: 0,
    purchasePrice: 0,
    barcode: "",
    category: {
      name: "",
    },
    minStockQty: 0,
    marginProfit: 0,
    expiredAt: null,
    tax: 0,
    active: true,
    id: "",
  });
  const [loading, setLoading] = useState(true);

  const componentRef = useRef();
  const dipatch = useDispatch();

  const token = useSelector((state) => state.IduniqueData);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(BASE_URL + `/product/${id}`, {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
            "Content-Type": "application/json",
          },
        });
        if (data?.message == "Token Expire , Please Login Again") {
          dipatch(removeData(null));
        }
        setProduct({ ...product, ...data.data[0] });
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, []);

  return (
    <>
      {loading ? (
        <div className="w-10/12 h-screen mx-auto  flex justify-center items-center">
          {loading && <Spinner size="lg" />}
        </div>
      ) : (
        <div className="container my-5">
          <div className="container ">
            <div className="container bg-white p-5 rounded-md max-w-6xl">
              <div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Link
                      to="/admin/products/all"
                      className="font-bold rounded-sm shadow-sm flex items-center text-gray-700 border-gray-500 border-2 hover:opacity-75 text-sm hover:text-white hover:bg-gray-500 px-3 py-1.5"
                    >
                      Back
                    </Link>
                  </div>
                  <div className="flex items-center">
                    <div className="flex">
                      <Link
                        to={`/admin/products/edit/${id}`}
                        className="font-bold rounded-sm shadow-sm flex items-center text-[#4338ca] border-[#4338ca] border-2 hover:opacity-75 text-sm hover:text-white hover:bg-[#4338ca] px-3 py-1.5"
                      >
                        Edit
                      </Link>
                    </div>

                    <button
                      onClick={handlePrint}
                      className="rounded-sm shadow-sm flex items-center text-[#15803d] border-[#15803d] bg-white border-2 hover:opacity-75 text-sm hover:text-white hover:bg-green-700 font-bold px-3 py-1.5 ml-2"
                    >
                      Print Barcode
                    </button>
                  </div>
                </div>
                <div className="container bg-white p-5 rounded-lg max-w-6xl">
                  <div className="my-6 flex justify-between items-center w-4/5">
                    <h1 className="text-2xl font-bold text-slate-600">
                      Product Information
                    </h1>
                  </div>
                  <div className="flex">
                    <img
                      src={product?.image ? product?.image : BoxImg}
                      className="w-42 h-36 my-4 rounded-md shadow-md"
                    />
                    <div className="mx-8" ref={componentRef}>
                      <h2>{product.name}</h2>
                      <Barcode value={product.barcode} />
                    </div>
                  </div>
                  <div className="mb-4 flex p-4 items-center w-4/5">
                    <div className="flex justify-between w-full">
                      <div>
                        <div>
                          <h4 className="text-md text-slate-500">Name</h4>
                          <h2 className="text-md text-slate-600 mt-1 font-semibold">
                            {product.name}
                          </h2>
                        </div>
                        <div className="my-6">
                          <h4 className="text-md text-slate-500">Category</h4>
                          <h2 className="text-md text-slate-600 mt-1 font-semibold">
                            {product.category.name
                              ? product.category.name
                              : "None"}
                          </h2>
                        </div>
                        <div>
                          <h4 className="text-md text-slate-500">
                            Expired Date
                          </h4>
                          <h2 className="text-md text-slate-600 mt-1 font-semibold">
                            {product.expiredAt
                              ? new Date(product.expiredAt).toLocaleDateString()
                              : "None"}
                          </h2>
                        </div>
                      </div>
                      <div>
                        <div>
                          <h4 className="text-md text-slate-500">
                            Minimum Quantity
                          </h4>
                          <h2 className="text-md text-slate-600 mt-1 font-semibold">
                            {product.minStockQty ? product.minStockQty : "None"}
                          </h2>
                        </div>
                        <div className="my-6">
                          <h4 className="text-md text-slate-500">Tax</h4>
                          <h2 className="text-md text-slate-600 mt-1 font-semibold">
                            {product.tax ? product.tax : "None"}
                          </h2>
                        </div>
                        <div>
                          <h4 className="text-md text-slate-500">
                            Product Ref
                          </h4>
                          <h2 className="text-md text-slate-600 mt-1 font-semibold">
                            {product.ref ? product.ref : "None"}
                          </h2>
                        </div>
                      </div>
                      <div>
                        <div>
                          <h4 className="text-md text-slate-500">Barcode</h4>
                          <h2 className="text-md text-slate-600 mt-1 font-semibold">
                            {product.barcode ? product.barcode : ""}
                          </h2>
                        </div>
                        <div className="my-6">
                          <h4 className="text-md text-slate-500">Sale Price</h4>
                          <h2 className="text-md text-slate-600 mt-1 font-semibold">
                            {product.salePrice ? product.salePrice : "None"}
                          </h2>
                        </div>
                        <div>
                          <h4 className="text-md text-slate-500">
                            Purchase Price (Cost)
                          </h4>
                          <h2 className="text-md text-slate-600 mt-1 font-semibold">
                            {product.purchasePrice
                              ? product.purchasePrice
                              : "None"}
                          </h2>
                        </div>
                      </div>
                      <div>
                        <div>
                          <h4 className="text-md text-slate-500">Profit %</h4>
                          <h2 className="text-md text-slate-600 mt-1 font-semibold">
                            {product.marginProfit
                              ? product.marginProfit
                              : "none"}
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
