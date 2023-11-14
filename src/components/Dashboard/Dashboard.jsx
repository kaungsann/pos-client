import React from "react";
import Pos from "../../assets/logo.png";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import { BiPurchaseTag, BiCategory } from "react-icons/bi";
import { AiOutlineStock } from "react-icons/ai";
import { HiOutlineAdjustments } from "react-icons/hi";
import { MdOutlineInventory2 } from "react-icons/md";
import { GrCart } from "react-icons/gr";
import img from "../../assets/posbox.jpeg";
import userIcons from "../../assets/user.jpeg";
import { useSelector } from "react-redux";
import { Icon } from "@iconify/react";

export default function Admin() {
  const location = useLocation();
  const { id } = useParams();

  const user = useSelector((state) => state.loginData);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-30 bg-white">
        <div className="flex items-center justify-between lg:p-4 md:p-3 w-full cursor-pointer">
          <Link to={"/admin/inventory/overview"}>
            <img
              src={Pos}
              alt="pos"
              className="w-16 h-14 rounded-full shadow-sm items-center ml-14"
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
          className={`w-52 fixed top-10 mt-8 z-20 shadow-md  left-0 bottom-0 bg-white  p-4 flex flex-col transform transition-transform duration-500 ease-in-out`}
        >
          <div className=" flex justify-items-start mt-2 cursor-pointer">
            <div className="flex flex-col  w-full">
              <div className="flex flex-col">
                <h3 className="text-md font-bold">Inventory</h3>
                <ul className="text-center w-full">
                  <Link to="/admin/inventory/overview">
                    <div
                      className={`my-1 text-start px-2 rounded-md flex items-center ${
                        location.pathname === "/admin/inventory/overview"
                          ? "text-white bg-slate-300 "
                          : ""
                      }}`}
                    >
                      <Icon
                        icon="fluent-mdl2:analytics-view"
                        className="text-slate-800 text-2xl"
                      />
                      <li className={`my-1 ml-2 text-start  rounded-md`}>
                        OverView
                      </li>
                    </div>
                  </Link>
                  <Link to="/admin/products/all">
                    <div
                      className={`my-1 text-start px-2 rounded-md flex items-center ${
                        location.pathname === "/admin/products/all" ||
                        location.pathname === "/admin/products/create" ||
                        location.pathname === `/admin/products/edit/${id}` ||
                        location.pathname === `/admin/products/detail/${id}`
                          ? "text-white bg-slate-300 "
                          : ""
                      }}`}
                    >
                      <Icon
                        icon="fluent-mdl2:product"
                        className="text-slate-700 text-2xl"
                      />
                      <li className="my-1 text-start ml-2">Products</li>
                    </div>
                  </Link>
                  <Link to="/admin/categorys/all">
                    <div
                      className={`my-1 text-start px-2 rounded-md flex items-center ${
                        location.pathname === "/admin/categorys/all" ||
                        location.pathname === "/admin/categorys/create" ||
                        location.pathname === `/admin/categorys/edit/${id}` ||
                        location.pathname === `/admin/categorys/detail/${id}`
                          ? "text-white bg-slate-300 "
                          : ""
                      }}`}
                    >
                      <BiCategory className="text-slate-500 text-2xl" />
                      <li className="my-1 text-start  ml-2">Category</li>
                    </div>
                  </Link>
                  <Link to="/admin/stock/all">
                    <div
                      className={`my-1 text-start px-2 rounded-md flex items-center ${
                        location.pathname === "/admin/stock/all"
                          ? "text-white bg-slate-300 "
                          : ""
                      }}`}
                    >
                      <AiOutlineStock className="text-slate-500 text-2xl" />
                      <li className="my-1 text-start ml-2">Stock</li>
                    </div>
                  </Link>
                  <Link to="/admin/adjustment/view">
                    <div
                      className={`my-1 text-start px-2 rounded-md flex items-center ${
                        location.pathname === "/admin/adjustment/view"
                          ? "text-white bg-slate-300 "
                          : ""
                      }}`}
                    >
                      <HiOutlineAdjustments className="text-slate-500 text-2xl" />
                      <li className="my-1 text-start ml-2">Adjustment</li>
                    </div>
                  </Link>
                </ul>
              </div>
            </div>
          </div>
          <div className=" flex justify-items-start mt-2 cursor-pointer">
            <div className="flex flex-col justify-items-center w-full">
              <div className="flex flex-col">
                <h3 className="text-md font-bold">Purchase</h3>
                <ul className="text-center w-full">
                  <Link to="/admin/purchase/view">
                    <div
                      className={`my-1 text-start px-2 rounded-md flex items-center ${
                        location.pathname === "/admin/purchase/view"
                          ? "text-white bg-slate-300 "
                          : ""
                      }}`}
                    >
                      <Icon
                        icon="uil:analytics"
                        className="text-slate-700 text-2xl"
                      />
                      <li className="my-1 text-start ml-2">OverView</li>
                    </div>
                  </Link>
                  <Link to="/admin/purchase/all">
                    <div
                      className={`my-1 text-start px-2 rounded-md flex items-center ${
                        location.pathname === "/admin/purchase/all" ||
                        location.pathname === "/admin/purchase/create" ||
                        location.pathname === `/admin/purchase/detail/${id}`
                          ? "text-white bg-slate-300 "
                          : ""
                      }}`}
                    >
                      <Icon
                        icon="icons8:buy"
                        className="text-slate-700 text-2xl"
                      />
                      <li className="my-1 text-start ml-2">Purchase Order</li>
                    </div>
                  </Link>
                  <Link to="/admin/customers/vendors">
                    <div
                      className={`my-1 text-start px-2 rounded-md flex items-center ${
                        location.pathname === "/admin/customers/vendors" ||
                        location.pathname === `/admin/customers/detail/${id}`
                          ? "text-white bg-slate-300 "
                          : ""
                      }}`}
                    >
                      <Icon
                        icon="bx:user"
                        className="text-slate-700 text-2xl"
                      />
                      <li className="my-1 text-start ml-2">Vendors</li>
                    </div>
                  </Link>
                </ul>
              </div>
            </div>
          </div>
          <div className=" flex justify-items-start mt-2 cursor-pointer">
            <div className="flex flex-col justify-items-center w-full">
              <div className="flex flex-col">
                <h3 className="text-md font-bold">Sale</h3>
                <ul className="text-start w-full">
                  <Link to="/admin/saleorders/view">
                    <div
                      className={`my-1 text-start px-2 rounded-md flex items-center ${
                        location.pathname === "/admin/saleorders/view"
                          ? "text-white bg-slate-300 "
                          : ""
                      }}`}
                    >
                      <Icon
                        icon="uil:analytics"
                        className="text-slate-700 text-2xl"
                      />

                      <li className="my-1 text-start ml-2">OverView</li>
                    </div>
                  </Link>
                  <Link to="/admin/saleorders/all">
                    <div
                      className={`my-1 text-start px-2 rounded-md flex items-center ${
                        location.pathname === "/admin/saleorders/all" ||
                        location.pathname === "/admin/saleorders/create" ||
                        location.pathname === `/admin/saleorders/detail/${id}`
                          ? "text-white bg-slate-300 "
                          : ""
                      }}`}
                    >
                      <Icon
                        icon="icon-park-outline:buy"
                        className="text-slate-700 text-2xl"
                      />
                      <li className="my-1 text-start ml-2">Sales Order</li>
                    </div>
                  </Link>
                  <Link to="/admin/customers/all">
                    <div
                      className={`my-1 text-start px-2 rounded-md flex items-center ${
                        location.pathname === "/admin/customers/all"
                          ? "text-white bg-slate-300 "
                          : ""
                      }}`}
                    >
                      <Icon
                        icon="bx:user"
                        className="text-slate-700 text-2xl"
                      />
                      <li className="my-1 text-start ml-2">Customers</li>
                    </div>
                  </Link>
                </ul>
              </div>
            </div>
          </div>
          <div className=" flex justify-items-start mt-2 cursor-pointer">
            <div className="flex flex-col justify-items-center w-full">
              <div className="flex flex-col w-full">
                <h3 className="text-md font-bold">POS</h3>
                <ul className="text-start">
                  <Link to="/admin/pos/all">
                    <div
                      className={`my-1 text-start px-2 rounded-md flex items-center ${
                        location.pathname === "/admin/pos/all"
                          ? "text-white bg-slate-300 "
                          : ""
                      }}`}
                    >
                      <Icon
                        icon="mdi:printer-point-of-sale-cog-outline"
                        className="text-slate-600 text-2xl"
                      />
                      <li className="my-1 text-start ml-2">OverView</li>
                    </div>
                  </Link>
                  <Link to="/admin/partners/all">
                    <div
                      className={`my-1 text-start px-2 rounded-md flex items-center ${
                        location.pathname === "/admin/partners/all" ||
                        location.pathname === "/admin/partners/create" ||
                        location.pathname === `/admin/partners/edit/${id}` ||
                        location.pathname === `/admin/partners/detail/${id}`
                          ? "text-white bg-slate-300 "
                          : ""
                      }}`}
                    >
                      <Icon
                        icon="mdi:partnership-outline"
                        className="text-slate-600 text-2xl"
                      />
                      <li className="my-1 text-start ml-2">Partner</li>
                    </div>
                  </Link>
                  <Link to="/admin/locations/all">
                    <div
                      className={`my-1 text-start px-2 rounded-md flex items-center ${
                        location.pathname === "/admin/locations/all" ||
                        location.pathname === "/admin/locations/create" ||
                        location.pathname === `/admin/locations/edit/${id}` ||
                        location.pathname === `/admin/locations/detail/${id}`
                          ? "text-white bg-slate-300 "
                          : ""
                      }}`}
                    >
                      <Icon
                        icon="ep:location"
                        className="text-slate-600 text-2xl"
                      />

                      <li className="my-1 text-start ml-2">Location</li>
                    </div>
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
