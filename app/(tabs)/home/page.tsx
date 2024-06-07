import ProductList from "@/components/product-list";
import client from "@/lib/db";
import { PlusIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

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
  const initialProducts = await getInitialProducts();
  return (
    <div>
      <ProductList initialProducts={initialProducts} />
      <Link
        href="/products/add"
        className="flex items-center justify-center fixed bottom-24 right-8 size-16 rounded-full bg-orange-500 text-white
        transition-colors hover:bg-orange-400"
      >
        <PlusIcon className="size-10" />
      </Link>
    </div>
  );
};

export default Products;
