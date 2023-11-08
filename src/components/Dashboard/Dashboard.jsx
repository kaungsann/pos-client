import React from "react";
import Pos from "../../assets/op.jpeg";
import { Link, Outlet, useLocation } from "react-router-dom";
import { BiPurchaseTag } from "react-icons/bi";
import { MdOutlineInventory2 } from "react-icons/md";
import { GrCart } from "react-icons/gr";
import img from "../../assets/posbox.jpeg";
import userIcons from "../../assets/user.jpeg";
import { useSelector } from "react-redux";

export default function Admin() {
  const location = useLocation();

  const user = useSelector((state) => state.loginData);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-30 bg-white">
        <div className="flex items-center justify-between lg:p-4 md:p-3 w-full cursor-pointer">
          <Link to="/">
            <img
              src={Pos}
              alt="pos"
              className="w-32 h-14 rounded-full shadow-sm items-center ml-8"
            />
          </Link>
          <div className="flex lg:w-96justify-end lg:mr-[30px] md:mr-[80px]">
            <div className="flex items-center">
              {user && (
                <>
                  <h3 className="font-semibold text-slate-500 text-xl mr-4">
                    {user.username}
                  </h3>
                  <Link to={`/admin/user/info/${user._id}`}>
                    <img
                      src={user.image ? user.image : userIcons}
                      alt="User Icon"
                      className="w-16 h-14 rounded-full shadow-sm hover:opacity-75"
                      onError={(e) => {
                        e.target.src = userIcons;
                      }}
                    />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex mt-20 relative">
        <div
          className={`w-52 fixed top-10 mt-10 z-20 shadow-md  left-0 bottom-0 bg-white  p-4 flex flex-col transform transition-transform duration-500 ease-in-out`}
        >
          <div className=" flex justify-items-start mt-4 cursor-pointer font-serif">
            <MdOutlineInventory2 className="text-3xl hover:text-blue-600" />
            <div className="flex flex-col  w-full">
              <div className="flex flex-col">
                <h3 className="text-md font-bold ml-6">Inventory</h3>
                <ul className="text-center w-full">
                  <Link to="/admin/inventory/overview">
                    <li
                      className={`my-2 text-start pl-6 rounded-md ${
                        location.pathname === "/admin/inventory/overview"
                          ? "text-white bg-blue-600 "
                          : ""
                      }}`}
                    >
                      OverView
                    </li>
                  </Link>
                  <Link to="/admin/products/all">
                    <li
                      className={`my-2 text-start pl-6 ${
                        location.pathname === "/admin/products/all"
                          ? "text-white bg-blue-600 rounded-md"
                          : ""
                      }`}
                    >
                      Products
                    </li>
                  </Link>
                  <Link to="/admin/categorys/all">
                    <li
                      className={`my-2 text-start pl-6 ${
                        location.pathname === "/admin/categorys/all"
                          ? "text-white bg-blue-600 rounded-md"
                          : ""
                      }`}
                    >
                      Category
                    </li>
                  </Link>
                  <Link to="/admin/stock/all">
                    <li
                      className={`my-2 text-start pl-6 ${
                        location.pathname === "/admin/stock/all"
                          ? "text-white bg-blue-600 rounded-md"
                          : ""
                      }`}
                    >
                      Stock
                    </li>
                  </Link>
                  <Link to="/admin/adjustment/view">
                    <li
                      className={`my-2 text-start pl-6 ${
                        location.pathname === "/admin/adjustment/view"
                          ? "text-white bg-blue-600 rounded-md"
                          : ""
                      }`}
                    >
                      Adjustment
                    </li>
                  </Link>
                </ul>
              </div>
            </div>
          </div>
          <div className=" flex justify-items-start mt-3 cursor-pointer font-serif">
            <BiPurchaseTag className="text-3xl hover:text-blue-600" />
            <div className="flex flex-col justify-items-center w-full">
              <div className="flex flex-col">
                <h3 className="text-md font-bold ml-6">Purchase</h3>
                <ul className="text-center w-full">
                  <Link to="/admin/purchase/view">
                    <li
                      className={`my-2 text-start pl-6 ${
                        location.pathname === "/admin/purchase/view"
                          ? "text-white bg-blue-600 rounded-md"
                          : ""
                      }`}
                    >
                      OverView
                    </li>
                  </Link>
                  <Link to="/admin/purchase/all">
                    <li
                      className={`my-2 text-start pl-6 ${
                        location.pathname === "/admin/purchase/all"
                          ? "text-white bg-blue-600 rounded-md"
                          : ""
                      }`}
                    >
                      Purchase Order
                    </li>
                  </Link>
                  <Link to="/admin/customers/vendors">
                    <li
                      className={`my-2 text-start pl-6 ${
                        location.pathname === "/admin/customers/vendors"
                          ? "text-white bg-blue-600 rounded-md"
                          : ""
                      }`}
                    >
                      Vendors
                    </li>
                  </Link>
                </ul>
              </div>
            </div>
          </div>
          <div className=" flex justify-items-start mt-3 cursor-pointer font-serif">
            <GrCart className="text-3xl text-slate-500 hover:text-blue-600" />
            <div className="flex flex-col justify-items-center w-full">
              <div className="flex flex-col">
                <h3 className="text-md font-bold ml-6">Sale</h3>
                <ul className="text-start w-full">
                  <Link to="/admin/saleorders/view">
                    <li
                      className={`my-2 text-start pl-6 ${
                        location.pathname === "/admin/saleorders/view"
                          ? "text-white bg-blue-600 rounded-md"
                          : ""
                      }`}
                    >
                      OverView
                    </li>
                  </Link>
                  <Link to="/admin/saleorders/all">
                    <li
                      className={`my-2 text-start pl-6 ${
                        location.pathname === "/admin/saleorders/all"
                          ? "text-white bg-blue-600 rounded-md"
                          : ""
                      }`}
                    >
                      Sales Order
                    </li>
                  </Link>
                  <Link to="/admin/customers/all">
                    <li
                      className={`my-2 text-start pl-6 ${
                        location.pathname === "/admin/customers/all"
                          ? "text-white bg-blue-600 rounded-md"
                          : ""
                      }`}
                    >
                      Customers
                    </li>
                  </Link>
                </ul>
              </div>
            </div>
          </div>
          <div className=" flex justify-items-start mt-3 cursor-pointer font-serif">
            <img src={img} className="w-7 h-8  hover:text-blue-600" />
            <div className="flex flex-col justify-items-center w-full">
              <div className="flex flex-col w-full">
                <h3 className="text-md font-bold ml-6">POS</h3>
                <ul className="text-start">
                  <Link to="/admin/pos/all">
                    <li
                      className={`my-2 text-start pl-6 ${
                        location.pathname === "/admin/pos/all"
                          ? "text-white bg-blue-600 rounded-md"
                          : ""
                      }`}
                    >
                      OverView
                    </li>
                  </Link>
                  <Link to="/admin/partners/all">
                    <li
                      className={`my-2 text-start pl-6 ${
                        location.pathname === "/admin/partners/all"
                          ? "text-white bg-blue-600 rounded-md"
                          : ""
                      }`}
                    >
                      Partner
                    </li>
                  </Link>
                  <Link to="/admin/locations/all">
                    <li
                      className={`my-2 text-start pl-6 ${
                        location.pathname === "/admin/locations/all"
                          ? "text-white bg-blue-600 rounded-md"
                          : ""
                      }`}
                    >
                      Location
                    </li>
                  </Link>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 mx-auto ml-52 p-4">
        <Outlet />
      </div>
    </>
  );
}
