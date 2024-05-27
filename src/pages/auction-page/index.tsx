import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { useParams } from "react-router-dom";
import { Subscription, filter } from "rxjs";
import AUCTION_QUERIES from "../../api/auction/auction.queries";
import AuctionSchema from "../../api/auction/schemas/auction.schema";
import { UserSchema } from "../../api/auth/schemas/user.schema";
import { MessageSchema } from "../../api/conversation/schemas/message.schema";
import BidContainer from "../../components/BidContainer";
import { useAuth } from "../../context/auth.context";
import { useWebsocketObservable } from "../../context/websocketObservable.context";
import generateRandomString from "../../utils/generateRandomString";
import ConversationContainer from "./ConversationContainer";

const AuctionPage: React.FC = () => {
  const { user } = useAuth();
  const params = useParams<{ id: string }>();
  if (!user) return null;
  if (!params.id) return <div>Invalid ID</div>;
  return <AuctionPageInner id={parseInt(params.id)} user={user} />;
};

export interface AuctionPageProps {
  id: number;
  user: UserSchema;
}

const AuctionPageInner: React.FC<AuctionPageProps> = ({ id, user }) => {
  const { data, loading } = useQuery<{
    auction: AuctionSchema;
  }>(AUCTION_QUERIES.GET_AUCTION, {
    variables: {
      id,
      messagesPage: 1,
      messagesLimit: 50,
    },
  });

  const [auction, setAuction] = useState<AuctionSchema | null>(null);
  const { observable, send } = useWebsocketObservable();
  useEffect(() => {
    if (data && !loading && !auction) {
      setAuction(data.auction);
    }
  }, [data, loading, auction]);

  useEffect(() => {
    let sub: Subscription | null = null;
    if (auction) {
      sub = observable
        .pipe(
          filter((data) => {
            return (
              (data.scope === "auction.message.send" &&
                data.payload?.conversation?.auction.id === auction.id) ||
              (data.scope === "auction.bid.send" &&
                data.payload?.auction?.id === auction.id)
            );
          })
        )
        .subscribe((data) => {
          if (data.payload) {
            setAuction((prev) => {
              if (!prev) return prev;
              if (data.scope === "auction.message.send") {
                if (data.requestId) {
                  const messageWithRequestId = prev.conversation?.messages.find(
                    (msg) => msg.requestId === data.requestId
                  );
                  if (messageWithRequestId) {
                    return {
                      ...prev,
                      conversation: {
                        ...prev.conversation!,
                        messages: [
                          data.payload,
                          ...prev.conversation!.messages.filter(
                            (msg) => msg.requestId !== data.requestId
                          ),
                        ],
                      },
                    };
                  }
                }
                return {
                  ...prev,
                  conversation: {
                    ...prev.conversation!,
                    messages: [data.payload, ...prev.conversation!.messages],
                  },
                };
              } else if (data.scope === "auction.bid.send") {
                // Handle bid update
                if (data.requestId) {
                  const bidWithRequestId = prev.bids.find(
                    (bid) => bid.requestId === data.requestId
                  );
                  if (bidWithRequestId) {
                    return {
                      ...prev,
                      bids: [
                        data.payload,
                        ...prev.bids.filter(
                          (bid) => bid.requestId !== data.requestId
                        ),
                      ].sort((a, b) => a.price - b.price),
                    };
                  }
                }
                return {
                  ...prev,
                  bids: [data.payload, ...prev.bids],
                };
              }
              return prev;
            });
          }
        });
    }
    return () => {
      sub?.unsubscribe();
    };
  }, [auction?.id, observable]);

  if (loading && !auction) {
    return (
      <div className="h-[95vh] w-screen flex justify-center items-center">
        <AiOutlineLoading className="h-12 w-12 animate-spin text-palette-5" />
      </div>
    );
  }
  if (!auction) return null;

  const onMessageSend = async (content: string) => {
    const requestId = generateRandomString(12);
    const message = {
      content,
      auctionId: auction.id,
    };
    const optimisticMessage: Partial<MessageSchema> & {
      requestId: string;
    } = {
      sender: user,
      content,
      requestId,
    };
    setAuction((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        conversation: {
          ...prev.conversation!,
          messages: [
            optimisticMessage as MessageSchema,
            ...prev.conversation!.messages,
          ],
        },
      };
    });
    send({
      scope: "auction.message.send",
      payload: message,
      requestId,
    });
  };

  const onBid = async (price: number) => {
    const requestId = generateRandomString(12);
    const bid = {
      price,
      auctionId: auction.id,
    };
    const optimisticBid = {
      owner: user,
      price,
      requestId,
      createdAt: "",
      auction,
      updatedAt: "",
      deletedAt: "",
      id: -1,
    };
    setAuction((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        bids: [optimisticBid, ...prev.bids].sort((a, b) => a.price - b.price),
      };
    });
    send({
      scope: "auction.bid.send",
      payload: bid,
      requestId,
    });
  };

  return (
    <div className="md:flex justify-between h-fit">
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center p-4 md:w-1/2  mb-6 mt-12">
          <h1 className="text-4xl font-bold text-palette-5 mb-4">
            {auction.title}
          </h1>
          <img
            src={auction.image ?? "/cam.jpg"}
            alt="Auction Image"
            className="rounded-lg mb-4 w-3/4"
          />
          <p className="text-palette-0 font-bold">{auction.description}</p>
        </div>
        <BidContainer
          bids={auction?.bids}
          me={user}
          onBid={onBid}
          auction={auction}
        />
      </div>
      <div className="ml-auto h-full p-16">
        <ConversationContainer
          conversation={auction?.conversation!}
          user={user}
          onMessageSend={onMessageSend}
        />
      </div>
    </div>
  );
};

export default AuctionPage;
