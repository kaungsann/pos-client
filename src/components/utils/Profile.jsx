import { useEffect, useState } from "react";
import { BASE_URL } from "../Api";
import { useDispatch, useSelector } from "react-redux";
import { removeData } from "../../redux/actions";
import { BiSolidUser } from "react-icons/bi";
import { IoLogOutSharp } from "react-icons/io5";
import { TiBusinessCard } from "react-icons/ti";
import DeleteAlert from "./DeleteAlert";

import "react-toastify/dist/ReactToastify.css";
import user from "../../assets/user.jpeg";
import EditBusinessInfo from "./EditBusinessInfo";
import CompanyInfo from "./CompanyInfo";
import PersonalEdit from "./PersonalEdit";
import axios from "axios";

export default function Profile() {
  const [userInfo, setUserInfo] = useState([]);
  const [logout, setLogout] = useState(false);
  const dispatch = useDispatch();
  const [activeSection, setActiveSection] = useState("personal");

  const userData = useSelector((state) => state.loginData);

  const token = useSelector((state) => state.IduniqueData);
  const isPageRefreshed = useSelector((state) => state.refresh);

  const handlePersonalSectionClick = () => {
    setActiveSection("personal");
  };

  const handleCompanyRegister = () => {
    setActiveSection("company");
  };

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
          dispatch(removeData(null));
        }

        setUserInfo(data.data[0]);
      } catch (error) {
        console.error("Error fetching admin info:", error);
      }
    };

    fetchData();
  }, [isPageRefreshed, token]);

  return (
    <>
      <div
        className={`flex mb-8 ${
          userInfo.role && userInfo.role.name == "user" ? "mt-3" : ""
        }`}
      >
        <div className="w-1/4 flex flex-col justify-items-center items-center p-4 bg-white shadow-md h-screen">
          <div className="relative">
            <img
              loading="eager | lazy"
              src={userInfo.image ? userInfo.image : user}
              alt="image"
              className="w-40 h-36 rounded-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = user;
              }}
            />
          </div>
          <div className="text-center">
            <h3 className="font-bold text-2xl mt-2">{userInfo.username}</h3>
          </div>
          <div className="w-full mt-6">
            <div
              className={`flex w-full cursor-pointer py-2 items-center justify-start rounded-2xl ${
                activeSection === "personal"
                  ? "bg-blue-100 font-bold"
                  : "text-slate-400"
              }`}
              onClick={handlePersonalSectionClick}
            >
              <BiSolidUser
                className={`text-2xl font-bold  mx-4 ${
                  activeSection === "personal"
                    ? "text-blue-500"
                    : "text-slate-500"
                }`}
              />
              <h3
                className={`text-lg ${
                  activeSection === "personal"
                    ? "text-slate-800 font-bold"
                    : "text-slate-500"
                }`}
              >
                Personal Information
              </h3>
            </div>

            {(userInfo.role && userInfo.role.name == "admin") ||
              ("root" && (
                <>
                  <div
                    className={`flex py-2  mt-4 cursor-pointer w-full items-center justify-start rounded-2xl ${
                      activeSection === "company"
                        ? "bg-blue-100 font-bold"
                        : "text-slate-400"
                    }`}
                    onClick={handleCompanyRegister}
                  >
                    <TiBusinessCard
                      className={`text-2xl font-bold  mx-4 ${
                        activeSection === "company"
                          ? "text-blue-500"
                          : "text-slate-500"
                      }`}
                    />
                    <h3
                      className={`text-lg ${
                        activeSection === "company"
                          ? "text-slate-800 font-bold"
                          : "text-slate-500"
                      }`}
                    >
                      Company Information
                    </h3>
                  </div>
                </>
              ))}

            <div
              className={`flex w-full cursor-pointer mt-4 py-2 items-center justify-start rounded-2xl ${
                logout ? "bg-blue-100 font-bold" : "text-slate-400"
              }}`}
              onClick={() => {
                setLogout(true), setActiveSection(null);
              }}
            >
              <IoLogOutSharp
                className={`text-2xl font-bold mx-4 ${
                  logout ? "text-blue-500" : "text-slate-600"
                }`}
              />
              <h3
                className={`text-lg ${
                  logout ? "text-slate-800 font-bold" : "text-slate-500"
                }`}
              >
                Logout
              </h3>
            </div>
          </div>
        </div>
        <div className="ml-6 w-3/4 bg-white">
          {activeSection === "personal" && <PersonalEdit />}
          {activeSection === "company" && (
            <>
              <CompanyInfo />
            </>
          )}
          {activeSection === "EditInfo" && (
            <>
              <EditBusinessInfo />
            </>
          )}
        </div>
      </div>
      {logout && (
        <DeleteAlert
          cancel={() => {
            setActiveSection("personal");
            setLogout(false);
          }}
          text="Do you want to logout. Pls confirm it"
          onDelete={() => {
            dispatch(removeData(null));
            // dispatch(clearUserStorage());
          }}
        />
      )}
    </>
  );
}
