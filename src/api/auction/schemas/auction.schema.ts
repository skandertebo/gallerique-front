import { WithRequestId } from "../../../generic/WithRequestId.type";
import { UserSchema } from "../../auth/schemas/user.schema";
import { ConversationSchema } from "../../conversation/schemas/conversation.schema";
import BidSchema from "./bid.schema";

export enum AuctionStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  PENDING = "PENDING",
}

interface AuctionSchema {
  id: number;
  title: string;
  image: string;
  description: string;
  startPrice: number;
  currentPrice: number;
  startDate: string;
  endTime: string;
  status: AuctionStatus;
  bids: WithRequestId<BidSchema>[];
  owner: UserSchema;
  winner: UserSchema;
  members: UserSchema[];
  conversation: ConversationSchema;
  isMember: boolean;
}

export default AuctionSchema;
