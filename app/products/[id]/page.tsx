import client from "@/lib/db";
import getSession from "@/lib/session";
import { formatToWon } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const getIsOwner = async (userId: number) => {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
  return false;
};

const getProduct = async (id: number) => {
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

const ProductDetail = async ({ params }: { params: { id: string } }) => {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const product = await getProduct(id);
  if (!product) {
    return notFound();
  }
  const isOwner = await getIsOwner(product.userId);
  return (
    <div>
      <div className="relative aspect-square">
        <Image
          fill
          src={product.photo}
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
      <div className="p-5">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p>{product.description}</p>
      </div>
      <div className="fixed w-full flex justify-between items-center bottom-0 left-0 p-5 pb-10 bg-neutral-800">
        <span className="font-semibold text-xl">
          {formatToWon(product.price)}원
        </span>
        {isOwner ? (
          <button
            className="bg-red-500 px-5 py-2.5
        rounded-md text-white font-semibold"
          >
            Delete Product
          </button>
        ) : null}
        <Link
          href={``}
          className="bg-orange-500 px-5 py-2.5
        rounded-md text-white font-semibold"
        >
          Chat
        </Link>
      </div>
    </div>
  );
};

export default ProductDetail;
