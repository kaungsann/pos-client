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
import Register from "./components/Dashboard/Staff/Register";
import GuardRouter from "./components/GuardRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import Profile from "./components/utils/Profile";
import OverView from "./components/utils/OverView";
import Customer from "./components/Dashboard/Customer/Customer";
import Vendors from "./components/Dashboard/Customer/Vendors";
import View from "./components/Dashboard/SaleOrder/SaleView";
import PurchaseAll from "./components/Dashboard/Purchase/PurchaseAll";
import PurchaseCreate from "./components/Dashboard/Purchase/PurchaseCreate";
import PurchaseDetail from "./components/Dashboard/Purchase/PurchaseDetail";
import PurchaseView from "./components/Dashboard/Purchase/PurchaseView";
import Stock from "./components/Dashboard/Stock/Stock";
import AdjustmentView from "./components/Dashboard/Ajustment/AjusmentView";
import EmployeeAll from "./components/Dashboard/Employee/EmployeeAll";
import EmployeeCreate from "./components/Dashboard/Employee/EmployeeCreate";
import Staff from "./components/Dashboard/Staff/Staff";
import StaffDetail from "./components/Dashboard/Staff/StaffDetail";
import StaffEdit from "./components/Dashboard/Staff/StaffEdit";
import EmployeeDetail from "./components/Dashboard/Employee/EmployeeDetail";
import EmployeeEdit from "./components/Dashboard/Employee/EmployeeEdit";
import Warehouse from "./components/Dashboard/WareHouse/Warehouse";
import SaleView from "./components/Dashboard/SaleOrder/SaleView";
import ProductTemplate from "./components/Product/ProductTemplate";
import CategoryTemplate from "./components/Dashboard/Category/CategoryTemplate";
import StockTemplate from "./components/Dashboard/Stock/StockTemplate";
import AdjustmentTemplate from "./components/Dashboard/Ajustment/AdjustmentTemplate";
import LocationTemplate from "./components/Dashboard/Location/LocationTemplate";
import PurchaseTemplate from "./components/Dashboard/Purchase/PurchaseTemplate";
import SaleTemplate from "./components/Dashboard/SaleOrder/SaleTemplate";
import CustomerTemplate from "./components/Dashboard/Customer/CustomerTemplate";
import VendorTemplate from "./components/Dashboard/Customer/VendorTemplate";
import PartnerTemplate from "./components/Dashboard/Partner/PartnerTemplate";
import EmployeeTemplate from "./components/Dashboard/Employee/EmployeeTemplate";
import WareHouseTemplate from "./components/Dashboard/WareHouse/WareHouseTemplate";
import StaffTemplate from "./components/Dashboard/Staff/StaffTemplate";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/admin"
            element={
              <GuardRouter>
                <Dashboard />
              </GuardRouter>
            }
          >
            <Route path="warehouse" element={<WareHouseTemplate />} />

            <Route path="inventory/overview" element={<OverView />} />
            <Route path="user">
              <Route path="all" element={<StaffTemplate />} />
              <Route path="create" element={<Register />} />
              <Route path="edit/:id" element={<StaffEdit />} />
              <Route path="detail/:id" element={<StaffDetail />} />
            </Route>
            <Route path="adjustment">
              <Route path="view" element={<AdjustmentTemplate />} />
            </Route>
            <Route path="employee">
              <Route path="all" element={<EmployeeTemplate />} />
              <Route path="create" element={<EmployeeCreate />} />
              <Route path="edit/:id" element={<EmployeeEdit />} />
              <Route path="detail/:id" element={<EmployeeDetail />} />
            </Route>
            <Route path="user">
              <Route path="info/:id" element={<Profile />} />
            </Route>
            <Route path="stock">
              <Route path="all" element={<StockTemplate />} />
            </Route>
            <Route path="purchase">
              <Route path="view" element={<PurchaseView />} />
              <Route path="all" element={<PurchaseTemplate />} />
              <Route path="create" element={<PurchaseCreate />} />
              <Route path="detail/:id" element={<PurchaseDetail />} />
            </Route>
            <Route path="products">
              <Route path="all" element={<ProductTemplate />} />
              <Route path="create" element={<ProductsCreate />} />
              <Route path="edit/:id" element={<ProductsEdit />} />
              <Route path="detail/:id" element={<ProductDetails />} />
            </Route>
            <Route path="categorys">
              <Route path="all" element={<CategoryTemplate />} />
              <Route path="create" element={<CategoryCreate />} />
              <Route path="edit/:id" element={<CategoryEdit />} />
              <Route path="detail/:id" element={<CategoryDetail />} />
            </Route>
            <Route path="partners">
              <Route path="all" element={<PartnerTemplate />} />
              <Route path="create" element={<PartnerCreate />} />
              <Route path="edit/:id" element={<PartnerEdit />} />
              <Route path="detail/:id" element={<PartnerDetail />} />
            </Route>
            <Route path="customers">
              <Route path="all" element={<CustomerTemplate />} />
              <Route path="vendors" element={<VendorTemplate />} />
            </Route>
            <Route path="locations">
              <Route path="all" element={<LocationTemplate />} />
              <Route path="create" element={<LocationCreate />} />
              <Route path="edit/:id" element={<LocationEdit />} />
              <Route path="detail/:id" element={<LocationDetail />} />
            </Route>
            <Route path="saleorders">
              <Route path="all" element={<SaleTemplate />} />
              <Route path="view" element={<SaleView />} />
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
