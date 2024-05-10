import AuctionSchema from "../../api/auction/schemas/auction.schema";
import { useAuctionsContext } from "../../context/auctions.context";
import { useAuth } from "../../context/auth.context";
import AuctionCard from "./AuctionCard";

export default function HomePage(): JSX.Element {
  const { auctions } = useAuctionsContext();
  const { user } = useAuth();
  const isOwner = (auction: AuctionSchema) =>
    (user && user.id === auction.owner?.id) ?? false;
  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap gap-6 sm:p-8 p-2 sm:justify-start justify-center">
        {auctions.map((auction, idx) => (
          <AuctionCard key={idx} auction={auction} isOwner={isOwner(auction)} />
        ))}
      </div>
    </div>
  );
}
