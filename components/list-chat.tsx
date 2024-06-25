import { formatToTimeAgo } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface IListChat {
  id: string;
  createdAt: Date;
  messages: {
    user: {
      username: string;
      avatar: string | null;
    };
    id: number;
    payload: string;
    createdAt: Date;
    updatedAt: Date;
    userId: number;
    chatRoomId: string;
  }[];
}

const ListChat = ({ id, createdAt, messages }: IListChat) => {
  return (
    <Link
      href={`/chats/${id}`}
      key={id}
      className="flex items-center gap-5 pb-5 mb-5 border-b border-neutal-500 text-white
          last:pb-0 last:border-b-0"
    >
      <div className="w-20 flex flex-col items-center gap-1">
        {messages[messages.length - 1].user.avatar ? (
          <Image
            src={messages[messages.length - 1].user.avatar!}
            alt={messages[messages.length - 1].user.username}
            width={50}
            height={50}
            className="size-8 rounded-full"
          />
        ) : (
          <div className="size-8 bg-neutral-700 rounded-full" />
        )}
        <span className="text-xs">
          {messages[messages.length - 1].user.username}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-md font-semibold">
          {messages[messages.length - 1].payload}
        </span>
        <span className="text-xs">{formatToTimeAgo(createdAt.toString())}</span>
      </div>
    </Link>
  );
};

export default ListChat;
