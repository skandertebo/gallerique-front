import { gql } from "@apollo/client";

const AUCTION_QUERIES = {
  GET_AUCTIONS: gql`
    query getAuctions($limit: Int, $offset: Int) {
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
        isMember
      }
    }
  `,

  JOIN_AUCTION: gql`
    mutation joinAuction($id: Int!) {
      joinAuction(id: $id) {
        id
      }
    }
  `,

  GET_AUCTION: gql`
    query getAuction($id: Int!, $messagesPage: Int, $messagesLimit: Int) {
      auction(id: $id) {
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
        members {
          id
          firstName
          lastName
          email
        }
        bids {
          owner {
            id
          }
          price
        }
        conversation {
          messages(page: $messagesPage, limit: $messagesLimit) {
            id
            content
            createdAt
            sender {
              id
              firstName
              lastName
              email
            }
          }
        }
      }
    }
  `,
};

export default AUCTION_QUERIES;
