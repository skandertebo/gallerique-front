import { gql } from "@apollo/client";

const AUTH_QUERIES = {
  REGISTER: gql`
    mutation RegisterUser(
      $email: String!
      $password: String!
      $firstName: String!
      $lastName: String!
      $address: String!
    ) {
      register(
        registerInput: {
          email: $email
          password: $password
          firstName: $firstName
          lastName: $lastName
          address: $address
        }
      ) {
        access_token
        user {
          id
          email
          firstName
          lastName
          address
          credit
          status
        }
      }
    }
  `,
  LOGIN: gql`
    mutation LoginUser($email: String!, $password: String!) {
      login(loginInput: { email: $email, password: $password }) {
        access_token
        user {
          id
          email
          firstName
          lastName
          address
          credit
          status
        }
      }
    }
  `,
  WHOAMI: gql`
    query {
      whoAmI {
        email
        firstName
        lastName
        address
        credit
        status
        id
      }
    }
  `,
};

export default AUTH_QUERIES;
