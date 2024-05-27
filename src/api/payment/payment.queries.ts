import { gql } from "@apollo/client";

const PAYMENT_QUERIES = {
  CREATE_PAYMENT: gql`
    mutation topUpWallet($amount: Float!) {
      topUpWallet(paymentInput: { amount: $amount })
    }
  `,
};

export default PAYMENT_QUERIES;
