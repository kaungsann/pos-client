import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

function GuardRouter({ children }) {
  const userData = useSelector((state) => state.loginData);

  if (userData) {
    return children;
  } else {
    return <Navigate to="/" replace />;
  }
}

export default GuardRouter;

GuardRouter.propTypes = {
  children: PropTypes.object,
};
