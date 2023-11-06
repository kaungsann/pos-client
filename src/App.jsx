import Login from "./components/Login";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import ProductsAll from "./components/Dashboard/Products/ProductsAll";
import ProductsCreate from "./components/Dashboard/Products/ProductsCreate";
import ProductsEdit from "./components/Dashboard/Products/ProductsEdit";
import ProductDetails from "./components/Dashboard/Products/ProductDetails";
import CategoryAll from "./components/Dashboard/Category/CategoryAll";
import CategoryCreate from "./components/Dashboard/Category/CategoryCreate";
import CategoryEdit from "./components/Dashboard/Category/CategoryEdit";
import CategoryDetail from "./components/Dashboard/Category/CategoryDetail";
import PartnerAll from "./components/Dashboard/Partner/PartnerAll";
import PartnerCreate from "./components/Dashboard/Partner/PartnerCreate";
import PartnerEdit from "./components/Dashboard/Partner/PartnerEdit";
import PartnerDetail from "./components/Dashboard/Partner/PartnerDetail";
import LocationAll from "./components/Dashboard/Location/LocationAll";
import LocationCreate from "./components/Dashboard/Location/LocationCreate";
import LocationEdit from "./components/Dashboard/Location/LocationEdit";
import LocationDetail from "./components/Dashboard/Location/LocationDetail";
import SaleOrderAll from "./components/Dashboard/SaleOrder/SaleOrderAll";
import SaleOrderCreate from "./components/Dashboard/SaleOrder/SaleOrderCreate";
import SaleOrderDetail from "./components/Dashboard/SaleOrder/SaleOrderDetail";
import PosItems from "./components/Dashboard/POS/PosItems";
import Register from "./components/Register";
import GuardRouter from "./components/GuardRoute";
import Home from "./components/Home";
import ErrorBoundary from "./components/ErrorBoundary";
import Profile from "./components/utils/Profile";
import OverView from "./components/utils/OverView";
import Customer from "./components/Dashboard/Customer/Customer";
import Vendors from "./components/Dashboard/Customer/Vendors";
import View from "./components/Dashboard/SaleOrder/View";
import PurchaseAll from "./components/Dashboard/Purchase/PurchaseAll";
import PurchaseCreate from "./components/Dashboard/Purchase/PurchaseCreate";
import PurchaseDetail from "./components/Dashboard/Purchase/PurchaseDetail";
import PurchaseView from "./components/Dashboard/Purchase/PurchaseView";
import Stock from "./components/Dashboard/Stock/Stock";
import AdjustmentView from "./components/Dashboard/Ajustment/AjusmentView";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/signin" element={<Login />} />

          <Route path="/" element={<Home />} />
          <Route
            path="/admin"
            element={
              <GuardRouter>
                <Dashboard />
              </GuardRouter>
            }
          >
            <Route path="inventory/overview" element={<OverView />} />
            <Route path="adjustment">
              <Route path="view" element={<AdjustmentView />} />
            </Route>
            <Route path="user">
              <Route path="register" element={<Register />} />
              <Route path="edit/:id" element={<Profile />} />
            </Route>
            <Route path="stock">
              <Route path="all" element={<Stock />} />
            </Route>
            <Route path="purchase">
              <Route path="view" element={<PurchaseView />} />
              <Route path="all" element={<PurchaseAll />} />
              <Route path="create" element={<PurchaseCreate />} />
              <Route path="detail/:id" element={<PurchaseDetail />} />
            </Route>
            <Route path="products">
              <Route path="all" element={<ProductsAll />} />
              <Route path="create" element={<ProductsCreate />} />
              <Route path="edit/:id" element={<ProductsEdit />} />
              <Route path="detail/:id" element={<ProductDetails />} />
            </Route>
            <Route path="categorys">
              <Route path="all" element={<CategoryAll />} />
              <Route path="create" element={<CategoryCreate />} />
              <Route path="edit/:id" element={<CategoryEdit />} />
              <Route path="detail/:id" element={<CategoryDetail />} />
            </Route>
            <Route path="partners">
              <Route path="all" element={<PartnerAll />} />
              <Route path="create" element={<PartnerCreate />} />
              <Route path="edit/:id" element={<PartnerEdit />} />
              <Route path="detail/:id" element={<PartnerDetail />} />
            </Route>
            <Route path="customers">
              <Route path="all" element={<Customer />} />
              <Route path="vendors" element={<Vendors />} />
            </Route>
            <Route path="locations">
              <Route path="all" element={<LocationAll />} />
              <Route path="create" element={<LocationCreate />} />
              <Route path="edit/:id" element={<LocationEdit />} />
              <Route path="detail/:id" element={<LocationDetail />} />
            </Route>
            <Route path="saleorders">
              <Route path="all" element={<SaleOrderAll />} />
              <Route path="view" element={<View />} />
              <Route path="create" element={<SaleOrderCreate />} />
              <Route path="detail/:id" element={<SaleOrderDetail />} />
            </Route>
            <Route path="pos">
              <Route path="all" element={<PosItems />} />
            </Route>
          </Route>
          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
