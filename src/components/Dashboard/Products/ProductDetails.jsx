import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BASE_URL } from "../../Api";
import BoxImg from "../../../assets/box.png";
import FadeLoader from "react-spinners/FadeLoader";
import { useReactToPrint } from "react-to-print";
import Barcode from "react-barcode";
import { Icon } from "@iconify/react";
import { useDispatch, useSelector } from "react-redux";
import { removeData } from "../../../redux/actions";
import axios from "axios";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState({
    name: "",
    ref: "",
    image: null,
    salePrice: 0,
    purchasePrice: 0,
    barcode: "",
    minStockQty: 0,
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
        const { data, message } = await axios.get(BASE_URL + `/product/${id}`, {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
            "Content-Type": "application/json",
          },
        });
        if (message == "Token Expire , Please Login Again") {
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

      {loading ? (
        <div className="flex items-center justify-center mt-40">
          <FadeLoader
            color={"#0284c7"}
            loading={loading}
            size={20}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <div className="container my-5">
          <h2 className="lg:text-xl font-bold my-2">Product Information</h2>
          <div className="container bg-white p-5 rounded-lg max-w-6xl">
            <div className="flex">
              <img
                src={product?.image ? product?.image : BoxImg}
                className="w-42 h-36 my-4 rounded-md shadow-md"
              />
              <div className="mx-8" ref={componentRef}>
                <h2>{product.name}</h2>
                <Barcode value={product.barcode} />
              </div>
              <div className="ml-auto">
                <Link to={`/admin/products/edit/${id}`}>
                  <Icon icon="ep:edit" className="text-xl" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 max-w-3xl gap-10 my-10">
              <div className="container space-y-8 font-semibold text-sm">
                <div className="flex justify-between items-center">
                  <h4>Name</h4>
                  <h3 className="font-medium">{product.name}</h3>
                </div>
                <div className="flex justify-between items-center">
                  <h4>Category</h4>
                  <h3 className="font-medium">{product.category}</h3>
                </div>
                <div className="flex justify-between items-center">
                  <h4>Expired Date</h4>
                  <h3 className="font-medium">
                    {product.expiredAt
                      ? new Date(product.expiredAt).toLocaleDateString()
                      : ""}
                  </h3>
                </div>
                <div className="flex justify-between items-center">
                  <h4>Min-Stock Qty</h4>
                  <h3 className="font-medium">{product.minStockQty}</h3>
                </div>
                <div className="flex justify-between items-center">
                  <h4>Description</h4>
                  <h3 className="font-medium">{product.description}</h3>
                </div>
              </div>
              <div className="container space-y-8 font-semibold text-sm">
                <div className="flex justify-between items-center">
                  <h4>Price</h4>
                  <h3 className="font-medium">{product.salePrice}</h3>
                </div>
                <div className="flex justify-between items-center">
                  <h4>Tax</h4>
                  <h3 className="font-medium">{product.tax}</h3>
                </div>

                <div className="flex justify-between items-center">
                  <h4>Product Ref</h4>
                  <h3 className="font-medium">{product.ref}</h3>
                </div>
                <div className="flex justify-between items-center">
                  <h4>BarCode</h4>
                  <h3 className="font-medium">{product.barcode}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
