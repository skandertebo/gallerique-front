import { useState } from "react";
import { useAuth } from "../../context/auth.context";
import { AiOutlineLoading } from "react-icons/ai";
import PAYMENT_QUERIES from "../../api/payment/payment.queries";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";

export default function AddFundPage(): JSX.Element {
  const { user } = useAuth();
  const [credit, setCredit] = useState(user?.credit);
  const [createPayment, { loading: createPaymentLoading }] = useMutation(
    PAYMENT_QUERIES.CREATE_PAYMENT
  );
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (user?.credit === undefined) return;
    setCredit(Number(e.target.value) + user?.credit);
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const amount = Number(e.currentTarget.amount.value) * 100;
    if (amount <= 0.5) return;
    try {
      const result = await createPayment({ variables: { amount } });
      if (result.data.topUpWallet) {
        //redirect to external payment gateway
        window.location.href = result.data.topUpWallet;
      }
    } catch (error) {
      toast.error("Failed to add fund");
    }
  };
  return (
    <div className="flex flex-col">
      <header className="w-[95%] mt-2 sm:mx-8 mx-2 border-b-2 border-palette-5 py-2 sm:py-4">
        <h1 className="text-4xl font-semibold text-palette-5">Add Fund</h1>
      </header>
      <div className="flex flex-col w-full sm:mx-8 mx-2 my-4">
        <div className="w-[60%] sm:w-[40%] mx-auto flex flex-col gap-2">
          <h2 className="text-3xl w-full text-center font-semibold text-palette-5 mt-4">
            Current Credit
          </h2>
          <p className="text-5xl w-full text-center font-semibold text-palette-5 mt-4">
            {user?.credit + " "}
            <span className="text-3xl">£ur</span>
          </p>
          <p className="text-md w-full text-center font-semibold text-palette-6 -mt-1">
            your new credit will be{" " + credit + " "}£ur
          </p>
          <form
            className="w-[40%] mx-auto flex flex-row gap-1 flex-wrap mt-8"
            onSubmit={onSubmit}
          >
            <input
              type="number"
              step="any"
              name="amount"
              placeholder="Amount"
              required
              min="0"
              max="10000"
              className="w-full border border-palette-5 rounded-md p-2 mx-auto mb-4"
              onChange={onInputChange}
            />
            <button
              type="submit"
              className="w-full bg-palette-5 text-white text-lg font-semibold rounded-md p-2 mx-auto mt-2"
              disabled={createPaymentLoading}
            >
              {createPaymentLoading ? (
                <AiOutlineLoading className="animate-spin h-5 w-5 mx-auto" />
              ) : (
                "Add Fund"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
