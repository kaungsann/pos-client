import { createContext, useContext, useState } from "react";

const RefreshContext = createContext();
export const useRefreshContext = () => useContext(RefreshContext);

export default function RefreshProvider(props) {
  const [refresh, setRefesh] = useState(false);

  return (
    <RefreshContext.Provider value={{ refresh, setRefesh }}>
      {props.children}
    </RefreshContext.Provider>
  );
}
