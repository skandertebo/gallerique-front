import { FaArrowRight } from "react-icons/fa";
import AuctionSchema from "../../api/auction/schemas/auction.schema";
import auctionImg from "../../assets/auction-img.png";
export interface AuctionCardProps {
  auction: AuctionSchema;
  isMember?: boolean;
  isOwner?: boolean;
}

const AuctionCard: React.FC<AuctionCardProps> = ({
  auction,
  isMember,
  isOwner,
}) => {
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
      {!isOwner && (
        <div className="flex mt-2">
          <button className="bg-palette-6 text-white px-2 py-1.5 text-md rounded-md flex gap-2 items-center">
            {isMember ? "Bid" : "Join Auction"}
            <FaArrowRight className="h-4 w-4 text-white" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AuctionCard;
