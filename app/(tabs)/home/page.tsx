import ProductList from "@/components/product-list";
import client from "@/lib/db";
import { PlusIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

//cache - 데이터베이스가 지속적으로 호출되는 것을 방지하기 위해, 한번 호출된 데이터를
//메모리 상에 저장하고 데이터베이스의 추가 호출 없이 불러올 수 있게 함
//데이터를 갱신하고 자동, 또는 수동으로 데이터베이스를 새로 호출 할 수 있음

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
  });
  return initialProducts;
};

export const metadata = {
  title: "Home",
};

//NextJs에서는 각 페이지 별로 해당 페이지가 정적인지 동적인지 설정할 수 있음
//또한, 각 페이지 별로 데이터베이스를 매번 호출할지, 일정 시간마다 호출할지 설정할 수 있음

export const revalidate = 1;

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
