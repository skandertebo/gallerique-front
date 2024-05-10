import { UserSchema } from "../../api/auth/schemas/user.schema";
import { ConversationSchema } from "../../api/conversation/schemas/conversation.schema";

export interface ConversationContainerProps {
  conversation: ConversationSchema;
  user: UserSchema;
  onMessageSend: (content: string) => void;
}

const ConversationContainer: React.FC<ConversationContainerProps> = ({
  conversation,
  user,
  onMessageSend,
}) => {
  return (
    <div>
      <h1>Conversation</h1>
      <div>
        {conversation.messages.map((message) => (
          <div key={message.id}>
            <div>{message.content}</div>
            <div>
              {message.sender.id === user?.id
                ? "You"
                : message.sender.firstName}
            </div>
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type a message..."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onMessageSend(e.currentTarget.value);
            e.currentTarget.value = "";
          }
        }}
      />
    </div>
  );
};

export default ConversationContainer;
