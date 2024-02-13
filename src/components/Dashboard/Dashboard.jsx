import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

import userIcons from "../../assets/user.jpeg";
import { useDispatch, useSelector } from "react-redux";
import { Icon } from "@iconify/react";
import axios from "axios";
import SideBar from "../utils/SideBar";
import { useEffect, useState } from "react";
import { BASE_URL } from "../Api";
import { removeData } from "../../redux/actions";
import logo from "../../assets/logo.png";

export default function Admin() {
  const location = useLocation();
  const [user, setUser] = useState([]);

  const token = useSelector((state) => state.IduniqueData);

  const isPageRefreshed = useSelector((state) => state.refresh);

  const userData = useSelector((state) => state.loginData);
  const dipatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(BASE_URL + `/user/${userData._id}`, {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
            "Content-Type": "application/json",
          },
        });
        if (data?.message == "Token Expire , Please Login Again") {
          dipatch(removeData(null));
        }

        setUser(data.data[0]);
      } catch (error) {
        console.error("Error fetching admin info:", error);
      }
    };

    fetchData();
  }, [isPageRefreshed]);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b-2 border-b-slate-200">
        <div className="flex items-center justify-between py-2 w-full  cursor-pointer">
          <span>
            <img
              src={logo}
              className="overflow-hidden duration-1000 transition-all w-12 ml-16"
            />
          </span>

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
              {/* {(user.role && user.role.name === "admin") ||
              user.role?.name === "root" ? (
                <Link to="/admin/warehouse">
                  <Icon
                    icon="maki:warehouse"
                    className={`text-3xl rounded-full ml-3 p-1 shadow-md text-slate-400 font-bold ${
                      location.pathname === "/admin/warehouse" &&
                      "bg-blue-500 text-white"
                    }`}
                  />
                </Link>
              ) : null} */}
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
                    className="w-12 h-10 rounded-full object-cover shadow-sm hover:opacity-75"
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
      user.role?.name === "root" ? (
        <div className="w-full flex relative z-40">
          <div
            className={`fixed top-0 shadow-md left-0 bottom-0  bg-white flex flex-col transform transition-transform duration-500 ease-in-out`}
          >
            <SideBar />
          </div>
        </div>
      ) : null}

      <div
        className={`mt-14 mx-auto p-4  bg-[#f5f5f5] h-full ${
          (user.role && user.role?.name === "admin") ||
          user.role?.name === "root"
            ? "ml-48"
            : ""
        }`}
      >
        <Outlet />
      </div>
    </>
  );
}
