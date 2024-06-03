import { formatToTimeAgo, formatToWon } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface IListProduct {
  id: number;
  title: string;
  price: number;
  createdAt: Date;
  photo: string;
}

const ListProduct = ({ id, title, price, createdAt, photo }: IListProduct) => {
  return (
    <Link href={`/products/${id}`} className="flex gap-5">
      <div className="relative size-28 rounded-md overflow-hidden">
        <Image src={photo} alt={title} fill quality={100} />
      </div>
      <div className="flex flex-col gap-1 *:text-white">
        <span className="text-lg">{title}</span>
        <span className="text-sm text-neutral-500">
          {formatToTimeAgo(createdAt.toString())}
        </span>
        <span className="text-lg font-semibold">{formatToWon(price)}원</span>
      </div>
    </Link>
  );
};

export default ListProduct;
