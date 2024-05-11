import AuctionSchema from "../../auction/schemas/auction.schema";
import { GenericSchema } from "../../generic/generic.schema";
import { MessageSchema } from "./message.schema";

export enum ConversationType {
  AUCTION = "AUCTION",
  NORMAL = "NORMAL",
}

export interface ConversationSchema extends GenericSchema {
  messages: Array<MessageSchema & { requestId?: string }>;
  type: ConversationType;
  auction?: Partial<AuctionSchema> & { id: number };
}
