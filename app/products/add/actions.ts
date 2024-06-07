"use server";
import { z } from "zod";
import fs from "fs/promises";
import client from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import { productSchema } from "./schema";

export const uploadProduct = async (formData: FormData) => {
  const data = {
    photo: formData.get("photo"),
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description"),
  };
  /* if (data.photo instanceof File) {
    const photoData = await data.photo.arrayBuffer();
    await fs.appendFile(`./public/${data.photo.name}`, Buffer.from(photoData));
    data.photo = `/${data.photo.name}`;
  } */
  const result = productSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const session = await getSession();
    if (session.id) {
      const product = await client.product.create({
        data: {
          title: result.data.title,
          description: result.data.description,
          price: result.data.price,
          photo: result.data.photo,
          user: {
            connect: {
              id: session.id,
            },
          },
        },
        select: {
          id: true,
        },
      });
      redirect(`/products/${product.id}`);
    }
  }
};

//cloudflare 상에 업로드 되는 이미지의 url을 생성하고 불러옴.
//생성된 이미지의 url 뒤에 여러 variant를 붙여 다양한 퀄리티/화질의 이미지를 불러올 수 있음.

export const getUploadUrl = async () => {
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
      },
    }
  );
  const data = await res.json();
  return data;
};
