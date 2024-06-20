import ChatMessagesList from "@/components/chat-messages-list";
import client from "@/lib/db";
import getSession from "@/lib/session";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";

const getRoom = async (id: string) => {
  const room = await client.chatRoom.findUnique({
    where: {
      id,
    },
    include: {
      users: {
        select: {
          id: true,
        },
      },
    },
  });
  if (room) {
    const session = await getSession();
    const canSee = Boolean(room.users.find((user) => user.id === session.id));
    if (!canSee) {
      return null;
    }
  }
  return room;
};

const getMessages = async (chatRoomId: string) => {
  const messages = await client.message.findMany({
    where: {
      chatRoomId,
    },
    select: {
      id: true,
      payload: true,
      createdAt: true,
      userId: true,
      user: {
        select: {
          avatar: true,
          username: true,
        },
      },
    },
  });
  return messages;
};

export type initialChatMessages = Prisma.PromiseReturnType<typeof getMessages>;

const ChatRoom = async ({ params }: { params: { id: string } }) => {
  const room = await getRoom(params.id);
  if (!room) {
    return notFound();
  }
  const session = await getSession();
  const initialMessages = await getMessages(params.id);
  return (
    <ChatMessagesList userId={session.id!} initialMessages={initialMessages} />
  );
};

export default ChatRoom;
