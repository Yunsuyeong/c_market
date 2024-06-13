import { formatToTimeAgo } from "@/lib/utils";
import {
  ChatBubbleBottomCenterIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

interface IListPost {
  id: number;
  title: string;
  description: string | null;
  createdAt: Date;
  _count: {
    comments: number;
    likes: number;
  };
  views: number;
}

const ListPost = ({
  id,
  title,
  description,
  createdAt,
  _count: { comments, likes },
  views,
}: IListPost) => {
  return (
    <Link
      className="flex flex-col gap-2 pb-5 mb-5 border-b border-neutal-500 text-neutral-400
          last:pb-0 last:border-b-0"
      key={id}
      href={`/posts/${id}`}
    >
      <h2 className="text-white text-lg font-semibold">{title}</h2>
      <p>{description}</p>
      <div className="flex items-center justify-between text-sm">
        <div className="flex gap-4 items-center">
          <span className="text-sm text-neutral-500">
            {formatToTimeAgo(createdAt.toString())}
          </span>
          <span>.</span>
          <span>조회 {views}</span>
        </div>
        <div className="flex gap-4 items-center *:flex *:gap-1 *:items-center">
          <span>
            <HandThumbUpIcon className="size-4" />
            {likes}
          </span>
          <span>
            <ChatBubbleBottomCenterIcon className="size-4" />
            {comments}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ListPost;
