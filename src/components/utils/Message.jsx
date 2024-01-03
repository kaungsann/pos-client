import { useEffect, useState } from "react";
import { GoAlertFill } from "react-icons/go";
import { useSelector } from "react-redux";
export default function Message({ message }) {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    if (message) {
      setIsVisible(true);

      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    }
  }, [message]);
  const user = useSelector((state) => state.loginData);
  return (
    <div
      className={`fixed top-40 left-1/2 transform -translate-x-1/2 max-w-sm mx-auto z-50	 bg-red-600 rounded-xl shadow-sm flex items-center space-x-4 p-6 transition-all duration-500 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="shrink-0">
        <GoAlertFill className="text-red-500 text-2xl" />
      </div>
      <div>
        <div className="text-xl font-medium text-black">{user.name}</div>
        <p className="text-slate-500">{message}</p>
      </div>
    </div>
  );
}
