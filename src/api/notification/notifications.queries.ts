import { gql } from "@apollo/client";

const NOTIFICATION_QUERIES = {
  GET_NOTIFICATIONS: gql`
    query GetNotifications {
      notificationsOfUser(limit: 5, page: 1) {
        title
        content
        createdAt
      }
    }
  `,
};

export default NOTIFICATION_QUERIES;
