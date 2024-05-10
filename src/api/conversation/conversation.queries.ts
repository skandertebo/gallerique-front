import { gql } from "@apollo/client";

const CONVERSATION_QUERIES = {
  CREATE_MESSAGE: gql`
    mutation createMessage(content: String!, conversationId: Int!) {
      createMessage(content: $content, conversationId: $conversationId) {
        id
        content
        createdAt
        sender {
          id
          firstName
          lastName
        }
      }
    }
  `,
};

export default CONVERSATION_QUERIES;
