import ListProduct from "@/components/list-product";
import client from "@/lib/db";

const getProducts = async () => {
  const products = await client.product.findMany({
    select: {
      id: true,
      title: true,
      price: true,
      createdAt: true,
      photo: true,
    },
  });
  return products;
};

const Products = async () => {
  const products = await getProducts();
  return (
    <div className="flex flex-col gap-5 p-5">
      {products.map((product) => (
        <ListProduct key={product.id} {...product} />
      ))}
    </div>
  );
};

export default Products;
