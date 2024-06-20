import client from "@/lib/db";
import getSession from "@/lib/session";
import { formatToWon } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  revalidatePath,
  revalidateTag,
  unstable_cache as nextCache,
} from "next/cache";

const getIsOwner = async (userId: number) => {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
  return true;
};

export const getProduct = async (id: number) => {
  const product = await client.product.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });
  return product;
};

const getProductTitle = async (id: number) => {
  const product = await client.product.findUnique({
    where: {
      id,
    },
    select: {
      title: true,
    },
  });
  return product;
};

export const generateMetadata = async ({
  params,
}: {
  params: { id: string };
}) => {
  const product = await getCachedProductTitle(Number(params.id));
  return {
    title: product?.title,
  };
};

const getCachedProduct = nextCache(getProduct, ["product-detail"], {
  tags: ["product-detail"],
});

const getCachedProductTitle = nextCache(getProductTitle, ["product-title"], {
  tags: ["product-title"],
});

const ProductDetail = async ({ params }: { params: { id: string } }) => {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const product = await getCachedProduct(id);
  if (!product) {
    return notFound();
  }
  const isOwner = await getIsOwner(product.userId);
  const deleteProduct = async () => {
    "use server";
    await client.product.delete({
      where: {
        id: product?.id,
      },
    });
    redirect("/");
  };
  const createChatRoom = async () => {
    "use server";
    const session = await getSession();
    const room = await client.chatRoom.create({
      data: {
        users: {
          connect: [
            {
              id: product.userId,
            },
            {
              id: session.id,
            },
          ],
        },
      },
      select: {
        id: true,
      },
    });
    redirect(`/chats/${room.id}`);
  };
  return (
    <div className="pb-20">
      <div className="relative aspect-square">
        <Image
          fill
          src={`${product.photo}`}
          alt={product.title}
          className="object-cover"
        />
      </div>
      <div className="flex items-center gap-3 p-5 border-b border-neutral-700">
        <div className="size-10 rounded-full overflow-hidden">
          {product.user.avatar !== null ? (
            <Image
              alt={product.user.username}
              src={product.user.avatar}
              width={40}
              height={40}
            />
          ) : (
            <UserIcon />
          )}
        </div>
        <div>
          <h3>{product.user.username}</h3>
        </div>
      </div>
      <div className="p-10">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p>{product.description}</p>
      </div>
      <div className="fixed w-full flex justify-between items-center bottom-0 left-0 p-5 pb-10 bg-neutral-800">
        <span className="font-semibold text-xl">
          {formatToWon(product.price)}원
        </span>
        {isOwner ? (
          <>
            <form action={deleteProduct}>
              <button
                className="bg-red-500 px-5 py-2.5
        rounded-md text-white font-semibold"
              >
                Delete Product
              </button>
            </form>
            <Link
              href={`/products/${product.id}/edit`}
              className="bg-green-500 px-5 py-2.5
        rounded-md text-white font-semibold"
            >
              Edit Product
            </Link>
          </>
        ) : null}
        <form action={createChatRoom}>
          <button
            className="bg-orange-500 px-5 py-2.5
        rounded-md text-white font-semibold"
          >
            Chat
          </button>
        </form>
      </div>
    </div>
  );
};

export const dynamicParams = true;

export const generateStaticParams = async () => {
  const products = await client.product.findMany({
    select: {
      id: true,
    },
  });
  return products.map((product) => ({
    id: product.id + "",
  }));
};

export default ProductDetail;
