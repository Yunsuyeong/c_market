"use client";

import { initialChatMessages } from "@/app/chats/[id]/page";
import { formatToTimeAgo } from "@/lib/utils";
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useState } from "react";

interface IChatMessagesList {
  initialMessages: initialChatMessages;
  userId: number;
}

const ChatMessagesList = ({ initialMessages, userId }: IChatMessagesList) => {
  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState("");
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setMessage(value);
  };
  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    alert(message);
    setMessage("");
  };
  return (
    <div className="flex flex-col justify-end min-h-screen p-5">
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
            className={`flex flex-col gap-1 ${
              message.userId === userId ? "items-end" : ""
            }`}
          >
            <span
              className={`${
                message.userId === userId ? "bg-neutral-500" : "bg-orange-500"
              } p-2.5 rounded-md`}
            >
              {message.payload}
            </span>
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
