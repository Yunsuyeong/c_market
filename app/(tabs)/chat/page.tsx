import client from "@/lib/db";
import { formatToTimeAgo } from "@/lib/utils";

const getChatRooms = async () => {
  const chatRooms = await client.chatRoom.findMany({
    include: {
      users: {
        select: {
          username: true,
        },
      },
      messages: {
        select: {
          payload: true,
          createdAt: true,
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
      {chatRooms.map((chatroom) => (
        <div key={chatroom.id}>
          <h1>{formatToTimeAgo(chatroom.createdAt.toString())}</h1>
        </div>
      ))}
    </div>
  );
};

export default Chat;
