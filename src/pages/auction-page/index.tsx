import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Subscription, filter } from "rxjs";
import AUCTION_QUERIES from "../../api/auction/auction.queries";
import AuctionSchema from "../../api/auction/schemas/auction.schema";
import { UserSchema } from "../../api/auth/schemas/user.schema";
import { MessageSchema } from "../../api/conversation/schemas/message.schema";
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
              data.scope === "auction.message.send" &&
              data.payload?.conversation?.auction.id === auction.id
            );
          })
        )
        .subscribe((data) => {
          if (data.payload) {
            setAuction((prev) => {
              if (!prev) return prev;
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
            });
          }
        });
    }
    return () => {
      sub?.unsubscribe();
    };
  }, [auction?.id, observable]);

  if (loading && !auction) {
    return <div>loading..</div>;
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

  return (
    <div className="flex">
      <ConversationContainer
        conversation={auction?.conversation!}
        user={user}
        onMessageSend={onMessageSend}
      />
    </div>
  );
};

export default AuctionPage;
