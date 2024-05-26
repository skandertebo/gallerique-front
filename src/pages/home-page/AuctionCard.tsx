import { useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { FaArrowRight } from "react-icons/fa";
import AuctionSchema from "../../api/auction/schemas/auction.schema";
import auctionImg from "../../assets/auction-img.png";
import formatRemainingTime from "../../utils/formatRemainingTime";
export interface AuctionCardProps {
  auction: AuctionSchema;
  isMember?: boolean;
  isOwner?: boolean;
  onClick?: (auction: AuctionSchema) => void;
  loading?: boolean;
}

const AuctionCard: React.FC<AuctionCardProps> = ({
  auction,
  isMember,
  onClick,
  loading,
  isOwner,
}) => {
  const [remainingTime, setRemainingTime] = useState<string>("");

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (
      new Date(auction.startDate).getTime() > new Date().getTime() ||
      new Date(auction.endTime).getTime() > new Date().getTime()
    ) {
      interval = setInterval(() => {
        if (new Date(auction.endTime).getTime() < new Date().getTime()) {
          if (interval) clearInterval(interval);
        } else if (
          new Date(auction.startDate).getTime() > new Date().getTime()
        ) {
          setRemainingTime(formatRemainingTime(auction.startDate));
        } else {
          setRemainingTime(formatRemainingTime(auction.endTime));
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [auction]);

  return (
    <div className="flex flex-col p-4 rounded-xl border-4 border-palette-3">
      <img
        src={auction.picture || auctionImg}
        alt="auction"
        className="w-full h-48 object-cover rounded-lg"
      />
      <div className="flex flex-col mt-2">
        <h1 className="text-xl font-medium text-palette-1">{auction.title}</h1>
        <p className="text-lg text-palette-5">
          Current Price:{" "}
          <span className="font-boo">{auction.currentPrice}</span>
        </p>
        <p className="text-sm font-medium text-palette-5">
          By&nbsp;{auction.owner.firstName}&nbsp;{auction.owner.lastName}
        </p>
      </div>

      <div className="flex mt-2 items-center justify-between gap-2">
        <button
          className="bg-palette-6 text-white px-2 py-1.5 text-md rounded-md flex gap-2 items-center"
          onClick={() => onClick?.(auction)}
          disabled={loading}
        >
          {loading ? (
            <AiOutlineLoading className="h-4 w-4 text-white animate-spin ms-8 me-6 my-1.5" />
          ) : isOwner ? (
            "View"
          ) : isMember ? (
            "Bid"
          ) : (
            "Join Auction"
          )}
          <FaArrowRight className="h-4 w-4 text-white" />
        </button>
        {auction.winner && (
          <p className="text-md font-medium text-palette-5">FINISHED</p>
        )}
        {new Date(auction.startDate).getTime() > new Date().getTime() ? (
          <p className="text-md font-medium text-palette-5">
            Starts at at: &nbsp;{" "}
            <span className="font-semibold">{remainingTime}</span>
          </p>
        ) : new Date(auction.endTime) > new Date() ? (
          <p className="text-md font-medium text-palette-5">
            Ends at: &nbsp;{" "}
            <span className="font-semibold">{remainingTime}</span>
          </p>
        ) : (
          <p className="text-md font-medium text-palette-5">Ended</p>
        )}
      </div>
    </div>
  );
};

export default AuctionCard;
