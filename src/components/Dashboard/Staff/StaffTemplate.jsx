import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../Api";
import StaffList from "./StaffList.";
import { Link } from "react-router-dom";
import SearchCompo from "../../utils/SearchCompo";
import FilterBox from "./FilterBox";

export default function StaffTemplate() {
  const [staff, setSaff] = useState([]);
  const [filteredKeywords, setFilteredKeywords] = useState({
    name: "",
    email: "",
    gender: "",
    city: "",
    lastlogin: "",
    phone: "",
    address: "",
    birthdate: "",
  });

  const token = useSelector((state) => state.IduniqueData);

  const STAFF_API = {
    INDEX: BASE_URL + "/user",
  };

  const fetchStaffData = async () => {
    try {
      const response = await axios.get(STAFF_API.INDEX, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      const filteredUser = response.data?.data.filter(
        (em) => em.active === true
      );
      setSaff(filteredUser);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchStaffData();
  }, [token]);

  const handleFilterChange = (selected) => {
    setFilteredKeywords((prevFilter) => ({
      ...prevFilter,
      ...selected,
    }));
  };
  const filteredStaffs = useMemo(
    () =>
      staff.filter((stf) => {
        const { name, phone, address, city, email, gender, birthdate } =
          filteredKeywords;

        const isName = () => {
          if (!name) {
            return true;
          }

          if (stf.username) {
            return stf.username.toLowerCase().includes(name.toLowerCase());
          }

          return false;
        };
        const isEmail = () => {
          if (!email) {
            return true;
          }

          if (stf.email) {
            return stf.email.toLowerCase().includes(email.toLowerCase());
          }
          return false;
        };
        const isGender = () => {
          if (!gender) {
            return true;
          }

          if (stf.gender) {
            return stf.gender.toLowerCase() === gender.toLowerCase();
          }
          return false;
        };
        const isCity = () => {
          if (!city) {
            return true;
          }

          if (stf.city) {
            return stf.city.toLowerCase().includes(city.toLowerCase());
          }
          return false;
        };

        const isPhone = () => {
          if (!phone) {
            return true;
          }
          if (stf.phone) {
            return stf.phone.includes(phone);
          }

          return false;
        };
        const isAddress = () => {
          if (!address) {
            return true;
          }

          if (stf.address) {
            return stf.address.toLowerCase().includes(address.toLowerCase());
          }
          return false;
        };
        const isBirth = () => {
          if (!birthdate) {
            return true;
          }

          if (stf.birthdate) {
            const birthDatePart = stf.birthdate.split("T")[0];
            console.log("change date type", birthdate);
            return birthDatePart === birthdate;
          }
          return false;
        };

        return (
          isName() &&
          isPhone() &&
          isAddress() &&
          isCity() &&
          isEmail() &&
          isGender() &&
          isBirth()
        );
      }),
    [staff, filteredKeywords]
  );

  return (
    <>
      <div className="flex justify-between items-center my-3">
        <SearchCompo
          keyword={filteredKeywords.name}
          onSearch={handleFilterChange}
        />

        <div className="flex">
          <Link
            to="/admin/user/create"
            className="font-bold rounded-sm shadow-sm flex items-center text-blue-700 border-blue-500 border-2 hover:opacity-75 text-sm hover:text-white hover:bg-blue-700 px-3 py-1.5"
          >
            Add
          </Link>
          <FilterBox onFilter={handleFilterChange} />
        </div>
      </div>
      <StaffList staffs={filteredStaffs} onDeleteSuccess={fetchStaffData} />
    </>
  );
}
