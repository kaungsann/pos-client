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
} from "@nextui-org/react";
import SideBar from "../utils/SideBar";
import { useRefreshContext } from "../utils/RefreshProvider";

export default function Admin() {
  const { refresh } = useRefreshContext();

  const location = useLocation();
  const { id } = useParams();
  const [usr, setUsr] = useState([]);

  console.log("user is arguments", usr);

  const user = useSelector((state) => state.loginData);
  const token = useSelector((state) => state.IduniqueData);

  console.log("login user is a", user);
  const dipatch = useDispatch();

  const navigate = useNavigate();

  const singleUserApi = async () => {
    let resData = await getApi(`/user/${user._id}`, token.accessToken);

    if (resData.message == "Token Expire , Please Login Again") {
      dipatch(removeData(null));
    }
    console.log("res data is usr", resData);
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
          <span></span>

          <div className="flex w-2/5 justify-end lg:mr-[30px] md:mr-[80px] items-center px-3">
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
              {(user.role && user.role.name === "admin") ||
              user.role.name === "root" ? (
                <Link to="/admin/warehouse">
                  <Icon
                    icon="maki:warehouse"
                    className={`text-3xl rounded-full ml-3 p-1 shadow-md text-slate-400 font-bold ${
                      location.pathname === "/admin/warehouse" &&
                      "bg-blue-500 text-white"
                    }`}
                  />
                </Link>
              ) : null}
            </>

            <div
              className="flex items-center mx-3"
              onClick={() => navigate(`/admin/user/info/${user._id}`)}
            >
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

                  <h3 className="font-semibold text-slate-500 text-md ml-2">
                    {user.username}
                  </h3>
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
            className={`fixed top-0 shadow-md left-0 bottom-0 bg-white flex flex-col transform transition-transform duration-500 ease-in-out`}
          >
            <SideBar />
          </div>
        </div>
      ) : null}
      <div
        className={`mt-14 bg-white h-full	 mx-auto p-4 ${
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
