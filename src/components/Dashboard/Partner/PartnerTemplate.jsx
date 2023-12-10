import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../Api";
import PartnerList from "./PartnerList";

export default function PartnerTemplate() {
  const [partner, setPartner] = useState([]);
  const token = useSelector((state) => state.IduniqueData);

  const PARTNER_API = {
    INDEX: BASE_URL + "/partner",
  };

  const fetchPartnerData = async () => {
    try {
      const response = await axios.get(PARTNER_API.INDEX, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      const filteredPartner = response.data?.data.filter(
        (ct) => ct.active === true
      );
      setPartner(filteredPartner);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchPartnerData();
  }, [token]);
  return (
    <>
      <PartnerList partners={partner} onDeleteSuccess={fetchPartnerData} />
    </>
  );
}
