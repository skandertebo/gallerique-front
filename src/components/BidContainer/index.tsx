import { useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { GiSandsOfTime } from "react-icons/gi";
import { LuCircleDollarSign } from "react-icons/lu";
import { Link } from "react-router-dom";
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
    <div className="flex gap-1 items-center h-[200px] m-4">
      <div className="flex flex-col gap-2 ">
        <div className="flex gap-4 text-lg items-center">
          <GiSandsOfTime className="h-7 w-7 text-palette-2" />
          <p className="text-black text-lg font-semibold">
            {remainingTimeText}: {remainingTime}
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <LuCircleDollarSign className="h-7 w-7 text-palette-2" />
          <p className="text-black text-lg font-semibold">
            Current Price: {auction.currentPrice}
          </p>
        </div>
        <div className="flex gap-1 items-center ml-6 mt-4">
          <input
            type="number"
            value={bidValue}
            onChange={(e) => setBidValue(parseInt(e.target.value))}
            className="w-1/2 px-2 py-1.5 rounded-lg border-2 border-palette-5"
            min={auction.currentPrice + 1}
          />
          <button
            onClick={() => {
              onBid(bidValue);
              setBidValue(0);
            }}
            disabled={
              bidValue < auction.currentPrice + 1 ||
              auction.owner.id === me.id ||
              new Date(auction.endTime) < new Date() ||
              me.credit < auction.currentPrice
            }
            className="disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CiCirclePlus className="h-10 w-10 text-palette-5" />
          </button>
          {me.credit < auction.currentPrice && (
            <>
              <p className="text-red-500">Not enough credit to bid</p>
              <Link to="/add-fund" className="text-red-500">
                Add Funds
              </Link>
            </>
          )}
        </div>
      </div>
      <div className="flex flex-col-reverse p-4 bg-palette-2 h-full overflow-y-auto rounded-xl min-w-[200px]  text-center">
        {bids.map((bid) => (
          <div
            key={bid.id}
            className={clsxm(
              "flex flex-row justify-between text-white",
              bid.id === -1 && "opacity-55"
            )}
          >
            <p className="text-lg ">
              {bid.owner.id === me.id ? "You" : bid.owner.firstName} Raised{" "}
              {bid.price}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BidContainer;
