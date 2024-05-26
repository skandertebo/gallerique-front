import { useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { GiSandsOfTime } from "react-icons/gi";
import { LuCircleDollarSign } from "react-icons/lu";
import AuctionSchema from "../../api/auction/schemas/auction.schema";
import BidSchema from "../../api/auction/schemas/bid.schema";
import { UserSchema } from "../../api/auth/schemas/user.schema";
import useAuctionRemainingTime from "../../hooks/useAuctionRemainingTime";
import { clsxm } from "../../utils/clsxm";
export interface BidContainerProps {
  bids: BidSchema[];
  me: UserSchema;
  onBid: (bidValue: number) => void;
  auction: AuctionSchema;
}

const BidContainer: React.FC<BidContainerProps> = ({
  bids,
  me,
  onBid,
  auction,
}) => {
  const [bidValue, setBidValue] = useState<number>(0);
  const { type, remainingTime } = useAuctionRemainingTime(auction);
  const remainingTimeText =
    type === "finished"
      ? "Finished"
      : type === "starts-at"
        ? "Starts at"
        : "Ends at";
  return (
    <div className="flex gap-1 items-center h-[200px]">
      <div className="flex flex-col gap-2">
        <div className="flex gap-4 items-center">
          <GiSandsOfTime className="h-7 w-7 text-palette-2" />
          <p className="text-black text-md font-semibold">
            {remainingTimeText}: {remainingTime}
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <LuCircleDollarSign className="h-7 w-7 text-palette-2" />
          <p className="text-black text-md font-semibold">
            Current Price: {auction.currentPrice}
          </p>
        </div>
        <div className="flex gap-1 items-center">
          <input
            type="number"
            value={bidValue}
            onChange={(e) => setBidValue(parseInt(e.target.value))}
            className="w-1/2 px-2 py-1.5 rounded-lg border-2 border-palette-5"
          />
          <button onClick={() => onBid(bidValue)}>
            <CiCirclePlus className="h-10 w-10 text-palette-5" />
          </button>
        </div>
      </div>
      <div className="flex flex-col p-4 bg-palette-2 h-full overflow-y-auto rounded-xl min-w-[200px]">
        {bids.map((bid) => (
          <div
            key={bid.id}
            className={clsxm(
              "flex flex-row justify-between text-white",
              bid.id === -1 && "opacity-55"
            )}
          >
            <p className="text-lg ">
              {bid.owner.id === me.id ? "You" : bid.owner.firstName} Raised
            </p>
            <p className="text-lg ">{bid.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BidContainer;
