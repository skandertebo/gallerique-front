import { UserSchema } from "../../auth/schemas/user.schema";
import { ConversationSchema } from "./conversation.schema";

export interface MessageSchema extends ConversationSchema {
  content: string;
  sender: Partial<UserSchema> & { id: number };
  conversation?: ConversationSchema;
}
