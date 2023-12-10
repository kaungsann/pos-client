import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../Api";
import EmployeeList from "./EmployeeList";

export default function EmployeeTemplate() {
  const [employee, setEmployee] = useState([]);
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
      const filteredEmployees = response.data?.data.filter(
        (em) => em.active === true
      );
      setEmployee(filteredEmployees);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchEmployeeData();
  }, [token]);
  return (
    <>
      <EmployeeList employees={employee} onDeleteSuccess={fetchEmployeeData} />
    </>
  );
}
