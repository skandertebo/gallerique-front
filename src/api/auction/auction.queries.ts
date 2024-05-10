import { gql } from "@apollo/client";

const AUCTION_QUERIES = {
  GET_AUCTIONS: gql`
    query GetAuctions($limit: Int, $offset: Int) {
      auctions(limit: $limit, page: $offset) {
        id
        title
        description
        startDate
        endTime
        startPrice
        currentPrice
        owner {
          id
          firstName
          lastName
          email
        }
      }
    }
  `,
};

export default AUCTION_QUERIES;
