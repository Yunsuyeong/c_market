import ListChat from "./list-chat";

interface IChatList {
  chatRooms: {
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
  }[];
}

const ChatList = ({ chatRooms }: IChatList) => {
  return (
    <div className="flex flex-col p-5">
      {chatRooms.map((chatroom) => (
        <ListChat
          key={chatroom.id}
          id={chatroom.id}
          createdAt={chatroom.createdAt}
          messages={chatroom.messages}
        />
      ))}
    </div>
  );
};

export default ChatList;
