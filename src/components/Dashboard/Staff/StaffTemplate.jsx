import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../Api";
import StaffList from "./StaffList.";

export default function StaffTemplate() {
  const [staff, setSaff] = useState([]);
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
  return (
    <>
      <StaffList staffs={staff} onDeleteSuccess={fetchStaffData} />
    </>
  );
}
