import React, { useEffect, useState } from "react";
import Pos from "../../assets/logo.png";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { BiCategory } from "react-icons/bi";
import { AiOutlineStock } from "react-icons/ai";
import { HiOutlineAdjustments } from "react-icons/hi";
import { PiUsersThree } from "react-icons/pi";

import userIcons from "../../assets/user.jpeg";
import { useDispatch, useSelector } from "react-redux";
import { Icon } from "@iconify/react";
import { removeData } from "../../redux/actions";
import { getApi } from "../Api";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import SideBar from "../utils/SideBar";

export default function Admin() {
  const location = useLocation();
  const { id } = useParams();
  const [usr, setUsr] = useState(null);
  const [expand, setExpand] = useState(true);

  const handleBar = () => {
    setExpand(!expand);
  };

  const user = useSelector((state) => state.loginData);
  const token = useSelector((state) => state.IduniqueData);
  const dipatch = useDispatch();

  const navigate = useNavigate();

  const singleUserApi = async () => {
    let resData = await getApi(`/user/${user._id}`, token.accessToken);

    if (resData.message == "Token Expire , Please Login Again") {
      dipatch(removeData(null));
    }
    if (resData.status) {
      setUsr(resData.data[0]);
    }
  };

  useEffect(() => {
    singleUserApi();
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b-2 border-b-slate-200">
        <div className="flex items-center justify-between py-2 w-full  cursor-pointer">
          {/* {(user.role && user.role.name === "admin") ||
          user.role.name === "root" ? (
            <Link to={"/admin/inventory/overview"}>
              <img
                src={Pos}
                alt="pos"
                className="w-16 h-14 rounded-full shadow-sm items-center ml-14"
              />
            </Link>
          ) : (
            <img
              src={user.image ? user.image : Pos}
              alt="pos"
              className="w-16 h-14 rounded-full shadow-sm items-center ml-14"
            />
          )} */}
          <span></span>

          <div className="flex w-2/5 justify-end lg:mr-[30px] md:mr-[80px] items-center px-3">
            {(user.role && user.role.name === "admin") ||
            user.role.name === "root" ? (
              <>
                <Link to="/admin/pos/all">
                  <Icon
                    icon="arcticons:jiopos-lite"
                    className={`text-3xl rounded-full p-1 text-slate-500 shadow-md ${
                      location.pathname === "/admin/pos/all"
                        ? "text-white bg-blue-500 font-extrabold"
                        : ""
                    }}`}
                  />
                </Link>

                <Link to="/admin/user/all">
                  <PiUsersThree
                    className={`text-3xl rounded-full p-1 mx-3 text-slate-500 shadow-md ${
                      location.pathname === "/admin/user/all" ||
                      location.pathname === "/admin/user/create" ||
                      location.pathname === `/admin/user/detail/${id}` ||
                      location.pathname === `/admin/user/edit/${id}`
                        ? "text-white bg-blue-500 font-extrabold"
                        : ""
                    }}`}
                  />
                </Link>

                <Link to="/admin/warehouse">
                  <Icon
                    icon="maki:warehouse"
                    className={`text-3xl rounded-full p-1 shadow-md text-slate-400 font-bold ${
                      location.pathname === "/admin/warehouse" &&
                      "bg-blue-500 text-white"
                    }`}
                  />
                </Link>
              </>
            ) : null}

            <Dropdown>
              <DropdownTrigger>
                <Icon
                  icon="basil:invoice-outline"
                  className={`text-3xl ml-3 rounded-full text-slate-400 p-1 shadow-md ${
                    location.pathname === "/admin/opex/all" ||
                    location.pathname === "/admin/opex/create" ||
                    location.pathname === `/admin/opex/detail/${id}` ||
                    location.pathname === "/admin/fixed-cost/all" ||
                    location.pathname === "/admin/fixed-cost/create" ||
                    location.pathname === `/admin/fixed-cost/detail/${id}` ||
                    location.pathname === "/admin/variable-cost/all" ||
                    location.pathname === "/admin/variable-cost/create" ||
                    location.pathname === `/admin/variable-cost/detail/${id}` ||
                    location.pathname === "/admin/waste/all" ||
                    location.pathname === "/admin/waste/create" ||
                    location.pathname === `/admin/waste/detail/${id}`
                      ? "text-white bg-blue-500 font-extrabold"
                      : ""
                  }}`}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Action event example">
                <DropdownItem onPress={() => navigate("/admin/opex/all")}>
                  Opex
                </DropdownItem>
                <DropdownItem onPress={() => navigate("/admin/fixed-cost/all")}>
                  Fixed Cost
                </DropdownItem>
                <DropdownItem
                  onPress={() => navigate("/admin/variable-cost/all")}
                >
                  Variable Cost
                </DropdownItem>
                <DropdownItem onPress={() => navigate("/admin/waste/all")}>
                  Waste
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>

            <div className="flex items-center mx-3">
              {user && (
                <>
                  <img
                    src={user.image ? user.image : userIcons}
                    alt="User Icon"
                    className="w-12 h-10 rounded-full shadow-sm hover:opacity-75"
                    onError={(e) => {
                      e.target.src = userIcons;
                    }}
                  />

                  <Dropdown>
                    <DropdownTrigger>
                      <div className="flex items-center">
                        <h3 className="font-semibold text-slate-500 text-md ml-2">
                          {user.username}
                        </h3>
                        <Icon
                          icon="iconamoon:arrow-down-2"
                          className="text-2xl ml- 2 text-slate-400"
                        />
                      </div>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Static Actions">
                      <DropdownItem
                        key="new"
                        onPress={() => navigate(`/admin/user/info/${user._id}`)}
                      >
                        Setting
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {(user.role && user.role.name === "admin") ||
      user.role.name === "root" ? (
        <div className="w-full flex relative z-50">
          <div
            className={`fixed top-0 shadow-md left-0 bottom-0 bg-white p-1 flex flex-col transform transition-transform duration-500 ease-in-out`}
          >
            <SideBar handleSideBar={handleBar} />
          </div>
        </div>
      ) : null}
      <div
        className={`mt-14 mx-auto p-4 ${
          (user.role && user.role.name === "admin") || user.role.name === "root"
            ? "ml-20"
            : ""
        }`}
      >
        <Outlet />
      </div>
    </>
  );
}
