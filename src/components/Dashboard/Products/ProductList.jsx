import { Table, Column } from "react-virtualized";
import AutoSizer from "react-virtualized-auto-sizer";

const ProductList = ({ products }) => {
  return (
    <AutoSizer>
      {({ height, width }) => (
        <Table
          width={width}
          height={800}
          headerHeight={20}
          rowHeight={30}
          rowCount={products.length}
          rowGetter={({ index }) => products[index]}
          className="shadow-md"
        >
          <Column label="Name" dataKey="name" width={50} />
          <Column label="Description" dataKey="description" width={50} />
          <Column label="Barcode" dataKey="barcode" width={50} />
        </Table>
      )}
    </AutoSizer>
  );
};

export default ProductList;
