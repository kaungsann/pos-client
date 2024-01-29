import { Icon } from "@iconify/react";
import logo from "../../assets/logo.png";
import invent from "../../assets/inv.png";
import pur from "../../assets/buyy.png";
import sal from "../../assets/sell.png";
import customer from "../../assets/stakeholder.png";
import accountant from "../../assets/accounting.png";
import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Listbox,
  ListboxItem,
} from "@nextui-org/react";

import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function SideBar() {
  const location = useLocation();
  const { id } = useParams();
  const [expanded, setExpanded] = useState(false);
  const [inventory, setInventory] = useState(false);
  const [purchase, setPurchase] = useState(false);
  const [sale, setSale] = useState(false);
  const [skate, setSkate] = useState(false);
  const [account, setAccount] = useState(false);

  const navigate = useNavigate();

  const clostHandleList = () => {
    setInventory(false), setPurchase(false);
    setSale(false);
    setSkate(false);
    setAccount(false);
    setExpanded(false);
  };

  return (
    <>
      {/* <aside className="overflow-y-scroll custom-scrollbar h-screen">
        <nav className="h-full flex flex-col bg-white ">
          <div className="px-4 pb-2 flex justify-between items-center">
            <img
              src={logo}
              className={`overflow-hidden duration-1000 transition-all ${
                expanded ? "w-10" : "w-0"
              }`}
              alt=""
            />
            <button
              onClick={() => {
                setExpanded((curr) => !curr);
                setInventory(false), setPurchase(false);
                setSale(false);
                setSkate(false);
                setAccount(false);
              }}
              className="p-1.5 my-2 rounded-lg bg-gray-50 hover:bg-gray-100"
            >
              {expanded ? (
                <Icon
                  icon="mingcute:right-line"
                  className="text-2xl text-slate-500"
                />
              ) : (
                <Icon
                  icon="icon-park-outline:left"
                  className="text-2xl text-slate-500"
                />
              )}
            </button>
          </div>

          <div className="border-t flex p-3">
            <Popover
              placement="right"
              classNames={{
                base: ["p-0 rounded-sm"],
                content: ["p-0 mx-2 rounded-sm"],
              }}
            >
              <PopoverTrigger>
                <img src={invent} alt="" className="w-9 h-9 rounded-md" />
              </PopoverTrigger>

              <PopoverContent>
                {expanded === false && (
                  <Listbox
                    aria-label="Actions"
                    className="rounded-sm"
                    itemClasses={{
                      base: "p-1 rounded-sm",
                    }}
                  >
                    <ListboxItem
                      onClick={() => navigate("/admin/inventory/overview")}
                    >
                      <div className="flex justify-between">
                        <li className={`my-1 ml-2 text-start  rounded-md`}>
                          Overview
                        </li>
                      </div>
                    </ListboxItem>
                    <ListboxItem
                      onClick={() => navigate("/admin/products/all")}
                    >
                      <div className="flex justify-between">
                        <li className="my-1 text-start ml-2">Product</li>
                      </div>
                    </ListboxItem>
                    <ListboxItem
                      onClick={() => navigate("/admin/categorys/all")}
                    >
                      <div className="flex justify-between">
                        <li className="my-1 text-start ml-2">Category</li>
                      </div>
                    </ListboxItem>
                    <ListboxItem onClick={() => navigate("/admin/stock/all")}>
                      <div className="flex justify-between">
                        <li className="my-1 text-start ml-2">Stock</li>
                      </div>
                    </ListboxItem>
                    <ListboxItem
                      onClick={() => navigate("/admin/adjustment/view")}
                    >
                      <div className="flex justify-between">
                        <li className="my-1 text-start ml-2">Adjustment</li>
                      </div>
                    </ListboxItem>
                    <ListboxItem>
                      <div
                        className="flex justify-between"
                        onClick={() => navigate("/admin/locations/all")}
                      >
                        <li className="my-1 text-start ml-2">Location</li>
                      </div>
                    </ListboxItem>
                  </Listbox>
                )}
              </PopoverContent>
            </Popover>

            <div
              className={`
              flex flex-col justify-between items-center
              overflow-hidden duration-1000 transition-all ${
                expanded ? "w-40" : "w-0"
              }
          `}
            >
              <div className=" cursor-pointer mt-2">
                <div
                  className="flex items-center w-32"
                  onClick={() => setInventory(!inventory)}
                >
                  <h4 className="font-semibold text-md">Inventory</h4>
                  {inventory ? (
                    <Icon
                      icon="iconamoon:arrow-down-2"
                      className="text-lg ml-2 text-gray-600"
                    />
                  ) : (
                    <Icon
                      icon="iconamoon:arrow-up-2"
                      className="text-lg ml-2 text-gray-600"
                    />
                  )}
                </div>
              </div>
              <div
                className={`
                 overflow-hidden transition-all ${inventory ? "w-40" : "w-0"}
                 `}
              >
                {inventory && (
                  <ul className="cursor-pointer mt-2 ml-2">
                    <li
                      className={`p-1 px-3 flex items-center hover:bg-slate-100 rounded-sm text-md text-slate-500 ${
                        location.pathname === "/admin/inventory/overview"
                          ? "text-white bg-slate-300 "
                          : ""
                      }}`}
                      onClick={() => {
                        navigate("/admin/inventory/overview"),
                          clostHandleList();
                      }}
                    >
                      <Icon
                        icon="fluent-mdl2:analytics-view"
                        className="text-slate-600 text-xl"
                      />
                      <h3 className="ml-3">OverView</h3>
                    </li>
                    <li
                      className={`p-1 px-3 flex items-center hover:bg-slate-100 rounded-sm text-md text-slate-500 ${
                        location.pathname === "/admin/products/all" ||
                        location.pathname === "/admin/products/create" ||
                        location.pathname === `/admin/products/edit/${id}` ||
                        location.pathname === `/admin/products/detail/${id}`
                          ? "text-white bg-slate-300 "
                          : ""
                      }}`}
                      onClick={() => {
                        navigate("/admin/products/all"), clostHandleList();
                      }}
                    >
                      <Icon
                        icon="fluent-mdl2:product"
                        className="text-slate-600 text-xl"
                      />

                      <h3 className="ml-3">Product</h3>
                    </li>
                    <li
                      className={`p-1 px-3 flex items-center hover:bg-slate-100 rounded-sm text-md text-slate-500 ${
                        location.pathname === "/admin/categorys/all" ||
                        location.pathname === "/admin/categorys/create" ||
                        location.pathname === `/admin/categorys/edit/${id}` ||
                        location.pathname === `/admin/categorys/detail/${id}`
                          ? "text-white bg-slate-300 "
                          : ""
                      }}`}
                      onClick={() => {
                        navigate("/admin/categorys/all"), clostHandleList();
                      }}
                    >
                      <Icon
                        icon="tabler:category-plus"
                        className="text-slate-500 text-2xl"
                      />

                      <h3 className="ml-3">Category</h3>
                    </li>
                    <li
                      className={`p-1 px-2 flex items-center hover:bg-slate-100 rounded-sm text-md text-slate-500 ${
                        location.pathname === "/admin/stock/all" ||
                        location.pathname === "/admin/stock/create" ||
                        location.pathname === `/admin/stock/edit/${id}` ||
                        location.pathname === `/admin/stock/detail/${id}`
                          ? "text-white bg-slate-300 "
                          : ""
                      }}`}
                      onClick={() => {
                        navigate("/admin/stock/all"), clostHandleList();
                      }}
                    >
                      <Icon
                        icon="healthicons:rdt-result-out-stock-outline"
                        className="text-slate-500 text-2xl"
                      />

                      <h3 className="ml-3">Stock</h3>
                    </li>
                    <li
                      className={`p-1 px-3 flex items-center hover:bg-slate-100 rounded-sm text-md text-slate-500 ${
                        location.pathname === "/admin/adjustment/view"
                          ? "text-white bg-slate-300 "
                          : ""
                      }}`}
                      onClick={() => {
                        navigate("/admin/adjustment/view"), clostHandleList();
                      }}
                    >
                      <Icon
                        icon="tabler:adjustments-horizontal"
                        className="text-slate-500 text-xl"
                      />

                      <h3 className="ml-3">Adjustment</h3>
                    </li>
                    <li
                      className={`p-1 px-3 flex items-center hover:bg-slate-100 rounded-sm text-md text-slate-500 ${
                        location.pathname === "/admin/locations/all" ||
                        location.pathname === "/admin/locations/create" ||
                        location.pathname === `/admin/locations/edit/${id}` ||
                        location.pathname === `/admin/locations/detail/${id}`
                          ? "text-white bg-slate-300 "
                          : ""
                      }}`}
                      onClick={() => {
                        navigate("/admin/locations/all"), clostHandleList();
                      }}
                    >
                      <Icon
                        icon="ep:location"
                        className="text-slate-600 text-xl"
                      />
                      <h3 className="ml-3">Location</h3>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="border-t flex p-3">
            <Popover
              showArrow
              placement="right"
              classNames={{
                base: ["p-0 rounded-sm"],
                content: ["p-0 mx-2 rounded-sm"],
              }}
            >
              <PopoverTrigger>
                <img src={pur} alt="" className="w-9 h-9 rounded-md" />
              </PopoverTrigger>

              <PopoverContent>
                {expanded === false && (
                  <Listbox
                    aria-label="Actions"
                    className="rounded-sm"
                    itemClasses={{
                      base: "p-1 rounded-sm",
                    }}
                  >
                    <ListboxItem
                      onClick={() => navigate("/admin/purchase/view")}
                    >
                      <div className="flex justify-between">
                        <li className={`my-1 ml-2 text-start  rounded-md`}>
                          Overview
                        </li>
                      </div>
                    </ListboxItem>
                    <ListboxItem
                      onClick={() => navigate("/admin/purchase/all")}
                    >
                      <div className="flex justify-between">
                        <li className="my-1 text-start ml-2">Purchase</li>
                      </div>
                    </ListboxItem>
                    <ListboxItem
                      onClick={() => navigate("/admin/customers/vendors")}
                    >
                      <div className="flex justify-between">
                        <li className="my-1 text-start ml-2">Vendor</li>
                      </div>
                    </ListboxItem>
                  </Listbox>
                )}
              </PopoverContent>
            </Popover>
            <div
              className={`
              flex flex-col justify-between items-center
              overflow-hidden duration-1000 transition-all ${
                expanded ? "w-40" : "w-0"
              }
          `}
            >
              <div className=" cursor-pointer mt-2">
                <div
                  className="flex items-center w-32"
                  onClick={() => setPurchase(!purchase)}
                >
                  <h4 className="font-semibold text-md">Purchase</h4>

                  {purchase ? (
                    <Icon
                      icon="iconamoon:arrow-down-2"
                      className="text-lg ml-2 text-gray-600"
                    />
                  ) : (
                    <Icon
                      icon="iconamoon:arrow-up-2"
                      className="text-lg ml-2 text-gray-600"
                    />
                  )}
                </div>
              </div>
              <div
                className={`
              overflow-hidden transition-all ${purchase ? "w-40 ml-3" : "w-0"}
          `}
              >
                {purchase && (
                  <ul className="cursor-pointer mt-2">
                    <li
                      className={`p-1 px-3 flex items-center hover:bg-slate-100 rounded-sm text-md text-slate-500 ${
                        location.pathname === "/admin/purchase/view"
                          ? "text-white bg-slate-300 "
                          : ""
                      }}`}
                      onClick={() => {
                        navigate("/admin/purchase/view"), clostHandleList();
                      }}
                    >
                      <Icon
                        icon="uim:analytics"
                        className="text-slate-500 text-xl"
                      />

                      <span className="ml-3">Overview</span>
                    </li>
                    <li
                      className={`p-1 px-3 flex items-center hover:bg-slate-100 rounded-sm text-md text-slate-500 ${
                        location.pathname === "/admin/purchase/all" ||
                        location.pathname === "/admin/purchase/create" ||
                        location.pathname === `/admin/purchase/detail/${id}`
                          ? "text-white bg-slate-300 "
                          : ""
                      }}`}
                      onClick={() => {
                        navigate("/admin/purchase/all"), clostHandleList();
                      }}
                    >
                      <Icon
                        icon="icons8:buy"
                        className="text-slate-500 text-xl"
                      />
                      <span className="ml-3"> Purchase</span>
                    </li>
                    <li
                      className={`p-1 px-3 flex items-center rounded-sm text-md hover:bg-slate-100 text-slate-500 ${
                        location.pathname === "/admin/customers/vendors" ||
                        location.pathname === `/admin/customers/detail/${id}`
                          ? "text-white bg-slate-300 "
                          : ""
                      }}`}
                      onClick={() => {
                        navigate("/admin/customers/vendors"), clostHandleList();
                      }}
                    >
                      <Icon icon="ph:user" className="text-slate-500 text-xl" />

                      <span className="ml-3">Vendor</span>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="border-t flex p-3">
            <Popover
              showArrow
              placement="right"
              classNames={{
                base: ["p-0 rounded-sm"],
                content: ["p-0 mx-2 rounded-sm"],
              }}
            >
              <PopoverTrigger>
                <img src={sal} alt="" className="w-9 h-9 rounded-md" />
              </PopoverTrigger>

              <PopoverContent>
                {expanded === false && (
                  <Listbox
                    aria-label="Actions"
                    className="rounded-sm"
                    itemClasses={{
                      base: "p-1 rounded-sm",
                    }}
                  >
                    <ListboxItem
                      onClick={() => navigate("/admin/saleorders/view")}
                    >
                      <div className="flex justify-between">
                        <li className={`my-1 ml-2 text-start rounded-md`}>
                          Overview
                        </li>
                      </div>
                    </ListboxItem>
                    <ListboxItem
                      onClick={() => navigate("/admin/saleorders/all")}
                    >
                      <div className="flex justify-between">
                        <li className="my-1 text-start ml-2">Sale</li>
                      </div>
                    </ListboxItem>
                    <ListboxItem
                      onClick={() => navigate("/admin/customers/all")}
                    >
                      <div className="flex justify-between">
                        <li className="my-1 text-start ml-2">Customer</li>
                      </div>
                    </ListboxItem>
                  </Listbox>
                )}
              </PopoverContent>
            </Popover>
            <div
              className={`
              flex flex-col justify-between items-center
              overflow-hidden duration-1000 transition-all ${
                expanded ? "w-40" : "w-0"
              }
          `}
            >
              <div className=" cursor-pointer mt-2">
                <div
                  className="flex items-center w-32"
                  onClick={() => setSale(!sale)}
                >
                  <h4 className="font-semibold text-md">Sale</h4>
                  {sale ? (
                    <Icon
                      icon="iconamoon:arrow-down-2"
                      className="text-lg ml-2 text-gray-600"
                    />
                  ) : (
                    <Icon
                      icon="iconamoon:arrow-up-2"
                      className="text-lg ml-2 text-gray-600"
                    />
                  )}
                </div>
              </div>
              <div
                className={`
                overflow-hidden transition-all ${sale ? "w-40 ml-3" : "w-0"}
          `}
              >
                {sale && (
                  <ul className="cursor-pointer mt-2">
                    <li
                      className={`p-1 px-3 flex items-center hover:bg-slate-100 rounded-sm text-md text-slate-500 ${
                        location.pathname === "/admin/saleorders/view"
                          ? "text-white bg-slate-300 "
                          : ""
                      }}`}
                      onClick={() => {
                        navigate("/admin/saleorders/view"), clostHandleList();
                      }}
                    >
                      <Icon
                        icon="uim:analytics"
                        className="text-slate-500 text-xl"
                      />
                      <span className="ml-3">Overview</span>
                    </li>
                    <li
                      className={`p-1 px-3 flex hover:bg-slate-100 items-center rounded-sm text-md text-slate-500 ${
                        location.pathname === "/admin/saleorders/all" ||
                        location.pathname === "/admin/saleorders/create" ||
                        location.pathname === `/admin/saleorders/detail/${id}`
                          ? "text-white bg-slate-300 "
                          : ""
                      }}`}
                      onClick={() => {
                        navigate("/admin/saleorders/all"), clostHandleList();
                      }}
                    >
                      <Icon
                        icon="icon-park-outline:buy"
                        className="text-slate-500 text-xl"
                      />

                      <span className="ml-3">SaleOrders</span>
                    </li>
                    <li
                      className={`p-1 px-3 flex items-center hover:bg-slate-100 rounded-sm text-md text-slate-500 ${
                        location.pathname === "/admin/customers/all"
                          ? "text-white bg-slate-300 "
                          : ""
                      }}`}
                      onClick={() => {
                        navigate("/admin/customers/all"), clostHandleList();
                      }}
                    >
                      <Icon icon="ph:user" className="text-slate-500 text-xl" />
                      <span className="ml-3">Customers</span>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="border-t flex p-3">
            <Popover
              showArrow
              placement="right"
              classNames={{
                base: ["p-0 rounded-sm"],
                content: ["p-0 mx-2 rounded-sm"],
              }}
            >
              <PopoverTrigger>
                <img src={customer} alt="" className="w-9 h-9 rounded-md" />
              </PopoverTrigger>

              <PopoverContent>
                {expanded === false && (
                  <Listbox
                    aria-label="Actions"
                    className="rounded-sm"
                    itemClasses={{
                      base: "p-1 rounded-sm",
                    }}
                  >
                    <ListboxItem
                      onClick={() => navigate("/admin/partners/all")}
                    >
                      <div className="flex justify-between">
                        <li className={`my-1 ml-2 text-start  rounded-md`}>
                          Partner
                        </li>
                      </div>
                    </ListboxItem>
                    <ListboxItem
                      onClick={() => navigate("/admin/employee/all")}
                    >
                      <div className="flex justify-between">
                        <li className="my-1 text-start ml-2">Employee</li>
                      </div>
                    </ListboxItem>
                    <ListboxItem onClick={() => navigate("/admin/user/all")}>
                      <div className="flex justify-between">
                        <li className="my-1 text-start ml-2">Staff</li>
                      </div>
                    </ListboxItem>
                  </Listbox>
                )}
              </PopoverContent>
            </Popover>
            <div
              className={`
              flex flex-col justify-between items-center
              overflow-hidden duration-1000 transition-all ${
                expanded ? "w-40" : "w-0"
              }
          `}
            >
              <div className=" cursor-pointer mt-2">
                <div
                  className="flex items-center w-32"
                  onClick={() => setSkate(!skate)}
                >
                  <h4 className="font-semibold text-md">Stakeholders</h4>
                  {skate ? (
                    <Icon
                      icon="iconamoon:arrow-down-2"
                      className="text-lg ml-2 text-gray-600"
                    />
                  ) : (
                    <Icon
                      icon="iconamoon:arrow-up-2"
                      className="text-lg ml-2 text-gray-600"
                    />
                  )}
                </div>
              </div>
              <div
                className={`
              overflow-hidden transition-all ${skate ? "w-40 ml-3" : "w-0"}
          `}
              >
                {skate && (
                  <ul className="cursor-pointer mt-2">
                    <li
                      className={`p-1 px-3 flex items-center rounded-sm hover:bg-slate-100 text-md text-slate-500 ${
                        location.pathname === "/admin/partners/all" ||
                        location.pathname === "/admin/partners/create" ||
                        location.pathname === `/admin/partners/edit/${id}` ||
                        location.pathname === `/admin/partners/detail/${id}`
                          ? "text-white bg-slate-300 "
                          : ""
                      }}`}
                      onClick={() => {
                        navigate("/admin/partners/all"), clostHandleList();
                      }}
                    >
                      <Icon
                        icon="ph:users-three"
                        className="text-slate-500 text-xl"
                      />

                      <span className="ml-3">Partner</span>
                    </li>
                    <li
                      className={`p-1 px-3 flex items-center hover:bg-slate-100 rounded-sm text-md text-slate-500 ${
                        location.pathname === "/admin/employee/all" ||
                        location.pathname === "/admin/employee/create" ||
                        location.pathname === `/admin/employee/edit/${id}` ||
                        location.pathname === `/admin/employee/detail/${id}`
                          ? "text-white bg-slate-300 "
                          : ""
                      }}`}
                      onClick={() => {
                        navigate("/admin/employee/all"), clostHandleList();
                      }}
                    >
                      <Icon
                        icon="clarity:employee-line"
                        className="text-slate-500 text-xl"
                      />
                      <span className="ml-3">Employee</span>
                    </li>
                    <li
                      className={`p-1 px-3 flex items-center hover:bg-slate-100 rounded-sm text-md text-slate-500 ${
                        location.pathname === "/admin/user/all" ||
                        location.pathname === "/admin/user/create" ||
                        location.pathname === `/admin/user/edit/${id}` ||
                        location.pathname === `/admin/user/detail/${id}`
                          ? "text-white bg-slate-300 "
                          : ""
                      }}`}
                      onClick={() => {
                        navigate("/admin/user/all"), clostHandleList();
                      }}
                    >
                      <Icon
                        icon="solar:user-id-outline"
                        className="text-slate-500 text-xl"
                      />

                      <span className="ml-3">Staff</span>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="border-t flex p-3">
            <Popover
              showArrow
              placement="right"
              classNames={{
                base: ["p-0 rounded-sm"],
                content: ["p-0 mx-2 rounded-sm"],
              }}
            >
              <PopoverTrigger>
                <img src={accountant} alt="" className="w-9 h-9 rounded-md" />
              </PopoverTrigger>

              <PopoverContent>
                {expanded === false && (
                  <Listbox
                    aria-label="Actions"
                    className="rounded-sm"
                    itemClasses={{
                      base: "p-1 rounded-sm",
                    }}
                  >
                    <ListboxItem
                      onClick={() => navigate("/admin/account/overview")}
                    >
                      <div className="flex justify-between">
                        <li className={`my-1 ml-2 text-start  rounded-md`}>
                          Overview
                        </li>
                      </div>
                    </ListboxItem>
                    <ListboxItem
                      onClick={() => navigate("/admin/discount/all")}
                    >
                      <div className="flex justify-between">
                        <li className={`my-1 ml-2 text-start  rounded-md`}>
                          Discount
                        </li>
                      </div>
                    </ListboxItem>
                    <ListboxItem onClick={() => navigate("/admin/tax/all")}>
                      <div className="flex justify-between">
                        <li className={`my-1 ml-2 text-start  rounded-md`}>
                          Tax
                        </li>
                      </div>
                    </ListboxItem>
                    <ListboxItem onClick={() => navigate("/admin/opex/all")}>
                      <div className="flex justify-between">
                        <li className={`my-1 ml-2 text-start  rounded-md`}>
                          Opex
                        </li>
                      </div>
                    </ListboxItem>
                    <ListboxItem
                      onClick={() => navigate("/admin/fixed-cost/all")}
                    >
                      <div className="flex justify-between">
                        <li className="my-1 text-start ml-2">Fixed-Cost</li>
                      </div>
                    </ListboxItem>
                    <ListboxItem
                      onClick={() => navigate("/admin/variable-cost/all")}
                    >
                      <div className="flex justify-between">
                        <li className="my-1 text-start ml-2">Variable-Cost</li>
                      </div>
                    </ListboxItem>
                    <ListboxItem onClick={() => navigate("/admin/waste/all")}>
                      <div className="flex justify-between">
                        <li className="my-1 text-start ml-2">Waste</li>
                      </div>
                    </ListboxItem>
                  </Listbox>
                )}
              </PopoverContent>
            </Popover>
            <div
              className={`
              flex flex-col justify-between items-center
              overflow-hidden duration-1000 transition-all ${
                expanded ? "w-40" : "w-0"
              }
          `}
            >
              <div className=" cursor-pointer mt-2">
                <div
                  className="flex items-center w-32"
                  onClick={() => setAccount(!account)}
                >
                  <h4 className="font-semibold text-md">Accountant</h4>

                  {account ? (
                    <Icon
                      icon="iconamoon:arrow-down-2"
                      className="text-lg ml-2 text-gray-600"
                    />
                  ) : (
                    <Icon
                      icon="iconamoon:arrow-up-2"
                      className="text-lg ml-2 text-gray-600"
                    />
                  )}
                </div>
              </div>
              <div
                className={`
              overflow-hidden transition-all ${account ? "w-40 ml-3" : "w-0"}
          `}
              >
                {account && (
                  <ul className="cursor-pointer mt-2">
                    <li
                      className={`p-1 px-3 flex items-center hover:bg-slate-100 rounded-sm text-md text-slate-500 ${
                        location.pathname === "/admin/account/overview"
                          ? "text-white bg-slate-300 "
                          : ""
                      }}`}
                      onClick={() => {
                        navigate("/admin/account/overview"), clostHandleList();
                      }}
                    >
                      <Icon
                        icon="carbon:account"
                        className="tet-slate-500 text-xl"
                      />

                      <span className="ml-3">Overview</span>
                    </li>
                    <li
                      className={`p-1 px-3 flex items-center hover:bg-slate-100 rounded-sm text-md text-slate-500 ${
                        location.pathname === "/admin/discount/all" ||
                        location.pathname === "/admin/discount/create" ||
                        location.pathname === `/admin/discount/edit/${id}` ||
                        location.pathname === `/admin/discount/detail/${id}`
                          ? "text-white bg-slate-300 "
                          : ""
                      }}`}
                      onClick={() => {
                        navigate("/admin/discount/all"), clostHandleList();
                      }}
                    >
                      <Icon
                        icon="iconamoon:discount"
                        className="tet-slate-500 text-xl"
                      />

                      <span className="ml-3">Discount</span>
                    </li>
                    <li
                      className={`p-1 px-3 flex items-center hover:bg-slate-100 rounded-sm text-md text-slate-500 ${
                        location.pathname === "/admin/tax/all" ||
                        location.pathname === "/admin/tax/create" ||
                        location.pathname === `/admin/tax/edit/${id}` ||
                        location.pathname === `/admin/tax/detail/${id}`
                          ? "text-white bg-slate-300 "
                          : ""
                      }}`}
                      onClick={() => {
                        navigate("/admin/tax/all"), clostHandleList();
                      }}
                    >
                      <Icon
                        icon="material-symbols-light:feed-outline"
                        className="tet-slate-500 text-xl"
                      />

                      <span className="ml-3">Tax</span>
                    </li>
                    <li
                      className={`p-1 px-3 flex items-center hover:bg-slate-100 rounded-sm text-md text-slate-500 ${
                        location.pathname === "/admin/opex/all" ||
                        location.pathname === "/admin/opex/create" ||
                        location.pathname === `/admin/opex/edit/${id}` ||
                        location.pathname === `/admin/opex/detail/${id}`
                          ? "text-white bg-slate-300 "
                          : ""
                      }}`}
                      onClick={() => {
                        navigate("/admin/opex/all"), clostHandleList();
                      }}
                    >
                      <Icon
                        icon="icon-park-outline:table-report"
                        className="tet-slate-500 text-xl"
                      />

                      <span className="ml-3">Opex</span>
                    </li>
                    <li
                      className={`p-1 px-3 flex items-center hover:bg-slate-100 rounded-sm text-md text-slate-500 ${
                        location.pathname === "/admin/fixed-cost/all" ||
                        location.pathname === "/admin/fixed-cost/create" ||
                        location.pathname === `/admin/fixed-cost/edit/${id}` ||
                        location.pathname === `/admin/fixed-cost/detail/${id}`
                          ? "text-white bg-slate-300 "
                          : ""
                      }}`}
                      onClick={() => {
                        navigate("/admin/fixed-cost/all"), clostHandleList();
                      }}
                    >
                      <Icon
                        icon="bi:file-text"
                        className="tet-slate-500 text-xl"
                      />

                      <span className="ml-3">Fixed-Cost</span>
                    </li>
                    <li
                      className={`p-1 px-3 flex items-center hover:bg-slate-100 rounded-sm text-md text-slate-500 ${
                        location.pathname === "/admin/variable-cost/all" ||
                        location.pathname === "/admin/variable-cost/create" ||
                        location.pathname ===
                          `/admin/variable-cost/edit/${id}` ||
                        location.pathname ===
                          `/admin/variable-cost/detail/${id}`
                          ? "text-white bg-slate-300 "
                          : ""
                      }}`}
                      onClick={() => {
                        navigate("/admin/variable-cost/all"), clostHandleList();
                      }}
                    >
                      <Icon
                        icon="lucide:clipboard-list"
                        className="tet-slate-500 text-xl"
                      />

                      <span className="ml-3"> Variable-Cost</span>
                    </li>
                    <li
                      className={`p-1 px-3 flex items-center hover:bg-slate-100 rounded-sm text-md text-slate-500 ${
                        location.pathname === "/admin/waste/all" ||
                        location.pathname === "/admin/waste/create" ||
                        location.pathname === `/admin/waste/edit/${id}` ||
                        location.pathname === `/admin/waste/detail/${id}`
                          ? "text-white bg-slate-300 "
                          : ""
                      }}`}
                      onClick={() => {
                        navigate("/admin/waste/all"), clostHandleList();
                      }}
                    >
                      <Icon
                        icon="fluent:feed-28-regular"
                        className="tet-slate-500 text-xl"
                      />

                      <span className="ml-3">Waste</span>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </nav>
      </aside> */}

      <aside className="overflow-y-scroll custom-scrollbar h-screen">
        <nav className="h-full flex flex-col bg-white w-full">
          <div className="px-4 pb-2 flex justify-between items-center">
            <img
              src={logo}
              className="overflow-hidden duration-1000 transition-all mt-3 w-10"
            />
          </div>

          <div className="border-t flex p-3">
            <div
              className="
              flex flex-col justify-between
              overflow-hidden duration-1000 transition-all w-full
                "
            >
              <div className="cursor-pointer mt-2">
                <h4 className="font-semibold text-md">Inventory</h4>
              </div>
              <div className="overflow-hidden transition-all w-full">
                <ul className="cursor-pointer mt-2 w-full">
                  <li
                    className={`p-1 ml-3 flex items-center hover:bg-slate-100 rounded-sm text-md text-slate-500 ${
                      location.pathname === "/admin/inventory/overview"
                        ? "text-white bg-slate-300 "
                        : ""
                    }}`}
                    onClick={() => {
                      navigate("/admin/inventory/overview"), clostHandleList();
                    }}
                  >
                    <Icon
                      icon="fluent-mdl2:analytics-view"
                      className="text-slate-600 text-xl"
                    />
                    <h3 className="ml-3">OverView</h3>
                  </li>
                  <li
                    className={`p-1 ml-3 flex items-center hover:bg-slate-100 rounded-sm text-md text-slate-500 ${
                      location.pathname === "/admin/products/all" ||
                      location.pathname === "/admin/products/create" ||
                      location.pathname === `/admin/products/edit/${id}` ||
                      location.pathname === `/admin/products/detail/${id}`
                        ? "text-white bg-slate-300 "
                        : ""
                    }}`}
                    onClick={() => {
                      navigate("/admin/products/all"), clostHandleList();
                    }}
                  >
                    <Icon
                      icon="fluent-mdl2:product"
                      className="text-slate-600 text-xl"
                    />

                    <h3 className="ml-3">Product</h3>
                  </li>
                  <li
                    className={`p-1 ml-3 flex items-center hover:bg-slate-100 rounded-sm text-md text-slate-500 ${
                      location.pathname === "/admin/categorys/all" ||
                      location.pathname === "/admin/categorys/create" ||
                      location.pathname === `/admin/categorys/edit/${id}` ||
                      location.pathname === `/admin/categorys/detail/${id}`
                        ? "text-white bg-slate-300 "
                        : ""
                    }}`}
                    onClick={() => {
                      navigate("/admin/categorys/all"), clostHandleList();
                    }}
                  >
                    <Icon
                      icon="tabler:category-plus"
                      className="text-slate-500 text-2xl"
                    />

                    <h3 className="ml-2">Category</h3>
                  </li>
                  <li
                    className={`p-1 ml-3 flex items-center hover:bg-slate-100 rounded-sm text-md text-slate-500 ${
                      location.pathname === "/admin/uom-category/all" ||
                      location.pathname === "/admin/uom-category/create" ||
                      location.pathname === `/admin/uom-category/edit/${id}` ||
                      location.pathname === `/admin/uom-category/detail/${id}`
                        ? "text-white bg-slate-300 "
                        : ""
                    }}`}
                    onClick={() => {
                      navigate("/admin/uom-category/all"), clostHandleList();
                    }}
                  >
                    <Icon
                      icon="carbon:category-new-each"
                      className="text-slate-500 text-2xl"
                    />

                    <h3 className="ml-2">UOM-Cat</h3>
                  </li>
                  <li
                    className={`p-1 ml-3 flex items-center hover:bg-slate-100 rounded-sm text-md text-slate-500 ${
                      location.pathname === "/admin/stock/all" ||
                      location.pathname === "/admin/stock/create" ||
                      location.pathname === `/admin/stock/edit/${id}` ||
                      location.pathname === `/admin/stock/detail/${id}`
                        ? "text-white bg-slate-300 "
                        : ""
                    }}`}
                    onClick={() => {
                      navigate("/admin/stock/all"), clostHandleList();
                    }}
                  >
                    <Icon
                      icon="healthicons:rdt-result-out-stock-outline"
                      className="text-slate-500 text-2xl"
                    />

                    <h3 className="ml-2">Stock</h3>
                  </li>
                  <li
                    className={`p-1 ml-3 flex items-center hover:bg-slate-100 rounded-sm text-md text-slate-500 ${
                      location.pathname === "/admin/adjustment/view"
                        ? "text-white bg-slate-300 "
                        : ""
                    }}`}
                    onClick={() => {
                      navigate("/admin/adjustment/view"), clostHandleList();
                    }}
                  >
                    <Icon
                      icon="tabler:adjustments-horizontal"
                      className="text-slate-500 text-xl"
                    />

                    <h3 className="ml-3">Adjustment</h3>
                  </li>
                  <li
                    className={`p-1 ml-3 flex items-center hover:bg-slate-100 rounded-sm text-md text-slate-500 ${
                      location.pathname === "/admin/locations/all" ||
                      location.pathname === "/admin/locations/create" ||
                      location.pathname === `/admin/locations/edit/${id}` ||
                      location.pathname === `/admin/locations/detail/${id}`
                        ? "text-white bg-slate-300 "
                        : ""
                    }}`}
                    onClick={() => {
                      navigate("/admin/locations/all"), clostHandleList();
                    }}
                  >
                    <Icon
                      icon="ep:location"
                      className="text-slate-600 text-xl"
                    />
                    <h3 className="ml-3">Location</h3>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t flex p-3">
            <div
              className="flex flex-col justify-between w-full
              overflow-hidden duration-1000 transition-all"
            >
              <h4 className="font-semibold text-md">Purchase</h4>

              <div className="overflow-hidden transition-all w-full">
                <ul className="cursor-pointer mt-2">
                  <li
                    className={`p-1 px-3 flex items-center hover:bg-slate-100 rounded-sm text-md text-slate-500 ${
                      location.pathname === "/admin/purchase/view"
                        ? "text-white bg-slate-300 "
                        : ""
                    }}`}
                    onClick={() => {
                      navigate("/admin/purchase/view"), clostHandleList();
                    }}
                  >
                    <Icon
                      icon="uim:analytics"
                      className="text-slate-500 text-xl"
                    />

                    <span className="ml-3">Overview</span>
                  </li>
                  <li
                    className={`p-1 px-3 flex items-center hover:bg-slate-100 rounded-sm text-md text-slate-500 ${
                      location.pathname === "/admin/purchase/all" ||
                      location.pathname === "/admin/purchase/create" ||
                      location.pathname === `/admin/purchase/detail/${id}`
                        ? "text-white bg-slate-300 "
                        : ""
                    }}`}
                    onClick={() => {
                      navigate("/admin/purchase/all"), clostHandleList();
                    }}
                  >
                    <Icon
                      icon="icons8:buy"
                      className="text-slate-500 text-xl"
                    />
                    <span className="ml-3"> Purchase</span>
                  </li>
                  <li
                    className={`p-1 px-3 flex items-center rounded-sm text-md hover:bg-slate-100 text-slate-500 ${
                      location.pathname === "/admin/customers/vendors" ||
                      location.pathname === `/admin/customers/detail/${id}`
                        ? "text-white bg-slate-300 "
                        : ""
                    }}`}
                    onClick={() => {
                      navigate("/admin/customers/vendors"), clostHandleList();
                    }}
                  >
                    <Icon icon="ph:user" className="text-slate-500 text-xl" />

                    <span className="ml-3">Vendor</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t flex p-3">
            <div
              className="flex flex-col justify-between w-full
              overflow-hidden duration-1000 transition-all "
            >
              <div className=" cursor-pointer mt-2">
                <h4 className="font-semibold text-md">Sale</h4>
              </div>
              <div className="overflow-hidden transition-all w-full">
                <ul className="cursor-pointer mt-2">
                  <li
                    className={`p-1 px-3 flex items-center hover:bg-slate-100 rounded-sm text-md text-slate-500 ${
                      location.pathname === "/admin/saleorders/view"
                        ? "text-white bg-slate-300 "
                        : ""
                    }}`}
                    onClick={() => {
                      navigate("/admin/saleorders/view"), clostHandleList();
                    }}
                  >
                    <Icon
                      icon="uim:analytics"
                      className="text-slate-500 text-xl"
                    />
                    <span className="ml-3">Overview</span>
                  </li>
                  <li
                    className={`p-1 px-3 flex hover:bg-slate-100 items-center rounded-sm text-md text-slate-500 ${
                      location.pathname === "/admin/saleorders/all" ||
                      location.pathname === "/admin/saleorders/create" ||
                      location.pathname === `/admin/saleorders/detail/${id}`
                        ? "text-white bg-slate-300 "
                        : ""
                    }}`}
                    onClick={() => {
                      navigate("/admin/saleorders/all"), clostHandleList();
                    }}
                  >
                    <Icon
                      icon="icon-park-outline:buy"
                      className="text-slate-500 text-xl"
                    />

                    <span className="ml-3">SaleOrders</span>
                  </li>
                  <li
                    className={`p-1 px-3 flex items-center hover:bg-slate-100 rounded-sm text-md text-slate-500 ${
                      location.pathname === "/admin/customers/all"
                        ? "text-white bg-slate-300 "
                        : ""
                    }}`}
                    onClick={() => {
                      navigate("/admin/customers/all"), clostHandleList();
                    }}
                  >
                    <Icon icon="ph:user" className="text-slate-500 text-xl" />
                    <span className="ml-3">Customers</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t flex p-3">
            <div
              className="flex flex-col justify-between w-full
              overflow-hidden duration-1000 transition-all"
            >
              <h4 className="font-semibold text-md">Stakeholders</h4>

              <div className="overflow-hidden transition-all w-full">
                <ul className="cursor-pointer mt-2">
                  <li
                    className={`p-1 px-3 flex items-center rounded-sm hover:bg-slate-100 text-md text-slate-500 ${
                      location.pathname === "/admin/partners/all" ||
                      location.pathname === "/admin/partners/create" ||
                      location.pathname === `/admin/partners/edit/${id}` ||
                      location.pathname === `/admin/partners/detail/${id}`
                        ? "text-white bg-slate-300 "
                        : ""
                    }}`}
                    onClick={() => {
                      navigate("/admin/partners/all"), clostHandleList();
                    }}
                  >
                    <Icon
                      icon="ph:users-three"
                      className="text-slate-500 text-xl"
                    />

                    <span className="ml-3">Partner</span>
                  </li>
                  <li
                    className={`p-1 px-3 flex items-center hover:bg-slate-100 rounded-sm text-md text-slate-500 ${
                      location.pathname === "/admin/employee/all" ||
                      location.pathname === "/admin/employee/create" ||
                      location.pathname === `/admin/employee/edit/${id}` ||
                      location.pathname === `/admin/employee/detail/${id}`
                        ? "text-white bg-slate-300 "
                        : ""
                    }}`}
                    onClick={() => {
                      navigate("/admin/employee/all"), clostHandleList();
                    }}
                  >
                    <Icon
                      icon="clarity:employee-line"
                      className="text-slate-500 text-xl"
                    />
                    <span className="ml-3">Employee</span>
                  </li>
                  <li
                    className={`p-1 px-3 flex items-center hover:bg-slate-100 rounded-sm text-md text-slate-500 ${
                      location.pathname === "/admin/user/all" ||
                      location.pathname === "/admin/user/create" ||
                      location.pathname === `/admin/user/edit/${id}` ||
                      location.pathname === `/admin/user/detail/${id}`
                        ? "text-white bg-slate-300 "
                        : ""
                    }}`}
                    onClick={() => {
                      navigate("/admin/user/all"), clostHandleList();
                    }}
                  >
                    <Icon
                      icon="solar:user-id-outline"
                      className="text-slate-500 text-xl"
                    />

                    <span className="ml-3">Staff</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t flex p-3">
            <div
              className="flex flex-col justify-between w-full
                 overflow-hidden duration-1000 transition-all "
            >
              <h4 className="font-semibold text-md text-start">Accountant</h4>

              <div className="overflow-hidden transition-all w-full">
                <ul className="cursor-pointer mt-2">
                  <li
                    className={`p-1 px-3 flex items-center hover:bg-slate-100 rounded-sm text-md text-slate-500 ${
                      location.pathname === "/admin/account/overview"
                        ? "text-white bg-slate-300 "
                        : ""
                    }}`}
                    onClick={() => {
                      navigate("/admin/account/overview"), clostHandleList();
                    }}
                  >
                    <Icon
                      icon="carbon:account"
                      className="tet-slate-500 text-xl"
                    />

                    <span className="ml-3">Overview</span>
                  </li>
                  <li
                    className={`p-1 px-3 flex items-center hover:bg-slate-100 rounded-sm text-md text-slate-500 ${
                      location.pathname === "/admin/discount/all" ||
                      location.pathname === "/admin/discount/create" ||
                      location.pathname === `/admin/discount/edit/${id}` ||
                      location.pathname === `/admin/discount/detail/${id}`
                        ? "text-white bg-slate-300 "
                        : ""
                    }}`}
                    onClick={() => {
                      navigate("/admin/discount/all"), clostHandleList();
                    }}
                  >
                    <Icon
                      icon="iconamoon:discount"
                      className="tet-slate-500 text-xl"
                    />

                    <span className="ml-3">Discount</span>
                  </li>
                  <li
                    className={`p-1 px-3 flex items-center hover:bg-slate-100 rounded-sm text-md text-slate-500 ${
                      location.pathname === "/admin/opex/all" ||
                      location.pathname === "/admin/opex/create" ||
                      location.pathname === `/admin/opex/edit/${id}` ||
                      location.pathname === `/admin/opex/detail/${id}`
                        ? "text-white bg-slate-300 "
                        : ""
                    }}`}
                    onClick={() => {
                      navigate("/admin/opex/all"), clostHandleList();
                    }}
                  >
                    <Icon
                      icon="icon-park-outline:table-report"
                      className="tet-slate-500 text-xl"
                    />

                    <span className="ml-3">Opex</span>
                  </li>
                  <li
                    className={`p-1 px-3 flex items-center hover:bg-slate-100 rounded-sm text-md text-slate-500 ${
                      location.pathname === "/admin/fixed-cost/all" ||
                      location.pathname === "/admin/fixed-cost/create" ||
                      location.pathname === `/admin/fixed-cost/edit/${id}` ||
                      location.pathname === `/admin/fixed-cost/detail/${id}`
                        ? "text-white bg-slate-300 "
                        : ""
                    }}`}
                    onClick={() => {
                      navigate("/admin/fixed-cost/all"), clostHandleList();
                    }}
                  >
                    <Icon
                      icon="bi:file-text"
                      className="tet-slate-500 text-xl"
                    />

                    <span className="ml-3">Fixed-Cost</span>
                  </li>
                  <li
                    className={`p-1 px-3 flex items-center hover:bg-slate-100 rounded-sm text-md text-slate-500 ${
                      location.pathname === "/admin/variable-cost/all" ||
                      location.pathname === "/admin/variable-cost/create" ||
                      location.pathname === `/admin/variable-cost/edit/${id}` ||
                      location.pathname === `/admin/variable-cost/detail/${id}`
                        ? "text-white bg-slate-300 "
                        : ""
                    }}`}
                    onClick={() => {
                      navigate("/admin/variable-cost/all"), clostHandleList();
                    }}
                  >
                    <Icon
                      icon="lucide:clipboard-list"
                      className="tet-slate-500 text-xl"
                    />

                    <span className="ml-3"> Variable-Cost</span>
                  </li>
                  <li
                    className={`p-1 px-3 flex items-center hover:bg-slate-100 rounded-sm text-md text-slate-500 ${
                      location.pathname === "/admin/waste/all" ||
                      location.pathname === "/admin/waste/create" ||
                      location.pathname === `/admin/waste/edit/${id}` ||
                      location.pathname === `/admin/waste/detail/${id}`
                        ? "text-white bg-slate-300 "
                        : ""
                    }}`}
                    onClick={() => {
                      navigate("/admin/waste/all"), clostHandleList();
                    }}
                  >
                    <Icon
                      icon="fluent:feed-28-regular"
                      className="tet-slate-500 text-xl"
                    />

                    <span className="ml-3">Waste</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}
