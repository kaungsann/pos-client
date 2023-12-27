import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { itemsAdd, updateItemQuantity } from "../../redux/actions";
import img from "../../assets/product.svg/";
export default function Card({ product }) {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.orderData);
  const isHave = useSelector((state) => state.orderCheck);

  const addCard = (product) => {
    if (!isHave) {
      const existingProduct = products.find((pd) => pd.id === product.id);

      if (existingProduct) {
        dispatch(
          updateItemQuantity(
            existingProduct.id,
            (existingProduct.quantity += 1)
          )
        );
      } else {
        dispatch(itemsAdd({ ...product, quantity: 1 }));
      }
    }
  };

  return (
    <>
      <div
        className="w-36 mx-2 p-1.5 max-h-52 my-3 bg-white rounded-lg hover:border-blue-500 shadow-sm border-4 mt-2 cursor-pointer"
        onClick={() => addCard(product)}
      >
        <img
          src={product.image ? product.image : img}
          className="w-full h-28 rounded-md shadow-sm "
        />
        <h3 className="font-semibold text-slate-500 text-md mt-3">
          {product.name.substring(0, 12)}
        </h3>
        <h2 className="font-bold text-blue-700 text-md">
          {Math.ceil(product.salePrice)} MMK
        </h2>
      </div>
    </>
  );
}
