import PropTypes from "prop-types";
import { Image } from "@nextui-org/react";
import box from "../../assets/box.png";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@nextui-org/react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";

const ProductList = ({ products }) => {
  const navigate = useNavigate();

  const editRoute = (id) => {
    navigate(`/admin/products/edit/${id}`);
  };

  return (
    <>
      <div>
        <h2 className="lg:text-xl font-bold my-2">Products</h2>
        <Table aria-label="Example static collection table">
          <TableHeader>
            <TableColumn>Photo</TableColumn>
            <TableColumn>Name</TableColumn>
            <TableColumn>Ref</TableColumn>
            <TableColumn>Expire date</TableColumn>
            <TableColumn>Description</TableColumn>
            <TableColumn>Barcode</TableColumn>
            <TableColumn>Price</TableColumn>
            <TableColumn>Action</TableColumn>
          </TableHeader>
          <TableBody>
            {products ? (
              products.map((product) => (
                <TableRow key={product.id} className="items-center">
                  <TableCell>
                    <Image
                      width={50}
                      height={30}
                      alt={product.name}
                      src={product.image ? product.image : box}
                    />
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.ref ? product.ref : ""}</TableCell>
                  <TableCell>
                    {product.expiredAt
                      ? new Date(product.expiredAt).toISOString().split("T")[0]
                      : ""}
                  </TableCell>
                  <TableCell>
                    {product.description
                      ? product.description.substring(0, 30)
                      : ""}
                  </TableCell>
                  <TableCell>
                    {product.barcode ? product.barcode : ""}
                  </TableCell>
                  <TableCell>
                    {product.salePrice ? product.salePrice : ""}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center">
                      <Icon
                        icon="prime:eye"
                        onClick={() =>
                          navigate(`/admin/products/detail/${product.id}`)
                        }
                        className="text-xl"
                      />
                      <Icon
                        icon="ep:edit"
                        className="text-lg ml-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          editRoute(product.id);
                        }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <Spinner />
            )}
          </TableBody>
        </Table>
        {/* <Spinner className="text-center w-full mt-52" /> */}
      </div>
    </>
  );
};

ProductList.propTypes = {
  products: PropTypes.array,
};

export default ProductList;
