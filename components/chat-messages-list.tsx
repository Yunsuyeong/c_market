"use client";

import { initialChatMessages } from "@/app/chats/[id]/page";
import { formatToTimeAgo } from "@/lib/utils";
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createClient, RealtimeChannel } from "@supabase/supabase-js";
import saveMessage from "@/app/chats/[id]/actions";

interface IChatMessagesList {
  initialMessages: initialChatMessages;
  userId: number;
  chatRoomId: string;
  username: string;
  avatar: string;
  isOwner: boolean;
}

const SUPABASE_PUBLIC_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdtc2lrZ3RxeGdvcmh6YWxuZWF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg4NzA2NDcsImV4cCI6MjAzNDQ0NjY0N30.v_gBiqMA2AXwj_yVSjCeQdfdv6h1BZdLAMU6mwXtd2w";

const SUPABASE_URL = "https://gmsikgtqxgorhzalneav.supabase.co";

const ChatMessagesList = ({
  initialMessages,
  userId,
  chatRoomId,
  username,
  avatar,
  isOwner,
}: IChatMessagesList) => {
  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState("");
  const channel = useRef<RealtimeChannel>();
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setMessage(value);
  };
  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        payload: message,
        isRead: isOwner ? true : false,
        createdAt: new Date(),
        userId,
        user: {
          username: "string",
          avatar: "",
        },
      },
    ]);
    channel.current?.send({
      type: "broadcast",
      event: "message",
      payload: {
        id: Date.now(),
        payload: message,
        isRead: isOwner ? true : false,
        createdAt: new Date(),
        userId,
        user: {
          username,
          avatar,
        },
      },
    });
    await saveMessage(message, chatRoomId);
    setMessage("");
  };
  useEffect(() => {
    const client = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
    channel.current = client.channel(`room-${chatRoomId}`);
    channel.current
      .on("broadcast", { event: "message" }, (payload) => {
        setMessages((prev) => [...prev, payload.payload]);
      })
      .subscribe();
    return () => {
      channel.current?.unsubscribe();
    };
  }, [chatRoomId]);
  return (
    <div className="flex flex-col justify-end min-h-screen p-5 gap-2">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex items-start gap-2 ${
            message.userId === userId ? "justify-end" : ""
          }`}
        >
          {message.user.avatar ? (
            <Image
              src={message.user.avatar!}
              alt={message.user.username}
              width={50}
              height={50}
              className="size-8 rounded-full"
            />
          ) : (
            <div className="size-8 bg-neutral-700 rounded-full" />
          )}
          <div
            className={`flex flex-col gap-3 ${
              message.userId === userId ? "items-end" : ""
            }`}
          >
            <div>
              <span
                className={`${
                  message.userId === userId ? "bg-green-500" : "bg-orange-500"
                } p-2.5 rounded-md`}
              >
                {message.payload}
              </span>
              <span className="text-xs pl-2">
                {!message.isRead ? "1" : null}
              </span>
            </div>
            <span className="text-xs">
              {formatToTimeAgo(message.createdAt.toString())}
            </span>
          </div>
        </div>
      ))}
      <form className="flex relative" onSubmit={onSubmit}>
        <input
          className="w-full h-10 rounded-full bg-transparent px-5 transition
        ring-2 ring-neutral-200 focus:ring-4 focus:ring-neutral-50 focus:outline-none border-none placeholder:text-neutral-400"
          required
          type="text"
          name="message"
          onChange={onChange}
          value={message}
          placeholder="Write a message"
        />
        <button>
          <ArrowUpCircleIcon className="size-10 text-orange-500 transition-colors hover:text-orange-300" />
        </button>
      </form>
    </div>
  );
};

export default ChatMessagesList;
