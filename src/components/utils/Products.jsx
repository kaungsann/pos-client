import React, { useState } from "react";
import Card from "../utils/Card";

export default function Products({ pd }) {
  const [search, setSearch] = useState("");
  return (
    <>
      <div className="flex flex-wra44 mt-6">
        {pd.length > 0 &&
          pd
            .filter((item) =>
              search.toLowerCase === ""
                ? item
                : item.name.toLowerCase().includes(search)
            )
            .map((pd) => (
              <Card key={pd._id} product={pd} className="bg-slate-600" />
            ))}
      </div>
    </>
  );
}
