import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../Api";
import EmployeeList from "./EmployeeList";
import { useNavigate } from "react-router-dom";
import FilterBox from "./FilterBox";
import SearchBox from "./SearchBox";
import { Button } from "@nextui-org/react";

export default function EmployeeTemplate() {
  const [employee, setEmployee] = useState([]);
  const [filteredKeywords, setFilteredKeywords] = useState({
    name: "",
    email: "",
    gender: "",
    city: "",
    phone: "",
    address: "",
    birthdate: "",
  });
  const navigate = useNavigate();
  const token = useSelector((state) => state.IduniqueData);

  const EMPLOYEE_API = {
    INDEX: BASE_URL + "/employee",
  };

  const fetchEmployeeData = async () => {
    try {
      const response = await axios.get(EMPLOYEE_API.INDEX, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      const filterEmployeeActive = response.data?.data.filter(
        (emp) => emp.active === true
      );
      setEmployee(filterEmployeeActive);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchEmployeeData();
  }, [token]);

  const handleFilterChange = (selected) => {
    setFilteredKeywords((prevFilter) => ({
      ...prevFilter,
      ...selected,
    }));
  };
  const filteredEmployee = useMemo(
    () =>
      employee.filter((emp) => {
        const { name, phone, address, city, email, gender, birthdate } =
          filteredKeywords;

        const isName = () => {
          if (!name) {
            return true;
          }

          if (emp.name) {
            return emp.name.toLowerCase().includes(name.toLowerCase());
          }

          return false;
        };

        const isEmail = () => {
          if (!email) {
            return true;
          }

          if (emp.email) {
            return emp.email.toLowerCase().includes(email.toLowerCase());
          }
          return false;
        };

        const isGender = () => {
          if (!gender) {
            return true;
          }
          if (emp.gender) {
            return emp.gender.toLowerCase() === gender.toLowerCase();
          }
          return false;
        };
        const isCity = () => {
          if (!city) {
            return true;
          }
          if (emp.city) {
            return emp.city.toLowerCase().includes(city.toLowerCase());
          }
          return false;
        };

        const isPhone = () => {
          if (!phone) {
            return true;
          }
          if (emp.phone) {
            return emp.phone.includes(phone);
          }

          return false;
        };

        const isAddress = () => {
          if (!address) {
            return true;
          }

          if (emp.address) {
            return emp.address.toLowerCase().includes(address.toLowerCase());
          }
          return false;
        };
        const isBirth = () => {
          if (!birthdate) {
            return true;
          }

          if (emp.birthdate) {
            const birthDatePart = emp.birthdate.split("T")[0];
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
    [employee, filteredKeywords]
  );

  return (
    <>
      <div className="flex justify-between items-center my-3">
        <SearchBox
          keyword={filteredKeywords.name}
          onSearch={handleFilterChange}
        />

        <div className="flex">
          <Button
            size="sm"
            onClick={() => navigate("/admin/employee/create")}
            className="font-bold rounded-sm shadow-sm flex items-center bg-zinc-50 text-blue-700 border-blue-500 border-2 hover:opacity-75 text-sm hover:text-white hover:bg-blue-700 px-3 py-1.5"
          >
            Add
          </Button>
          <FilterBox onFilter={handleFilterChange} />
        </div>
      </div>
      <EmployeeList
        employees={filteredEmployee}
        onDeleteSuccess={fetchEmployeeData}
      />
    </>
  );
}
