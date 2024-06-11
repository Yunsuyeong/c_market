"use client";

import { getMoreProducts } from "@/app/(tabs)/home/actions";
import { useEffect, useRef, useState } from "react";
import ListProduct from "./list-product";

interface IProductList {
  initialProducts: {
    id: number;
    title: string;
    price: number;
    createdAt: Date;
    photo: string;
  }[];
}

//IntersectionObserver - 어느 element의 뷰포트의 변경 사항을 감지하고 동작 시키는 api

const ProductList = ({ initialProducts }: IProductList) => {
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const trigger = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      async (
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver
      ) => {
        const element = entries[0];
        if (element.isIntersecting && trigger.current) {
          observer.unobserve(trigger.current);
          setIsLoading(true);
          const newProducts = await getMoreProducts(page + 1);
          if (newProducts.length !== 0) {
            setPage((prev) => prev + 1);
            setProducts((prev) => [...prev, ...newProducts]);
          } else {
            setIsLastPage(true);
          }
          setIsLoading(false);
        }
      },
      {
        threshold: 1.0,
      }
    );
    if (trigger.current) {
      observer.observe(trigger.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [page]);
  return (
    <div className="flex flex-col gap-5 p-5">
      {initialProducts.map((product) => (
        <ListProduct key={product.id} {...product} />
      ))}
      {/* {!isLastPage ? (
        <span
          ref={trigger}
          style={{
            marginTop: `${page + 1 * 900}vh`,
          }}
          className="mb-96 text-sm font-semibold bg-orange-500 w-fit mx-auto px-3 py-2 rounded-md hover:opacity-90 active:scale-95"
        >
          {isLoading ? "Loading..." : "Load more"}
        </span>
      ) : null} */}
    </div>
  );
};

export default ProductList;
