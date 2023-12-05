import PropTypes from 'prop-types';

const ProductList = ({ products }) => {

  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
};

ProductList.propTypes = {
  products: PropTypes.array,
}

export default ProductList;
