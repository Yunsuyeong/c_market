import ChatList from "@/components/chat-list";
import client from "@/lib/db";
import { formatToTimeAgo } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const getChatRooms = async () => {
  const chatRooms = await client.chatRoom.findMany({
    include: {
      users: {
        select: {
          username: true,
        },
      },
      messages: {
        include: {
          user: {
            select: {
              username: true,
              avatar: true,
            },
          },
        },
      },
    },
  });
  return chatRooms;
};

const Chat = async () => {
  const chatRooms = await getChatRooms();
  return (
    <div>
      <ChatList chatRooms={chatRooms} />
    </div>
  );
};

export default Chat;
