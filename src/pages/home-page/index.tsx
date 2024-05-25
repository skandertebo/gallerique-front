import { useMutation } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";
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
      <header className="w-[95%] mt-2 sm:mx-8 mx-2 border-b-2 border-palette-5 py-2 sm:py-4">
        <h1 className="text-4xl font-semibold text-palette-5">Auctions</h1>
      </header>
      <div className="flex flex-col sm:mx-8 mx-2 my-4">
        <Link to={"/create-auction"}>
          <span className="bg-palette-6 text-white py-0.5 px-2.5 rounded-md w-fit">
            Create Auction
          </span>
        </Link>
      </div>
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
