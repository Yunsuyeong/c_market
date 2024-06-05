"use server";

import client from "@/lib/db";

export const getMoreProducts = async (page: number) => {
  const products = await client.product.findMany({
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
    skip: page * 1,
  });
  return products;
};
