"use server";

import client from "@/lib/db";
import getSession from "@/lib/session";

const saveMessage = async (payload: string, chatRoomId: string) => {
  const session = await getSession();
  await client.message.create({
    data: {
      payload,
      chatRoomId,
      userId: session.id!,
    },
    select: {
      id: true,
    },
  });
};

export default saveMessage;
