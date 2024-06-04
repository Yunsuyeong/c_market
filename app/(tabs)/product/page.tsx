import ListProduct from "@/components/list-product";
import ProductList from "@/components/product-list";
import client from "@/lib/db";

const getInitialProducts = async () => {
  const initialProducts = await client.product.findMany({
    select: {
      id: true,
      title: true,
      price: true,
      createdAt: true,
      photo: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 1,
  });
  return initialProducts;
};

const Products = async () => {
  const products = await getInitialProducts();
  return (
    <div>
      <ProductList initialProducts={products} />
    </div>
  );
};

export default Products;
