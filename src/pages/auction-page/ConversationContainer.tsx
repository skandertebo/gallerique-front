import { useEffect, useReducer, useState } from "react";
import { IoSend } from "react-icons/io5";
import { RxAvatar } from "react-icons/rx";
import { UserSchema } from "../../api/auth/schemas/user.schema";
import { ConversationSchema } from "../../api/conversation/schemas/conversation.schema";
import { MessageSchema } from "../../api/conversation/schemas/message.schema";
import { clsxm } from "../../utils/clsxm";
import formatSentAtDate from "../../utils/formatSentAtDate";

export interface ConversationContainerProps {
  conversation: ConversationSchema;
  user: UserSchema;
  onMessageSend: (content: string) => void;
}

interface MessageItemProps {
  isSender?: boolean;
  message: MessageSchema;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  // doing a rerender to reformate the date every minute
  const [_, toggleRerender] = useReducer((x) => !x, false);

  useEffect(() => {
    const interval = setInterval(() => {
      toggleRerender();
    }, 1000 * 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={clsxm(
        "bg-inherit flex gap-2 items-center",
        !message.createdAt && "opacity-50"
      )}
    >
      <div>
        <RxAvatar className="text-white h-6 w-6" />
      </div>
      <div className="flex flex-col">
        <div className="text-sm font-semibold text-slate-100">
          {message.sender?.firstName} {message.sender?.lastName} -{" "}
          <span className="text-xs font-extralight">
            {message.createdAt ? formatSentAtDate(message.createdAt) : null}
          </span>
        </div>
        <div className="text-white text-xs font-thin">{message.content}</div>
      </div>
    </div>
  );
};

const ConversationContainer: React.FC<ConversationContainerProps> = ({
  conversation,
  user,
  onMessageSend,
}) => {
  const [inputVal, setInputVal] = useState<string>("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value);
  };
  const handleSend = () => {
    onMessageSend(inputVal);
    setInputVal("");
  };
  return (
    <div className="flex flex-col gap-6 p-4 bg-palette-6 bg-opacity-85 rounded-xl max-w-[500px] md:w-[500px] h-[80vh]">
      <div className="flex flex-col-reverse gap-4 overflow-y-auto flex-grow">
        {conversation.messages.map((message, idx) => (
          <MessageItem
            key={idx}
            message={message}
            isSender={user.id === message.sender?.id}
          />
        ))}
      </div>
      <div className="flex w-full relative mt-4">
        <input
          onChange={handleChange}
          className="rounded-xl w-full text-palette-6 bg-white px-6 py-2 placeholder:text-palette-3 focus:ring-none focus:outline-none"
          type="text"
          value={inputVal}
          placeholder="Type a message..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
              e.currentTarget.value = "";
            }
          }}
        />
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2"
          onClick={handleSend}
        >
          <IoSend className="h-5 w-5 text-palette-1" />
        </button>
      </div>
    </div>
  );
};

export default ConversationContainer;
