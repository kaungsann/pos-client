import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const userData = useSelector((state) => state.loginData);
  return userData ? <Component {...rest} /> : <Navigate to="/" />;
};

ProtectedRoute.propTypes = {
  component: PropTypes.elementType,
};

export default ProtectedRoute;
