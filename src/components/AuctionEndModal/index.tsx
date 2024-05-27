import Confetti from "react-confetti";
import AuctionSchema from "../../api/auction/schemas/auction.schema";
import { UserSchema } from "../../api/auth/schemas/user.schema";
import useViewport from "../../hooks/useViewport";
import GenericModal, { GenericModalProps } from "../GenericModal";

export interface AuctionEndModal extends GenericModalProps {
  auction: AuctionSchema;
  me: UserSchema;
}

const AuctionEndModal: React.FC<AuctionEndModal> = ({
  auction,
  me,
  ...rest
}) => {
  const { width, height } = useViewport();
  return (
    <GenericModal {...rest}>
      <div className="flex flex-col gap-4 text-xl py-8 px-16 text-center">
        {auction.winner?.id === me.id ? (
          <>
            <Confetti width={width} height={height} />
            <h1 className="text-palette-6 font-semibold text-3xl">
              Congratulations!
            </h1>
            <h2 className="text-palette-1 font-semibold text-2xl">
              You have won {auction.title}
            </h2>
            <p className="text-palette-5">
              You have won the auction for {auction.currentPrice}
            </p>
          </>
        ) : (
          <>
            <h1 className="text-palette-6 font-semibold text-3xl">
              Auction Ended
            </h1>
            <h2 className="text-palette-1 font-semibold text-2xl">
              {auction.winner?.firstName} {auction.winner?.lastName} has won
              &nbsp;
              {auction.title}
            </h2>
            <p className="text-palette-5">
              The auction ended at {new Date(auction.endTime).toUTCString()}
            </p>
          </>
        )}
      </div>
    </GenericModal>
  );
};

export default AuctionEndModal;
