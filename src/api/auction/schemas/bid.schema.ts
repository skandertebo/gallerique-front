import { UserSchema } from "../../auth/schemas/user.schema";
import { GenericSchema } from "../../generic/generic.schema";
import AuctionSchema from "./auction.schema";

interface BidSchema extends GenericSchema {
  price: number;
  auction: AuctionSchema;
  owner: UserSchema;
}

export default BidSchema;
