import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import AUCTION_QUERIES from "../../api/auction/auction.queries";
import AuctionSchema from "../../api/auction/schemas/auction.schema";
import { useAuctionsContext } from "../../context/auctions.context";
import { useAuth } from "../../context/auth.context";
import AuctionCard from "./AuctionCard";

export default function HomePage(): JSX.Element {
  const { auctions } = useAuctionsContext();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isOwner = (auction: AuctionSchema) =>
    (user && user.id === auction.owner?.id) ?? false;
  const [joinAuction, { loading }] = useMutation(AUCTION_QUERIES.JOIN_AUCTION);
  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap gap-6 sm:p-8 p-2 sm:justify-start justify-center">
        {auctions.map((auction, idx) => (
          <AuctionCard
            key={idx}
            isMember={auction.isMember}
            auction={auction}
            isOwner={isOwner(auction)}
            loading={loading}
            onClick={async (auction) => {
              if (isOwner(auction) || auction.isMember) {
                navigate(`/auction/${auction.id}`);
              } else {
                await joinAuction({
                  variables: {
                    id: auction.id,
                  },
                });
                navigate(`/auction/${auction.id}`);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}
