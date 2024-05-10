import { useQuery } from "@apollo/client";
import { createContext, useContext, useRef } from "react";
import AUCTION_QUERIES from "../api/auction/auction.queries";
import AuctionSchema from "../api/auction/schemas/auction.schema";
import { UserSchema } from "../api/auth/schemas/user.schema";

export interface AuctionContext {
  auctions: Array<AuctionSchema>;
  myAuctions: Array<AuctionSchema>;
  auctionsWhereImMember: Array<AuctionSchema>;
  auctionsLoading: boolean;
  auctionsError: string;
  myAuctionsLoading: boolean;
  myAuctionsError: string;
  auctionsWhereImMemberLoading: boolean;
  auctionsWhereImMemberError: string;
  fetchMoreAuctions: () => void;
  fetchMoreMyAuctions: () => void;
  fetchMoreAuctionsWhereImMember: () => void;
}

const auctionsContext = createContext<AuctionContext | null>(null);

export const useAuctionsContext = () => {
  const context = useContext(auctionsContext);
  if (!context) throw new Error("unexpected behaviour");
  return context;
};

export const AuctionsProvider: React.FC<
  React.PropsWithChildren<{ user: UserSchema }>
> = ({ children }) => {
  const auctionsPageRef = useRef(1);
  const {
    data: auctionsData,
    loading: auctionsLoading,
    error: auctionsError,
    fetchMore: _fetchMore,
  } = useQuery(AUCTION_QUERIES.GET_AUCTIONS, {
    variables: {
      limit: 40,
      offset: 1,
    },
  });
  const fetchMoreAuctions = () => {
    auctionsPageRef.current += 1;
    _fetchMore({
      variables: {
        limit: 40,
        offset: auctionsPageRef.current,
      },
    });
  };
  return (
    <auctionsContext.Provider
      value={{
        auctions: auctionsData?.auctions || [],
        myAuctions: [],
        auctionsWhereImMember: [],
        auctionsLoading,
        auctionsError: auctionsError?.message || "",
        myAuctionsLoading: false,
        myAuctionsError: "",
        auctionsWhereImMemberLoading: false,
        auctionsWhereImMemberError: "",
        fetchMoreAuctions,
        fetchMoreMyAuctions: () => {},
        fetchMoreAuctionsWhereImMember: () => {},
      }}
    >
      {children}
    </auctionsContext.Provider>
  );
};

export default AuctionsProvider;
